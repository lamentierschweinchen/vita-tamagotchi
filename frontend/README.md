# VITA Tamagotchi Frontend

Next.js frontend for the MultiversX community pet.

## Environment

Required:
- `NEXT_PUBLIC_ENVIRONMENT=devnet`
- `NEXT_PUBLIC_CONTRACT_ADDRESS=<contract address>`

Notes:
- Wallet login is handled with MultiversX Extension and Web Wallet providers.
- WalletConnect/xPortal project configuration is not required in this frontend setup.

## Local Run

```bash
npm ci
npm run dev
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## Vercel

Project settings:
- Framework: `Next.js`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Node.js: `22.x`

Production URL alias:
- `https://frontend-three-pi-52.vercel.app`
