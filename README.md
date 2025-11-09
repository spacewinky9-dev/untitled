# ForexFlow - Visual Forex Bot Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)]()

> A next-generation visual trading bot builder that empowers traders to design, test, and deploy automated Forex strategies without writing code—surpassing FXDreema in power, flexibility, and user experience.

---

## 🌟 Overview

**ForexFlow** is a sophisticated visual strategy builder that transforms complex trading logic into intuitive node-based flows, making algorithmic trading accessible to all skill levels while maintaining the power and flexibility professional traders demand.

### Key Features

- 🎨 **Visual Strategy Builder** - Drag-and-drop node-based canvas with 22+ node types
- 🤖 **AI Strategy Generation** - Natural language to trading strategy conversion
- 📊 **14 Technical Indicators** - SMA, EMA, RSI, MACD, Bollinger Bands, and more
- 🧪 **Backtesting Engine** - Test strategies with historical data
- 📈 **Advanced Charting** - Professional-grade visualization with Lightweight Charts
- 💱 **MQL4/MQL5 Export** - Deploy directly to MetaTrader platforms
- 🎯 **Risk Management** - Position sizing, stop loss, take profit, trailing stops
- 💾 **Strategy Library** - Save, load, and organize your strategies

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/spacewinky9-dev/untitled.git
cd untitled

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

---

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory, organized for easy navigation:

### 📚 [Complete Documentation Index](docs/index.md)

#### Quick Links

- **[Product Requirements Document](docs/01-overview/PRD.md)** - Complete product vision and specifications
- **[User Guide](docs/04-guides/USER_GUIDE.md)** - How to use ForexFlow
- **[Architecture Documentation](docs/02-architecture/ARCHITECTURE.md)** - Technical architecture
- **[Current Status & Roadmap](docs/03-implementation/CURRENT_STATUS_AND_ROADMAP.md)** - Development progress
- **[Strategy Examples](docs/04-guides/COMPLETE_STRATEGY_EXAMPLES.md)** - Real-world strategy examples
- **[Development Protocol](docs/05-development/AUTONOMOUS_DEVELOPMENT_PROTOCOL.md)** - For contributors

### Documentation Structure

```
docs/
├── index.md                          # Documentation index and reading guide
├── 01-overview/                      # Product overview and introduction
├── 02-architecture/                  # Technical architecture and design
├── 03-implementation/                # Development progress and status
├── 04-guides/                        # User guides and examples
├── 05-development/                   # Developer documentation
└── 06-reference/                     # Quick reference materials
```

---

## 🎯 Current Status

**Development Progress: Phase 5 Complete (67% Total)**

### ✅ Completed Features

- Visual Strategy Builder with 22+ nodes
- Technical Indicator System (14 indicators)
- Backtesting Engine
- Strategy Library with persistence
- Properties Panel with dynamic forms
- Risk Management System
- Advanced Charting & Visualization
- Keyboard shortcuts (Delete, Ctrl+S)
- Real-time validation

### 🚧 In Progress

- Multi-timeframe Analysis
- Portfolio Management
- Live Trading Integration
- Cloud Strategy Sharing
- Mobile Application

### 📅 Upcoming

- Advanced Machine Learning Integration
- Social Trading Features
- Broker API Integration
- Real-time Market Data Feeds
- Performance Analytics Dashboard

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and [STATUS.md](STATUS.md) for current development status.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI Components**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS 4
- **Node Canvas**: React Flow
- **Charting**: Lightweight Charts
- **State Management**: React Query, KV Storage
- **Data Visualization**: Recharts, D3.js

---

## 📊 Project Structure

```
untitled/
├── src/
│   ├── components/          # React components
│   │   ├── backtest/       # Backtesting components
│   │   ├── builder/        # Visual builder components
│   │   ├── common/         # Shared components
│   │   ├── library/        # Strategy library
│   │   └── ui/             # UI components
│   ├── lib/                # Core libraries
│   │   ├── indicators/     # Technical indicators
│   │   ├── strategy/       # Strategy engine
│   │   └── utils/          # Utilities
│   ├── types/              # TypeScript definitions
│   └── hooks/              # Custom React hooks
├── docs/                   # Documentation
├── public/                 # Static assets
└── dist/                   # Production build
```

---

## 🧪 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run optimize   # Optimize dependencies
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** (via ESLint) for code formatting

---

## 🤝 Contributing

We welcome contributions! Please see our [Development Protocol](docs/05-development/AUTONOMOUS_DEVELOPMENT_PROTOCOL.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📈 Tracking & Progress

See our [Development Tracking Table](TRACKING.md) for detailed progress on all features and tasks.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

## 🔗 Related Resources

- [MetaTrader 4 Documentation](https://docs.mql4.com/)
- [MetaTrader 5 Documentation](https://www.mql5.com/en/docs)
- [React Flow Documentation](https://reactflow.dev/)
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)

---

## 💬 Support & Community

- **Issues**: [GitHub Issues](https://github.com/spacewinky9-dev/untitled/issues)
- **Discussions**: [GitHub Discussions](https://github.com/spacewinky9-dev/untitled/discussions)

---

## 🎓 Learning Resources

New to algorithmic trading? Check out our guides:
- [User Guide](docs/04-guides/USER_GUIDE.md) - Complete user guide
- [Strategy Examples](docs/04-guides/COMPLETE_STRATEGY_EXAMPLES.md) - Learn from examples
- [Custom Indicators](docs/04-guides/CUSTOM_INDICATOR_IMPLEMENTATION.md) - Build custom indicators

---

## 🌟 Acknowledgments

Built with modern web technologies and inspired by the best visual programming tools in the industry.

---

<div align="center">

**[Documentation](docs/index.md)** • **[User Guide](docs/04-guides/USER_GUIDE.md)** • **[Examples](docs/04-guides/COMPLETE_STRATEGY_EXAMPLES.md)** • **[Contributing](docs/05-development/AUTONOMOUS_DEVELOPMENT_PROTOCOL.md)**

Made with ❤️ by the ForexFlow team

</div>
