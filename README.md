# aliorpse.me

A single-page personal homepage. React 19, TypeScript, and Vite.

## Development

```sh
pnpm install
pnpm dev
pnpm build
pnpm lint
```

Requires Node.js 22.12+ and pnpm (the version is pinned in `packageManager`).

## Content

- Personal details, stack, and key links: `src/data/profile.ts`
- Terminal commands and outputs: `src/data/commands.ts`
- GPG public key: `public/keys/aliorpse-gpg.asc`
- SSH public key: `public/keys/aliorpse-ssh.pub`
- Self-hosted, subset Adwaita Sans & Adwaita Mono: `src/assets/fonts/`
- Font license: `public/licenses/adwaita-fonts-OFL.txt`
- Avatar used only as the favicon: `public/favicon.png`

Public keys are served as stable static files. `vite.config.ts` reads
`public/keys/aliorpse-ssh.pub` at build time and inlines it as
`__SSH_PUBLIC_KEY__`, so the key is not duplicated in source and the page makes
no runtime request for it.

The GPG fingerprint in `src/data/profile.ts` must match
`public/keys/aliorpse-gpg.asc`; CI checks this on every push and pull request.

Fonts live under `src/assets/fonts`; `public/` holds the keys, favicon,
font license, and deployment CNAME.

The layout is designed to fit a single, non-scrolling viewport at common
desktop and phone sizes. On very short screens the page falls back to normal
scrolling rather than clipping content.
