# Alakh Web - Product Management System

A modern, mobile-first product management website built with Next.js, TypeScript, and SQLite.

## Features

- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🚀 **Fast & Lightweight** - Built with Next.js for optimal performance
- 💾 **Zero Cost** - Uses SQLite (no database costs) and deploys free on Vercel
- 🖼️ **Image Optimization** - Automatic image compression and responsive images
- 🔒 **Simple Admin** - Password-protected admin panel
- 🎨 **Modern UI** - Clean, minimalist design with two light colors (Soft Slate Blue & Warm Cream)
- ✨ **Professional Aesthetic** - Calm, non-vibrant color palette focused on products

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp
- **Hosting**: Vercel (free tier)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` and set your admin password

5. Initialize the database:
   ```bash
   npm run db:init
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

## Project Structure

```
├── database/           # SQLite database files
├── public/            # Static assets
│   └── images/        # Product images
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   ├── lib/          # Utility libraries
│   └── types/        # TypeScript types
└── ...config files
```

## Usage

### Public Home Page
- Visit `/` to view all products
- Fully responsive grid layout
- Optimized for all devices

### Admin Panel
- Visit `/admin` to manage products
- Default password: `admin123` (change in .env.local)
- Add, view, and delete products
- Upload product images

## Deployment

### Deploy to Vercel (Free)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable: `ADMIN_PASSWORD`
4. Deploy!

## Design & Aesthetics

This application features a **minimalist, two-color design**:
- 🎨 **Primary Color**: Soft Slate Blue (#8B9DC3) - Calm, professional
- 🎨 **Secondary Color**: Warm Cream (#F5F1E8) - Warm, inviting
- **Philosophy**: Clean, non-vibrant, product-focused
- **See**: `UI_DESIGN_PLAN.md` for complete design specifications

## Mobile Optimization

This application is built with mobile-first design:
- Touch-friendly UI elements (44px minimum touch targets)
- Responsive images with Next.js Image
- Optimized layouts for all screen sizes (1-4 columns)
- Fast loading on mobile networks
- Camera access for image uploads
- Numeric keyboards for number inputs
- **See**: `MOBILE_FEATURES.md` for complete mobile optimization details

## Future Enhancements

- [ ] Product categories
- [ ] Search and filtering
- [ ] Pagination
- [ ] Product editing
- [ ] Multiple images per product
- [ ] Inventory management
- [ ] Shopping cart
- [ ] Payment integration

## License

MIT License - feel free to use for your projects!

## Support

For issues or questions, please open an issue on GitHub.
