# Lens Cafe & Lounge Ordering System

A modern, full-featured digital ordering system for cafes, lounges, and shisha bars. Built with Next.js 16, React 19, and Tailwind CSS.

## Features

### Customer Features
- **Digital Menu** - Browse products by category (Coffee, Juices, Hookah/Shisha)
- **Table Selection** - Visual floor plan for selecting seating
- **Cart Management** - Add items with customization options and special notes
- **Order Tracking** - Real-time order status updates
- **Feedback System** - Rate your experience after order completion

### Admin Features
- **Order Management** - View and manage incoming orders in real-time
- **Order Status Updates** - Mark orders as preparing, ready, or completed
- **Analytics Dashboard** - Comprehensive business analytics including:
  - Daily, weekly, monthly, and yearly revenue (Promet)
  - Order counts (Pazare) across all time periods
  - Top-selling products
  - Underperforming products
  - Average order value tracking

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context + Local Storage
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── menu/                 # Menu browsing
│   ├── checkout/             # Order checkout
│   ├── feedback/             # Customer feedback
│   ├── about/                # About page
│   ├── barista/              # Barista order screen
│   └── admin/
│       ├── login/            # Admin authentication
│       └── dashboard/        # Admin dashboard with analytics
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── menu.tsx              # Product menu display
│   ├── cart.tsx              # Shopping cart
│   ├── checkout-form.tsx     # Checkout process
│   ├── order-screen.tsx      # Barista order management
│   ├── analytics-dashboard.tsx # Admin analytics
│   └── ...
├── lib/
│   ├── products.ts           # Product catalog
│   ├── types.ts              # TypeScript definitions
│   ├── order-storage.ts      # Order persistence
│   └── cart-context.tsx      # Cart state management
└── public/
    └── [product images]      # Product photography
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lens-v2
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

Navigate to `/admin/login` to access the admin panel. The admin dashboard includes:
- Real-time order management
- Comprehensive analytics with time period filtering
- Product performance tracking

## Product Categories

### Kafe (Coffee)
- Espresso, Cappuccino, Latte, Turkish Coffee, Americano, Macchiato

### Sokovi (Juices)
- Fresh Orange Juice, Lemon Juice, Smoothies, Iced Tea, Sparkling Water

### Nargile (Hookah)
- Apple, Blueberry, Watermelon, Mint, Mixed Fruits, Forest Berries

## PWA Support

The app includes a web manifest (`public/manifest.json`) for Progressive Web App capabilities, allowing installation on mobile devices.

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## License

Private - All rights reserved.
