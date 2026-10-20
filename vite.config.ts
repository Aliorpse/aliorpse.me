import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The SSH public key lives in public/keys so it keeps a stable URL (curl-able),
// and is inlined at build time so the page needs no runtime request for it.
const sshPublicKey = readFileSync(
  new URL('./public/keys/aliorpse-ssh.pub', import.meta.url),
  'utf8',
).trim()

// https://vite.dev/config/
export default defineConfig({
  define: {
    __SSH_PUBLIC_KEY__: JSON.stringify(sshPublicKey),
  },
  plugins: [react()],
})
