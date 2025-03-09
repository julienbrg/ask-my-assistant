# ask-my-assistant

A Next.js application featuring a conversational interface with Francesca, powered by [Rukh API](https://github.com/w3hc/rukh).

The app is meant to be deployable by anyone. Feel free to reach out to [Julien](https://github.com/julienbrg) if you need help.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ask-my-assistant.git
cd ask-my-assistant
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```
# Get yours at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID='your_project_id'

# RPC endpoint
NEXT_PUBLIC_RPC_ENDPOINT_URL='https://sepolia.gateway.tenderly.co'

# Only needed if using the faucet API
NEXT_PUBLIC_SIGNER_PRIVATE_KEY='your_private_key'
```

5. Start development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` 🚀

## Development Commands

```bash
pnpm dev           # Start development server
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm format        # Format code with Prettier
pnpm test          # Run tests
```

## Support

Feel free to reach out to [Julien](https://github.com/julienbrg) through:

- Element: [@julienbrg:matrix.org](https://matrix.to/#/@julienbrg:matrix.org)
- Farcaster: [julien-](https://warpcast.com/julien-)
- Telegram: [@julienbrg](https://t.me/julienbrg)
- Twitter: [@julienbrg](https://twitter.com/julienbrg)
- Discord: [julienbrg](https://discordapp.com/users/julienbrg)
- LinkedIn: [julienberanger](https://www.linkedin.com/in/julienberanger/)

<img src="https://bafkreid5xwxz4bed67bxb2wjmwsec4uhlcjviwy7pkzwoyu5oesjd3sp64.ipfs.w3s.link" alt="built-with-ethereum-w3hc" width="100"/>
