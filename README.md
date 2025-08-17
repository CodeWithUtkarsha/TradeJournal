# TradeJournal Frontend

A modern trading journal application built with React, TypeScript, and Vite.

## Features

- 📊 Performance Matrix - Visual heatmap of daily trading performance
- 📈 Analytics Dashboard - Comprehensive trading statistics and insights
- 💼 Trade Management - Add, edit, and delete trading records
- 🔐 User Authentication - Secure login and registration
- 📱 Responsive Design - Works on desktop and mobile devices
- 🎨 Modern UI - Built with ShadCN UI components

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: TanStack Query (React Query)
- **Authentication**: JWT tokens
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/CodeWithUtkarsha/TradeJournal.git
   cd TradeJournal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your backend API URL:

   ```
   VITE_API_URL=your_backend_api_url
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── pages/              # Application pages/routes
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-api.com
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Backend Repository

The backend API is deployed separately. Contact the development team for backend setup instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
