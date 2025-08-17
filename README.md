# 📈 TradeZella - Advanced Trading Journal

> **🚀 [Live Demo](https://trade-track-phi.vercel.app) | [Backend API](https://render-backend-tradejournal.onrender.com)**

A modern, professional trading journal platform inspired by TradeZella, built for serious forex traders who want to track, analyze, and improve their trading performance.

![TradeZella Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## ✨ Key Features

### 📊 **Performance Matrix**
- Visual heatmap showing daily P&L patterns
- Real-time data visualization from your trading history
- Color-coded intensity based on profit/loss magnitude

### 📈 **Analytics Dashboard** 
- Comprehensive trading statistics and insights
- Performance metrics across different time periods
- Win rate, profit factor, and risk analytics

### 💼 **Trade Management**
- Add, edit, and delete trading records with confirmation
- Detailed trade logging with entry/exit points
- Stop loss and take profit tracking

### 📤 **XM Broker Integration**
- **CSV Import**: Upload your XM broker trading history
- Automatic data parsing and validation
- Bulk import with duplicate filtering

### 🔐 **Secure Authentication**
- JWT-based user authentication
- Protected routes and user sessions
- Profile management with photo uploads

### 🎨 **Modern UI/UX**
- Responsive design for desktop and mobile
- Dark theme with electric blue accents
- Smooth animations and glass morphism effects

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework with TypeScript |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS** | Utility-first styling |
| **ShadCN UI** | Modern component library |
| **TanStack Query** | Server state management |
| **Recharts** | Data visualization |
| **Lucide React** | Beautiful icons |
| **Node.js** | Backend API server |
| **Vercel** | Frontend deployment |
| **Render** | Backend deployment |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/CodeWithUtkarsha/TradeJournal.git
cd TradeJournal

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── trade-modal.tsx     # Add/Edit trade modal
│   ├── trade-import.tsx    # XM broker CSV import
│   └── navigation.tsx      # App navigation
├── hooks/
│   └── use-toast.ts       # Toast notifications
├── lib/
│   ├── auth.ts            # Authentication service
│   ├── tradeService.ts    # Trade API service
│   └── utils.ts           # Utility functions
├── pages/
│   ├── dashboard.tsx      # Main trading dashboard
│   ├── analytics.tsx      # Analytics and insights
│   ├── login.tsx          # User authentication
│   └── profile.tsx        # User profile management
└── types/
    └── auth.ts            # TypeScript definitions
```

## 🔧 Environment Setup

Create `.env` file in the root directory:

```env
VITE_API_URL=https://render-backend-tradejournal.onrender.com
```

## 📊 XM Broker Import Guide

1. **Export from XM Platform:**
   - Navigate to Account History in your XM platform
   - Select your desired date range
   - Export as CSV format

2. **Import to TradeZella:**
   - Click "Import XM Trades" in dashboard
   - Upload your CSV file (drag & drop supported)
   - System automatically validates and imports trades

3. **Expected CSV Format:**
   ```
   Date, Symbol, Action, Volume, Price, S/L, T/P, Profit, Comment
   ```

## 🌐 Deployment

- **Frontend**: Automatically deployed to Vercel on push to `main` branch
- **Backend**: Deployed on Render with automatic API endpoints
- **Database**: Cloud-hosted with automatic backups

## 🔒 Security Features

- JWT token authentication
- Protected API routes
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

## 📈 Performance Features

- Lazy loading for optimal performance
- Efficient state management with TanStack Query
- Optimized bundle size with Vite
- Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ by [CodeWithUtkarsha](https://github.com/CodeWithUtkarsha)**
