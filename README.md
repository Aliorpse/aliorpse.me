# aliorpse.me

A single-page personal homepage. React 19, TypeScript, and Vite.

## Development

```sh
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## Content

- Personal details, stack, and key links: `src/data/profile.ts`
- GPG public key: `public/keys/aliorpse-gpg.asc`
- SSH public key: `public/keys/aliorpse-ssh.pub`
- Self-hosted, subset Adwaita Sans & Adwaita Mono: `src/assets/fonts/`
- Font license: `public/licenses/adwaita-fonts-OFL.txt`
- Avatar used only as the favicon: `public/favicon.png`

Public keys are served as stable static files. The SSH copy button fetches the
key from that file at runtime, so the key is not duplicated in source.

Fonts live under `src/assets/fonts`; `public/` holds the keys, favicon, and
font license.

The layout is designed to fit a single, non-scrolling viewport at common
desktop and phone sizes. On very short screens the page falls back to normal
scrolling rather than clipping content.
