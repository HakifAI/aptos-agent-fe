# Aptos AI Agent Frontend

A sophisticated React-based frontend for interacting with an AI-powered Aptos blockchain agent. This application provides an intuitive chat interface that enables users to perform complex DeFi operations, manage digital assets, and interact with the Aptos ecosystem through natural language conversations.

## 🌟 Features

### 🤖 AI-Powered Blockchain Interactions
- **Natural Language Processing**: Communicate with your Aptos agent using everyday language
- **Smart Transaction Management**: Execute swaps, transfers, and other DeFi operations through conversation
- **Real-time Market Data**: Get live token prices, pool information, and market analytics

### 💰 Wallet & Asset Management
- **Multi-Wallet Support**: Connect with various Aptos-compatible wallets
- **Portfolio Overview**: View token balances, transaction history, and asset performance
- **Secure Authentication**: JWT-based authentication with wallet integration

### 🔄 DeFi Operations
- **Token Swapping**: Execute trades across multiple DEX platforms (PancakeSwap, Cellana, Hyperion)
- **Pool Discovery**: Find optimal trading pools and liquidity opportunities
- **Gas Estimation**: Real-time gas cost calculations for transactions
- **Transaction Monitoring**: Track transaction status and history

### 🎨 Modern User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Mode**: Customizable interface themes
- **Real-time Updates**: Live data streaming and transaction updates
- **Interactive Components**: Drag-and-drop file uploads, expandable panels

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn
- An Aptos wallet (Petra, Martian, etc.)
- Running Aptos AI Agent Backend

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aptos-agent-fe
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

4. **Set environment variables**
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Aptos Network Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1

# Optional: Analytics and monitoring
NEXT_PUBLIC_LANGSMITH_API_KEY=your-langsmith-key
```

5. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | ✅ | `http://localhost:3001` |
| `NEXT_PUBLIC_JWT_SECRET` | JWT signing secret | ✅ | - |
| `NEXT_PUBLIC_APTOS_NETWORK` | Aptos network (mainnet/testnet) | ✅ | `testnet` |
| `NEXT_PUBLIC_APTOS_NODE_URL` | Aptos node RPC URL | ✅ | - |
| `NEXT_PUBLIC_LANGSMITH_API_KEY` | LangSmith API key | ❌ | - |

### Wallet Configuration

The application supports multiple Aptos wallets:
- **Petra Wallet**: Most popular Aptos wallet
- **Martian Wallet**: Feature-rich wallet with DeFi integration
- **Pontem Wallet**: Developer-focused wallet
- **Fewcha Wallet**: Lightweight browser extension

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js 14 App Router
│   ├── (home)/            # Main chat interface
│   ├── authenticate/      # Wallet connection flow
│   └── api/               # API route handlers
├── components/
│   ├── asset-tab/         # Portfolio and asset management
│   ├── connect/           # Wallet connection components
│   ├── thread/            # Chat interface and messaging
│   ├── ui/                # Reusable UI components
│   └── icons/             # Custom icon library
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and clients
├── providers/             # Context providers
└── types/                 # TypeScript type definitions
```

### Key Components

#### Chat Interface (`components/thread/`)
- **Agent Inbox**: Main conversation interface with the AI agent
- **Message Types**: Support for text, tool calls, and interactive components
- **Artifacts**: Side panel for displaying transaction details and results

#### Wallet Integration (`components/connect/`)
- **Wallet Selector**: Multi-wallet connection interface
- **Authentication**: Secure wallet-based login system
- **Account Management**: Profile and settings management

#### Asset Management (`components/asset-tab/`)
- **Portfolio View**: Token balances and portfolio performance
- **Transaction History**: Detailed transaction logs with status tracking
- **Asset Details**: Individual token information and market data

## 🔗 Integration with Backend

The frontend communicates with the Aptos AI Agent Backend through:

### API Endpoints
- `/api/auth/*` - Authentication and user management
- `/api/agent/*` - AI agent interactions and chat
- `/api/wallet/*` - Wallet operations and balance queries
- `/api/token/*` - Token data and market information
- `/api/dex/*` - DEX operations and pool data

### Real-time Features
- **WebSocket Connections**: Live updates for transactions and market data
- **Server-Sent Events**: Streaming responses from AI agent
- **Optimistic Updates**: Immediate UI feedback with rollback capability

## 🛠️ Development

### Available Scripts
```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking

# Testing
pnpm test         # Run unit tests
pnpm test:e2e     # Run end-to-end tests
```

### Code Quality
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS**: Utility-first styling framework

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker Deployment
```bash
# Build image
docker build -t aptos-agent-fe .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend-url \
  -e NEXT_PUBLIC_APTOS_NETWORK=mainnet \
  aptos-agent-fe
```

### Environment-Specific Configuration

#### Testnet
```bash
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
```

#### Mainnet
```bash
NEXT_PUBLIC_APTOS_NETWORK=mainnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com/v1
```

## 🔐 Security

### Wallet Security
- Private keys never leave the user's wallet
- All transactions require explicit user approval
- Secure authentication using wallet signatures

### Data Protection
- JWT tokens for session management
- HTTPS-only in production
- No sensitive data stored in localStorage

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code standards**: Run `pnpm lint` and `pnpm type-check`
4. **Write tests**: Ensure new features have adequate test coverage
5. **Commit changes**: Use conventional commits
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Use TypeScript for all new code
- Follow the established component patterns
- Write comprehensive tests for new features
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

- 📖 [Aptos Documentation](https://aptos.dev/)
- 💬 [Aptos Discord](https://discord.gg/aptoslabs)
- 🐛 [Report Issues](https://github.com/your-org/aptos-agent-fe/issues)
- 🎥 [Demo Videos](https://your-demo-links.com)

## 🔗 Related Projects

- **[Aptos AI Agent Backend](../aptos-ai-agent-be/)** - Node.js backend service
- **[Aptos Agent Core](../aptos-agent/)** - LangGraph agent implementation
- **[Aptos SDK](https://github.com/aptos-labs/aptos-ts-sdk)** - Official TypeScript SDK

---

<div align="center">
  <strong>Built for the Aptos ecosystem with ❤️</strong>
</div>
