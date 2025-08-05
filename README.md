# Geospatial Analytics Dashboard

A sophisticated web application for interactive geospatial data analysis with temporal controls, polygon drawing tools, and real-time weather data visualization.

![Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop)

## 🌟 Features

### Timeline Control System
- **Dual-mode timeline slider** with 30-day window (15 days before/after today)
- **Single-point mode**: Select specific hour for data analysis
- **Range mode**: Define time windows for aggregated data
- **Playback functionality** with smooth animations
- **Hourly resolution** with intuitive date/time formatting

### Interactive Mapping
- **Leaflet-based map** with smooth pan and zoom controls
- **Polygon drawing tools** supporting 3-12 vertices
- **Real-time polygon creation** with visual feedback
- **Persistent polygon storage** with automatic map synchronization
- **Polygon management** (view, delete, rename)

### Data Source Management
- **Open-Meteo API integration** for real-time weather data
- **Customizable color coding rules** with threshold-based operators
- **Visual legend system** with automatic updates
- **Multiple data source support** (extensible architecture)
- **API caching** for optimized performance

### Advanced UI/UX
- **Responsive design** optimized for desktop and mobile
- **Professional color system** with consistent theming
- **Smooth animations** and micro-interactions
- **State persistence** across page reloads
- **Real-time updates** when timeline changes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geospatial-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📚 Tech Stack

### Core Framework
- **[Next.js 13](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library with modern hooks
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### State Management
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[Zustand Persist](https://github.com/pmndrs/zustand)** - State persistence middleware

### Mapping & Geospatial
- **[React Leaflet](https://react-leaflet.js.org/)** - React components for Leaflet maps
- **[Leaflet](https://leafletjs.com/)** - Interactive map library
- **[@types/leaflet](https://www.npmjs.com/package/@types/leaflet)** - TypeScript definitions

### UI Components & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Class Variance Authority](https://cva.style/)** - Component variant management

### Data Visualization & Controls
- **[React Range](https://github.com/tajo/react-range)** - Flexible range slider component
- **[Date-fns](https://date-fns.org/)** - Modern date utility library
- **[Recharts](https://recharts.org/)** - Composable charting library

### Form Management
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[PostCSS](https://postcss.org/)** - CSS processing tool
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── map/              # Map-related components
│   ├── sidebar/          # Sidebar components
│   ├── timeline/         # Timeline slider components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility libraries
│   ├── api.ts           # API service layer
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
├── store/               # State management
│   └── dashboard-store.ts # Zustand store
└── hooks/               # Custom React hooks
    └── use-toast.ts     # Toast notification hook
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Add any API keys or configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing system
- Animation utilities
- Component-specific styles

### TypeScript Configuration

Strict TypeScript configuration with:
- Path mapping for clean imports
- Next.js optimizations
- Comprehensive type checking

## 🌐 API Integration

### Open-Meteo Weather API

The application integrates with the Open-Meteo Archive API:

```typescript
// Example API call
const response = await fetch(
  `https://archive-api.open-meteo.com/v1/archive?` +
  `latitude=${lat}&longitude=${lng}&` +
  `start_date=${startDate}&end_date=${endDate}&` +
  `hourly=temperature_2m`
);
```

**Features:**
- Automatic caching for performance
- Error handling with fallback data
- Polygon centroid calculation
- Time-based data filtering

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and highlights
- **Secondary**: Teal (#14B8A6) - Range selections and accents
- **Success**: Green (#10B981) - Positive states
- **Warning**: Orange (#F97316) - Attention states
- **Error**: Red (#EF4444) - Error states

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading and body text scales
- **Line Height**: Optimized for readability (120% headings, 150% body)

### Spacing System
- **Base unit**: 8px grid system
- **Consistent margins**: 16px, 24px, 32px
- **Component padding**: 12px, 16px, 24px


## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project maintains high code quality through:
- **TypeScript** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **Component composition** patterns
- **Custom hooks** for logic reuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

