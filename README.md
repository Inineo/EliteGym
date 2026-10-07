# EliteGym - Fitness Membership Management System

A modern, full-featured gym membership management web application built with Next.js and React. EliteGym provides a seamless experience for gym members to manage their profiles, track progress, and upgrade membership packages.

## 📋 Project Overview

EliteGym is a web-based fitness membership management platform designed to streamline gym member interactions. The application provides an intuitive interface for users to track their fitness journey, manage subscriptions, and monitor their gym activity statistics.

## 🎯 Problem / Background

Traditional gym membership management often involves:
- Manual tracking of visits and progress
- Complicated package upgrade processes
- Lack of real-time member statistics
- Poor user experience for profile management

EliteGym solves these problems by providing a centralized, user-friendly platform where members can:
- View their membership status at a glance
- Track fitness progress with visual indicators
- Easily upgrade or change subscription packages
- Manage personal information and preferences

## ✨ Features

### Core Features
- **User Authentication**
  - Secure login and registration system
  - Persistent authentication state with localStorage
  - Default demo account (sarah.miller@example.com)

- **Profile Management**
  - View and edit personal information
  - Track membership details and renewal dates
  - Display member ID and avatar
  - View payment methods

- **Progress Tracking**
  - Daily check-in monitoring
  - Total visits counter
  - Best streak tracking
  - Progress cycle visualization (days in current period)

- **Membership Packages**
  - Multiple package tiers (Individual, Partnership, Squad)
  - Real-time package upgrades
  - Pricing comparison
  - Package perks and benefits display

- **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
  - Modern, dark-themed UI

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.7](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.2.4](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React 1.17.0](https://lucide.dev/)

### Development Tools
- **Linting**: ESLint 9 with Next.js config
- **PostCSS**: Tailwind PostCSS integration
- **Package Manager**: npm

## 🏗️ Architecture

### Application Structure

```
EliteGym (Single Page Application)
├── Client-Side Rendering ('use client')
├── State Management (React useState + localStorage)
├── Component-Based Architecture
└── Tab-Based Navigation System
```

### Data Flow

1. **Initial Load**: Hydrate state from localStorage
2. **User Actions**: Update React state
3. **State Persistence**: Sync changes to localStorage
4. **Re-render**: Components reflect updated state

### State Management

- **User State**: Stored in localStorage as `elite_fitness_user`
- **Auth State**: Stored in localStorage as `elite_fitness_logged_in`
- **Hydration**: Client-side only to prevent SSR mismatch

## 👤 User Flow / How It Works

### 1. First Visit
```
Landing Page → HomeView → Browse Features
```

### 2. Registration
```
Register Button → Fill Form → Create Account → Auto Login → Profile View
```

### 3. Login
```
Login Button → Enter Email → Verify → Access Profile
```

### 4. Package Upgrade
```
Packages Tab → Compare Options → Select Package → Confirm → Update Profile
```

### 5. Profile Management
```
Profile Tab → View Stats → Edit Information → Save Changes → Update Persisted
```

## 🚀 Installation

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd elitegym
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
```
http://localhost:3000
```

The application will hot-reload as you make changes to the code.

## 📁 Project Structure

```
elitegym/
├── app/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Footer with links
│   │   ├── HomeView.tsx     # Landing page view
│   │   ├── PackagesView.tsx # Membership packages
│   │   ├── ProfileView.tsx  # User profile & stats
│   │   ├── LoginView.tsx    # Login form
│   │   └── RegisterView.tsx # Registration form
│   ├── page.tsx             # Main app entry point
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── types.ts             # TypeScript interfaces
├── public/                  # Static assets
├── .next/                   # Next.js build output
├── node_modules/            # Dependencies
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
└── README.md                # This file
```

### Key Files

- **[`app/page.tsx`](file:///e:/Web/elitegym/app/page.tsx)**: Main application logic with state management
- **[`app/types.ts`](file:///e:/Web/elitegym/app/types.ts)**: TypeScript type definitions for UserProfile, PackageOption
- **[`app/components/`](file:///e:/Web/elitegym/app/components/)**: Reusable view components

## 💡 Development Process

### Design Principles
1. **Component Modularity**: Each view is a separate component
2. **State Centralization**: Main state managed in `page.tsx`
3. **Type Safety**: Full TypeScript coverage for data structures
4. **Persistence**: localStorage for client-side data persistence
5. **Responsive First**: Mobile-optimized with Tailwind utilities

### Key Implementation Decisions

- **Client-Side Only**: Using `'use client'` directive for full client-side rendering
- **Mock Authentication**: Demo account for testing without backend
- **Tab Navigation**: Single-page app with tab-based routing
- **Progressive Enhancement**: Hydration safety with `isMounted` flag

## 🔮 Future Improvements

### Planned Features
- [ ] Backend API integration (REST/GraphQL)
- [ ] Real database for user persistence
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Real-time check-in system with QR codes
- [ ] Workout tracking and exercise logs
- [ ] Class booking system
- [ ] Trainer appointment scheduling
- [ ] Push notifications for renewal reminders
- [ ] Multi-language support (i18n)
- [ ] Analytics dashboard for admins
- [ ] Social features (friend challenges, leaderboards)
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] Add unit tests (Jest/React Testing Library)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Implement proper authentication (JWT/OAuth)
- [ ] Add form validation library (Zod/Yup)
- [ ] State management library (Zustand/Jotai)
- [ ] API layer with React Query
- [ ] PWA support for offline functionality
- [ ] Image optimization for avatars
- [ ] Accessibility improvements (WCAG compliance)
- [ ] SEO optimization

## 📜 License

This project is private and proprietary.

---

**Built with ❤️ using Next.js and React**
