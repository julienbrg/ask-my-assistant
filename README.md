# ask-my-assistant

A Next.js application featuring a conversational interface with Francesca, powered by [Fatou API](https://github.com/w3hc/fatou).

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

# Get your Fatou API key from the Fatou repository
FATOU_API_KEY='your_fatou_api_key'
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

## Contact

You can reach out through:

- [Element](https://matrix.to/#/@julienbrg:matrix.org)
- [Farcaster](https://warpcast.com/julien-)
- [Telegram](https://t.me/julienbrg)
- [Twitter](https://twitter.com/julienbrg)
- [Discord](https://discordapp.com/users/julienbrg)
- [LinkedIn](https://www.linkedin.com/in/julienberanger/)
