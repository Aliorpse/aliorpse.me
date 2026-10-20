import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const readKey = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8').trim()

// v4 OpenPGP fingerprint: SHA-1 over 0x99 || 2-byte length || public-key packet body
// (RFC 4880 §12.2). Deriving it from the .asc means there is no second copy to keep in sync.
function pgpFingerprint(armored: string) {
  const base64 = armored
    .split(/\r?\n/)
    .filter((line) => line && !/^(-----|=|[A-Za-z-]+:)/.test(line))
    .join('')
  const buf = Buffer.from(base64, 'base64')

  const header = buf[0] ?? 0
  const isNewFormat = (header & 0x40) !== 0
  const tag = isNewFormat ? header & 0x3f : (header & 0x3c) >> 2
  if (tag !== 6) throw new Error('GPG key: first packet is not a public key')

  let offset: number
  let length: number
  if (isNewFormat) {
    const first = buf[1] ?? 0
    if (first < 192) {
      ;[offset, length] = [2, first]
    } else if (first < 224) {
      ;[offset, length] = [3, ((first - 192) << 8) + (buf[2] ?? 0) + 192]
    } else {
      throw new Error('GPG key: unsupported packet length encoding')
    }
  } else {
    const lengthType = header & 3
    if (lengthType === 0) [offset, length] = [2, buf[1] ?? 0]
    else if (lengthType === 1) [offset, length] = [3, buf.readUInt16BE(1)]
    else throw new Error('GPG key: unsupported packet length encoding')
  }

  const body = buf.subarray(offset, offset + length)
  if (body[0] !== 4) throw new Error('GPG key: only v4 keys are supported')

  return createHash('sha1')
    .update(Buffer.from([0x99, length >> 8, length & 0xff]))
    .update(body)
    .digest('hex')
    .toUpperCase()
}

// Keys live in public/keys so they keep stable, curl-able URLs (and back the download
// buttons). They are also read at build time: the SSH key is inlined for the copy
// button, and the GPG fingerprint is derived from the armored key.
const sshPublicKey = readKey('./public/keys/aliorpse-ssh.pub')
const gpgFingerprint = pgpFingerprint(readKey('./public/keys/aliorpse-gpg.asc'))

// https://vite.dev/config/
export default defineConfig({
  define: {
    __SSH_PUBLIC_KEY__: JSON.stringify(sshPublicKey),
    __GPG_FINGERPRINT__: JSON.stringify(gpgFingerprint),
  },
  plugins: [react()],
})
