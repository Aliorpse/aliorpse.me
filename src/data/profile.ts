export const profile = {
  handle: 'Aliorpse',
  stack: 'Rust · Kotlin · TypeScript',
  email: 'aliorpse@qq.com',
  github: 'https://github.com/Aliorpse',
  gpg: {
    href: '/keys/aliorpse-gpg.asc',
    filename: 'aliorpse-gpg.asc',
  },
  ssh: {
    href: '/keys/aliorpse-ssh.pub',
    filename: 'aliorpse-ssh.pub',
  },
} as const

export function formatFingerprint(fingerprint: string) {
  return fingerprint.replace(/(.{4})/g, '$1 ').trim()
}

export function shortenSshKey(key: string) {
  const [algorithm, body = ''] = key.trim().split(/\s+/)
  return body ? `${algorithm} ${body.slice(0, 12)}…${body.slice(-6)}` : key.trim()
}
