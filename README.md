# Carbon Credit Buyer Marketplace

A demo marketplace application for carbon credit trading and retirement, built with Next.js 15, TypeScript, and TailwindCSS.

## Features

- **Public Browse**: Browse available carbon credit projects and classes
- **Buyer Dashboard**: Manage holdings, view recent activity, and track portfolio
- **Shopping Cart**: Add credits to cart and manage quantities
- **Checkout Process**: Complete purchases with registry integration
- **Retirement Certificates**: Retire credits and generate certificates
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: HTTP-only cookies with CSRF protection
- **Icons**: Lucide React
- **Testing**: Playwright (e2e) + Vitest (unit)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Docker and Docker Compose (for full stack)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd buyer-marketplace
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
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

## Project Structure

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
└── styles/              # Global styles
    └── globals.css       # TailwindCSS imports
```

## API Integration

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

## Demo User

For testing purposes, use these credentials:

- **Email**: `buyer@buyerco.local`
- **Password**: `Buyer@123`

## Key Features

### Public Browsing
- View all active carbon credit projects
- Filter by region, methodology, vintage
- See available credits per class
- Access project and class details

### Buyer Dashboard
- Overview of holdings and portfolio value
- Recent activity and transactions
- Quick actions for common tasks
- Holdings table with retirement options

### Shopping Cart
- Add credits from class detail pages
- Adjust quantities with validation
- Remove items or clear entire cart
- Proceed to secure checkout

### Checkout Process
- Review order items and totals
- Complete purchase via registry API
- Generate order confirmation
- Transfer credits to buyer account

### Retirement Certificates
- Retire purchased credits
- Generate permanent certificates
- Track environmental impact
- View retirement history

## Security Features

- **HTTP-only Cookies**: Secure authentication storage
- **CSRF Protection**: Prevents cross-site request forgery
- **Input Validation**: Zod schemas for all form inputs
- **Role-based Access**: Buyer-only actions protected
- **Hash Storage**: Sensitive data (purpose/beneficiary) stored as hashes

## Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

## Deployment

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.
