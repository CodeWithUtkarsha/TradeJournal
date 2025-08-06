# Trading Journal Platform

## Overview

This is a TradeZella-inspired premium trading journal platform designed to help traders track, analyze, and optimize their trading performance. The application features a modern dark/blue UI with cyberpunk aesthetics, comprehensive trade logging capabilities, advanced analytics, and AI-powered insights. Built as a full-stack web application with real-time data visualization and mobile-responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring dark navy, electric blue, and cyber purple theme
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful API with centralized error handling middleware
- **Session Management**: Express sessions with PostgreSQL session storage

### Data Storage Solutions
- **Database**: PostgreSQL as the primary database
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL connection
- **Migrations**: Drizzle Kit for database schema migrations
- **Schema Design**: Comprehensive user and trade tracking with support for analytics, tags, screenshots, and trading strategies

### Authentication and Authorization
- **Strategy**: JWT token-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Token Storage**: localStorage on client-side
- **Protected Routes**: Custom ProtectedRoute component with automatic redirect
- **Session Persistence**: PostgreSQL-backed session storage using connect-pg-simple

### Key Features Architecture
- **Trade Logging**: Comprehensive trade entry with mood tracking, strategy tagging, and screenshot uploads
- **Analytics Engine**: Real-time calculation of trading metrics including P&L, win rates, and performance breakdowns
- **Dashboard**: Modular widget-based interface with quick trade logging and AI insights
- **Profile Management**: User preference management with trading-specific settings
- **Responsive Design**: Mobile-first approach with progressive web app capabilities

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod resolvers
- **Routing**: Wouter for lightweight routing
- **State Management**: TanStack React Query for server state
- **UI Components**: Full shadcn/ui component library with Radix UI primitives

### Styling and Design
- **CSS Framework**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React icon library
- **Animations**: Class Variance Authority for component variants
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend Infrastructure
- **Web Framework**: Express.js with TypeScript support
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: jsonwebtoken and bcrypt
- **Session Management**: express-session with connect-pg-simple

### Development Tools
- **Build System**: Vite with React plugin and TypeScript
- **Development Experience**: Replit-specific plugins for error handling and cartographer
- **Type Safety**: Full TypeScript configuration with strict mode
- **Code Quality**: ESM modules with modern JavaScript features

### Potential Future Integrations
- **Trading APIs**: Broker integrations for automatic trade import
- **Real-time Data**: WebSocket connections for live market data
- **Analytics APIs**: Third-party services for advanced market analysis
- **Cloud Storage**: Image hosting for trade screenshots
- **AI Services**: Machine learning APIs for trading pattern recognition