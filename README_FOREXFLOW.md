# ForexFlow - Visual Forex Bot Builder

A professional, next-generation visual trading bot builder that empowers traders to design, test, and deploy automated Forex strategies without writing code.

## 🚀 Features

### ✅ Phase 3 Complete - Workflow-Ordered Node System

- **Workflow-Ordered Categories:** Nodes organized by execution order (1-5)
  - 1️⃣ Indicators (Blue) - Data analysis
  - 2️⃣ Conditions (Green) - Comparisons  
  - 3️⃣ Logic (Purple) - Boolean operations
  - 4️⃣ Risk Management (Yellow) - Position sizing
  - 5️⃣ Actions (Red) - Trade execution

- **Color-Coded Visual System:** Intuitive color progression guides strategy building
- **"Show 6 / Show More" Pattern:** Clean interface without overwhelming users
- **Fully Working Node Settings:** Complete parameter system with real-time updates
- **12+ Technical Indicators:** SMA, EMA, RSI, MACD, Bollinger Bands, and more
- **AI Strategy Builder:** Natural language to visual strategy conversion
- **MQL4/MQL5 Export:** Generate production-ready Expert Advisor code
- **Professional UI/UX:** Bloomberg Terminal-inspired dark theme

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **@xyflow/react** for node-based editor
- **shadcn/ui** v4 components
- **Tailwind CSS** v4 for styling
- **Framer Motion** for animations
- **Lightweight Charts** for price visualization
- **Spark SDK** for AI and persistence

## 🏗️ Project Structure

```
src/
├── components/
│   ├── builder/
│   │   ├── Canvas.tsx                  # Main strategy builder canvas
│   │   ├── NodePaletteWorkflow.tsx    # Workflow-ordered node library
│   │   ├── PropertiesPanel.tsx        # Enhanced parameter editor
│   │   ├── AIStrategyBuilder.tsx      # AI-powered strategy generator
│   │   ├── ExportDialog.tsx           # MQL4/MQL5 export
│   │   └── nodes/                      # Custom node components
│   ├── backtest/                       # Backtesting components
│   ├── chart/                          # Price chart components
│   ├── library/                        # Strategy library
│   └── ui/                             # shadcn components (40+)
├── constants/
│   └── node-categories.ts             # Node definitions with parameters
├── lib/
│   ├── engine/                         # Execution and backtest engines
│   ├── indicators/                     # Indicator calculations
│   ├── market-data/                    # Data fetching and caching
│   └── mql-export.ts                   # MQL code generator
└── types/                              # TypeScript type definitions
```

## 🎯 Getting Started

### Building a Strategy

1. **Open Node Palette:** Browse workflow-ordered categories (1-5)
2. **Add Indicators (Blue):** Drag RSI, EMA, or other indicators to canvas
3. **Configure Parameters:** Select node, adjust settings in properties panel
4. **Add Conditions (Green):** Compare indicator values, detect crosses
5. **Add Logic (Purple):** Combine conditions with AND/OR gates
6. **Add Risk Management (Yellow):** Set position size, stop loss, take profit
7. **Add Actions (Red):** Execute buy/sell trades based on logic
8. **Test Strategy:** Run backtest or paper trading simulation
9. **Export:** Generate MQL4/MQL5 code for MetaTrader

## 📚 Documentation

### Phase Documentation
- **[IMPLEMENTATION_PHASE_2.md](./IMPLEMENTATION_PHASE_2.md)** - AI Builder & Enhanced Nodes
- **[IMPLEMENTATION_PHASE_3.md](./IMPLEMENTATION_PHASE_3.md)** - Workflow System & Parameters
- **[PHASE_3_SUMMARY.md](./PHASE_3_SUMMARY.md)** - Current status and achievements
- **[AUTONOMOUS_DEVELOPMENT_PROTOCOL.md](./AUTONOMOUS_DEVELOPMENT_PROTOCOL.md)** - Development roadmap

### Architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview
- **[PRD.md](./PRD.md)** - Complete product requirements document

## 🎨 Design System

### Color Palette (oklch)
```css
/* Workflow Colors */
--indicator: oklch(0.70 0.15 210)    /* Blue */
--condition: oklch(0.65 0.18 145)    /* Green */
--logic: oklch(0.60 0.12 280)        /* Purple */
--risk: oklch(0.75 0.15 60)          /* Yellow */
--action: oklch(0.55 0.20 25)        /* Red */
```

## 🗺️ Roadmap

### ✅ Completed (Phase 1-3)
- [x] Visual node-based strategy builder
- [x] Workflow-ordered node organization
- [x] Color-coded category system
- [x] Enhanced parameter management
- [x] 12+ technical indicators with full parameters
- [x] AI strategy generation
- [x] MQL4/MQL5 export (basic)
- [x] Strategy save/load functionality

### 🔄 In Progress (Phase 4)
- [ ] Real-time indicator calculations
- [ ] Condition evaluation engine
- [ ] Visual execution feedback
- [ ] Enhanced MQL export with parameters

### 📋 Planned (Phase 5-10)
- [ ] Chart integration with indicator overlays
- [ ] Complete backtesting engine
- [ ] Historical data integration
- [ ] Performance metrics dashboard
- [ ] Strategy optimization
- [ ] Strategy templates library
- [ ] Paper trading mode
- [ ] Live broker integration

---

**Status:** Phase 3 Complete ✅ | **Next:** Phase 4 - Execution Engine 🎯

Built with ❤️ using Spark
