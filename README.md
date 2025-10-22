# Carbon Credit Buyer Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A demo marketplace application for carbon credit trading and retirement, built with Next.js 15, TypeScript, and TailwindCSS.

🌐 **Live Demo**: [https://carbon-credit-buyer-marketplace.vercel.app](https://carbon-credit-buyer-marketplace.vercel.app)  
📖 **Documentation**: [View Documentation](https://github.com/ShantanuVr/carbon-credit-buyer-marketplace/wiki)  
🐛 **Issues**: [Report Bug](https://github.com/ShantanuVr/carbon-credit-buyer-marketplace/issues)  
✨ **Features**: [Request Feature](https://github.com/ShantanuVr/carbon-credit-buyer-marketplace/issues)

## 🚀 Features

- **🌍 Public Browse**: Browse available carbon credit projects and classes
- **👤 Buyer Dashboard**: Manage holdings, view recent activity, and track portfolio
- **🛒 Shopping Cart**: Add credits to cart and manage quantities
- **💳 Checkout Process**: Complete purchases with registry integration
- **🏆 Retirement Certificates**: Retire credits and generate certificates
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🔐 Secure Authentication**: HTTP-only cookies with CSRF protection
- **🧪 Comprehensive Testing**: Unit and E2E tests included

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: HTTP-only cookies with CSRF protection
- **Icons**: Lucide React
- **Testing**: Playwright (e2e) + Vitest (unit)
- **Deployment**: Docker + Vercel ready

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Docker and Docker Compose (for full stack)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShantanuVr/carbon-credit-buyer-marketplace.git
   cd carbon-credit-buyer-marketplace
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3004](http://localhost:3004)

### Docker Development

1. **Start all services:**
   ```bash
   docker compose up -d
   ```

2. **Install dependencies and start dev server:**
   ```bash
   pnpm install
   pnpm dev
   ```

## 🎯 Demo User

For testing purposes, use these credentials:

- **Email**: `buyer@buyerco.local`
- **Password**: `Buyer@123`

## 📁 Project Structure

```
buyer-marketplace/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages (no auth required)
│   │   ├── page.tsx       # Home page
│   │   ├── projects/      # Project listings
│   │   ├── classes/       # Class details
│   │   └── login/         # Login page
│   ├── (buyer)/           # Buyer-only pages
│   │   ├── dashboard/     # Buyer dashboard
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout process
│   │   ├── orders/        # Order history
│   │   └── certificates/  # Retirement certificates
│   └── api/               # API routes
│       ├── health/        # Health check
│       └── auth/          # Authentication
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx        # Navigation bar
│   └── Footer.tsx        # Footer component
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API clients
│   ├── auth.ts          # Authentication helpers
│   ├── env.ts           # Environment validation
│   ├── types.ts         # TypeScript types
│   └── format.ts         # Formatting utilities
├── tests/               # Test files
│   ├── unit/            # Unit tests
│   └── e2e/             # E2E tests
└── styles/              # Global styles
    └── globals.css       # TailwindCSS imports
```

## 🔌 API Integration

The application integrates with three main services:

### Registry API
- **Base URL**: `NEXT_PUBLIC_REGISTRY_API_URL`
- **Endpoints**: Projects, classes, credits, retirements, authentication
- **Authentication**: Bearer token via HTTP-only cookies

### Adapter API  
- **Base URL**: `NEXT_PUBLIC_ADAPTER_API_URL`
- **Endpoints**: Receipts, transactions
- **Access**: Read-only

### Explorer
- **Base URL**: `NEXT_PUBLIC_EXPLORER_BASE_URL`
- **Purpose**: Links to public explorer pages
- **Access**: Read-only

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Test Coverage
```bash
pnpm test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ShantanuVr/carbon-credit-buyer-marketplace)

### Docker Production
```bash
docker build -t buyer-marketplace .
docker run -p 3004:3004 buyer-marketplace
```

### Environment Variables
Ensure all required environment variables are set:
- `NEXT_PUBLIC_REGISTRY_API_URL`
- `NEXT_PUBLIC_ADAPTER_API_URL` 
- `NEXT_PUBLIC_EXPLORER_BASE_URL`
- `NEXT_PUBLIC_BRAND_NAME`
- `COOKIE_NAME`
- `COOKIE_SECURE`

## 🔒 Security Features

- **HTTP-only Cookies**: Secure authentication storage
- **CSRF Protection**: Prevents cross-site request forgery
- **Input Validation**: Zod schemas for all form inputs
- **Role-based Access**: Buyer-only actions protected
- **Hash Storage**: Sensitive data (purpose/beneficiary) stored as hashes

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the consistent icon set

## 📞 Support

- 📧 **Email**: [support@carbonmarketplace.com](mailto:support@carbonmarketplace.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/ShantanuVr/carbon-credit-buyer-marketplace/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ShantanuVr/carbon-credit-buyer-marketplace/discussions)

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/ShantanuVr/carbon-credit-buyer-marketplace)
![GitHub issues](https://img.shields.io/github/issues/ShantanuVr/carbon-credit-buyer-marketplace)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ShantanuVr/carbon-credit-buyer-marketplace)
![GitHub stars](https://img.shields.io/github/stars/ShantanuVr/carbon-credit-buyer-marketplace)

---

<div align="center">
  <strong>Built with ❤️ for Climate Action</strong>
</div>
