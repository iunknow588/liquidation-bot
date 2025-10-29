# Solana Liquidation Bot Web Dashboard

A Next.js-based Solana liquidation bot web application that scans for liquidation opportunities in real-time on the Solend protocol.

## Features

- ✅ Real-time scanning of Solana Mainnet Solend accounts
- ✅ Visual display of liquidation opportunities
- ✅ Health factor calculation and risk assessment
- ✅ Responsive design, mobile-friendly
- ✅ Deploy to Vercel, completely free to run

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Blockchain**: Solana Web3.js
- **RPC**: Helius API
- **Deployment**: Vercel

## Installation

```bash
# Install dependencies
npm install

# Or use yarn
yarn install
```

## Running

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Visit http://localhost:3000

## Usage Instructions

1. Open the page
2. Click the "Start Scan" button
3. Wait for scan completion (usually 2-5 seconds)
4. View account list and liquidation opportunities

## Configuration

### Environment Variables

The project uses `public.env` for public configuration that can be safely uploaded to servers:

```bash
# Sync configuration from backend
./scripts/sync-config.sh
```

This will generate `public.env` with the following public variables:
- `NEXT_PUBLIC_VERSION_*` - Version information
- `NEXT_PUBLIC_SOLANA_*` - Solana RPC configuration
- `NEXT_PUBLIC_HELIUS_API_KEY` - Demo API key (safe to expose)

### Scripts

All automation scripts are located in the `scripts/` directory:

- `sync-config.sh` - Sync backend configuration
- `verify-security.sh` - Verify project security
- `setup-env.sh` - Configure Vercel environment
- `upload-github.sh` - Upload code to GitHub
- `deploy.sh` - Deploy to Vercel
- `full-deploy.sh` - Complete deployment process

## Deployment

### Quick Deployment

```bash
# Complete deployment process
./scripts/full-deploy.sh
```

### Manual Deployment

```bash
# 1. Upload to GitHub
./scripts/upload-github.sh

# 2. Configure environment
./scripts/setup-env.sh

# 3. Deploy to Vercel
./scripts/deploy.sh
```

## Security

- All sensitive files are protected by `.gitignore`
- API keys are server-side only (no `NEXT_PUBLIC_` prefix)
- Public configuration is in `public.env` (safe to upload)
- Security verification before deployment

## Project Structure

```
solana-liquidation-dashboard/
├── app/                    # Next.js app directory
├── lib/                    # Utility libraries
├── scripts/                # Automation scripts
├── docs/                   # Documentation
├── public.env              # Public configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone repository
git clone <repository-url>
cd solana-liquidation-dashboard

# Install dependencies
npm install

# Sync configuration
./scripts/sync-config.sh

# Start development server
npm run dev
```

## API Endpoints

- `GET /api/scan` - Scan for liquidation opportunities
- `GET /api/health` - Health check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run security verification: `./scripts/verify-security.sh`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support, please open an issue in the GitHub repository.

---

**Version**: v1.0.0  
**Last Updated**: 2025-01-29  
**Maintainer**: Development Team
