# ForexFlow - Visual Forex Bot Builder
## Product Requirements Document

---

A next-generation visual trading bot builder that empowers traders to design, test, and deploy automated Forex strategies without writing code—surpassing FXDreema in power, flexibility, and user experience. Features include AI-powered strategy generation, full MQL4/MQL5 export, and an intuitive workflow-based node organization system.

---

## Experience Qualities

1. **Empowering** - Users should feel capable and in control, transforming complex trading logic into intuitive visual flows that make algorithmic trading accessible to all skill levels.

2. **Trustworthy** - Every calculation, backtest result, and execution must inspire confidence through transparency, accuracy, and rigorous validation that professional traders demand.

3. **Fluid** - The interface should respond instantly to every interaction, creating a seamless flow state where designing strategies feels natural and creativity is never interrupted by technical friction.

---

## Complexity Level

**Complex Application** (advanced functionality, accounts) - This is a sophisticated financial application requiring real-time data processing, complex state management, computational analysis, multi-broker integration, and persistent storage of intricate strategy configurations with branching logic and numerous parameters.

---

## Essential Features

### 1. Visual Strategy Builder (Core Feature)

**Functionality:** Drag-and-drop node-based canvas where users construct trading strategies by connecting various node types (indicators, conditions, actions, logic gates) to form a complete algorithmic trading system. Enhanced with workflow-ordered categorized node library, organizing nodes by their logical execution order (1. Events → 2. Indicators → 3. Conditions → 4. Logic → 5. Risk Management → 6. Actions). Categories are collapsible with color-coded workflow badges, showing 5 nodes initially with "More" button expansion. Node names are displayed as bold colored text without boxes, making discovery intuitive and progressive.

**Purpose:** Democratizes algorithmic trading by making strategy creation visual and intuitive rather than requiring programming knowledge, while maintaining the power and flexibility of coded solutions. The workflow-based organization guides users through proper strategy construction.

**Trigger:** User opens the app or clicks "New Strategy" from the dashboard.

**Progression:** Empty canvas loads → User browses workflow-ordered node palette (color-coded by execution order) → User expands desired category → User sees initial 5 nodes with "More" button → User drags nodes from palette to canvas or clicks to add at center → User connects nodes by dragging from output ports to input ports → User configures each node's detailed parameters in properties panel → User validates strategy (checking for logic errors) → User exports to MQL4/MQL5 → User saves strategy with name and description → Strategy appears in library.

**Success Criteria:**
- Users can create a complete trading strategy in under 5 minutes
- Strategy logic can be visually traced from entry to exit
- All node connections follow valid data types and logic
- Strategies can be saved and reloaded without loss of configuration
- Canvas supports zoom, pan, and handles 50+ nodes without performance degradation
- Workflow-ordered categories with color coding guide proper strategy flow
- More button functionality prevents overwhelming users while maintaining full access
- Bold colored text display for node names without boxes for clean interface
- MQL4/MQL5 export generates working, production-ready Expert Advisor code

### 1a. AI Strategy Builder (New Feature)

**Functionality:** AI-powered strategy generation where users describe their trading strategy in natural language, and the system automatically creates a complete node-based strategy with proper indicators, conditions, logic gates, and actions. Users can then manually modify the AI-generated strategy using the visual node editor.

**Purpose:** Dramatically accelerates strategy creation for beginners and provides a starting point for experienced traders, bridging the gap between idea and implementation.

**Trigger:** User clicks "AI Builder" button in the canvas toolbar.

**Progression:** AI Builder dialog opens → User enters strategy description in natural language (e.g., "Create an RSI strategy that buys when oversold and sells when overbought") → User can select from example prompts → User clicks "Generate Strategy" → AI analyzes prompt and identifies required components → Progress indicator shows generation steps (analyzing prompt, identifying indicators, creating conditions, setting up actions, validating) → AI creates nodes with proper positioning and connections → Strategy loads on canvas → User can immediately modify nodes manually → User saves customized strategy.

**Success Criteria:**
- AI understands common trading strategy descriptions with 90%+ accuracy
- Generated strategies include proper indicators, conditions, and actions
- Node positioning follows logical left-to-right flow (indicators → conditions → actions)
- All generated nodes have valid default parameters
- Users can immediately edit AI-generated strategies manually
- Generation completes in under 10 seconds
- Clear error messages when AI cannot interpret the prompt

### 1b. MQL4/MQL5 Export (New Feature)

**Functionality:** One-click export of visual strategies to production-ready MetaTrader 4 (MQL4) or MetaTrader 5 (MQL5) Expert Advisor code. The system analyzes the node graph, generates appropriate indicator calculations, condition logic, risk management, and trade execution code with proper error handling and helper functions.

**Purpose:** Enables traders to deploy their visually-built strategies directly on MetaTrader platforms, the industry-standard forex trading software, without manual coding.

**Trigger:** User clicks "Export MQL" button in canvas toolbar.

**Progression:** User clicks Export button → Export dialog opens → User enters Expert Advisor name and magic number → User selects MQL4 or MQL5 tab → System generates complete code → User reviews code in syntax-highlighted viewer → User clicks Copy or Download → Code is copied to clipboard or downloaded as .mq4/.mq5 file → User can compile and run in MetaTrader.

**Success Criteria:**
- Generated code compiles without errors in MetaTrader
- All indicators from nodes are correctly implemented
- Condition logic properly evaluates to trigger actions
- Risk management parameters (stop loss, take profit, position sizing) are correctly applied
- Trade execution functions use proper MetaTrader API calls
- Code includes helpful comments and clear structure
- Both MQL4 and MQL5 versions generate correctly
- Helper functions for order management and validation are included
- Magic number system prevents interference with other EAs

### 2. Technical Indicator Library

**Functionality:** Comprehensive collection of 50+ technical analysis indicators that can be dragged onto the canvas as nodes, configured with custom parameters, and connected to other nodes to form trading conditions.

**Purpose:** Provides the building blocks for technical analysis-based strategies, ensuring users have access to industry-standard calculations with verified accuracy.

**Trigger:** User clicks indicator category in node palette or searches for specific indicator.

**Progression:** User browses/searches indicators → User clicks or drags indicator to canvas → Indicator node appears with default parameters → User opens properties panel → User adjusts parameters (period, source, multiplier, etc.) → User connects indicator output to condition nodes → Indicator calculates values based on chart data.

**Success Criteria:**
- Indicator calculations match MetaTrader 4/5 and TradingView results within 0.01% variance
- Each indicator has clear documentation and parameter descriptions
- Indicators update in real-time as market data changes
- Custom indicator creation supported through formula builder
- Indicator values can be visualized on charts

### 3. Backtesting Engine

**Functionality:** Historical simulation engine that replays past market data through the user's strategy, executing trades according to the defined logic and calculating comprehensive performance metrics.

**Purpose:** Validates strategy effectiveness before risking real capital, reveals potential weaknesses, and provides statistical confidence through rigorous testing.

**Trigger:** User clicks "Backtest" button after creating a strategy.

**Progression:** User selects backtest parameters (date range, currency pairs, timeframe, initial balance, spread/commission) → User clicks "Run Backtest" → Engine loads historical data → Engine replays tick-by-tick or bar-by-bar → Strategy logic evaluates conditions and executes trades → Engine calculates P&L, drawdown, and metrics → Results panel displays equity curve, trade list, and statistics → User analyzes results and iterates on strategy.

**Success Criteria:**
- Backtest completes 1 year of 1-minute data in under 10 seconds
- Trade execution logic accurately simulates real market conditions (slippage, spread)
- Results display 20+ performance metrics (Sharpe, Sortino, win rate, etc.)
- Equity curve visualization updates in real-time during backtest
- Users can export detailed trade logs and reports
- Backtest results can be compared side-by-side for strategy optimization

### 4. Real-Time Paper Trading

**Functionality:** Live market simulation mode that connects to real-time price feeds and executes the strategy with virtual money, providing risk-free validation of strategy performance in current market conditions.

**Purpose:** Bridges the gap between backtesting and live trading, allowing users to verify their strategy works in real-time without financial risk.

**Trigger:** User switches strategy mode to "Paper Trading" and clicks "Start".

**Progression:** User activates paper trading mode → System connects to real-time data feed → Strategy begins evaluating conditions as prices update → Virtual trades execute when conditions met → Portfolio panel shows open positions and P&L → User monitors performance and receives alerts → User can stop/pause/restart at any time → Session history saved for review.

**Success Criteria:**
- Latency under 100ms from price update to strategy evaluation
- Trade execution simulates real broker conditions (order types, slippage)
- Real-time P&L updates with every price tick
- Users receive instant notifications for trade events
- Paper trading history persists across sessions
- Users can run multiple strategies simultaneously in paper mode

### 5. Node-Based Logic System

**Functionality:** Comprehensive set of logic nodes (AND, OR, NOT, comparisons, math operations, state machines) that users connect to build complex trading conditions and decision trees.

**Purpose:** Enables sophisticated multi-condition strategies with branching logic, time-based rules, and custom calculations without coding.

**Trigger:** User needs to combine multiple conditions or perform calculations in their strategy.

**Progression:** User drags logic node to canvas → User connects multiple inputs (e.g., two conditions to AND gate) → Logic node evaluates inputs → Output flows to action nodes or additional logic → User can nest logic nodes for complex conditions → Strategy validator ensures logic is sound.

**Success Criteria:**
- Support for unlimited logic nesting depth
- Visual indication of true/false states during testing
- Logic evaluation follows standard boolean algebra rules
- Users can create reusable logic templates
- Logic errors are caught and explained before strategy execution

### 6. Risk Management System

**Functionality:** Built-in risk management nodes and calculators for position sizing, stop losses, take profits, maximum drawdown limits, and exposure controls.

**Purpose:** Protects users from catastrophic losses and enforces disciplined trading by making risk controls an integral part of strategy design.

**Trigger:** User adds risk management nodes to strategy or accesses risk calculator.

**Progression:** User adds risk management node → User configures risk parameters (% of account, R:R ratio, max positions, etc.) → Risk manager calculates position size based on stop loss and account balance → Orders execute with calculated size → System monitors exposure and prevents trades exceeding limits → User receives alerts when approaching risk thresholds.

**Success Criteria:**
- Position sizing calculations account for stop loss distance and account balance
- Maximum simultaneous position limits enforced
- Daily/weekly loss limits stop trading when reached
- Risk-reward ratios calculated and enforced automatically
- Portfolio heat map shows exposure by currency and pair
- Risk parameters can be backtested and optimized

### 7. Strategy Templates & Marketplace

**Functionality:** Pre-built strategy templates for common trading approaches (trend following, mean reversion, breakout, etc.) that users can clone, customize, and save. Community marketplace for sharing strategies.

**Purpose:** Accelerates learning curve by providing working examples and enables knowledge sharing within the trading community.

**Trigger:** User clicks "Templates" or "Browse Strategies" from main menu.

**Progression:** User browses strategy categories → User previews strategy logic and performance → User clicks "Clone Template" → Strategy loads in builder with all nodes and connections → User customizes parameters → User backtests modified version → User saves as personal strategy or shares to community.

**Success Criteria:**
- Library includes 10+ professionally designed templates
- Each template includes description, logic explanation, and expected performance
- Templates can be filtered by trading style, timeframe, and risk level
- Users can export/import strategies as JSON files
- Shared strategies include ratings and community feedback

### 8. Advanced Charting

**Functionality:** Professional-grade candlestick charts with indicator overlays, drawing tools, and integration with strategy builder to visualize trade entry/exit points.

**Purpose:** Provides visual context for strategy development and backtesting, helping users understand price action and indicator behavior.

**Trigger:** User clicks "Chart" tab or opens chart alongside strategy builder.

**Progression:** Chart loads with default currency pair and timeframe → User selects pair and timeframe from dropdowns → Price data loads and displays as candlesticks → User adds indicators from strategy to chart overlay → Strategy trade markers appear on chart → User can zoom, pan, and draw analysis tools → Chart syncs with backtest results to show historical trades.

**Success Criteria:**
- Chart renders 10,000+ candles smoothly without lag
- Supports 9 standard timeframes (M1, M5, M15, M30, H1, H4, D1, W1, MN)
- Indicator overlays update in real-time
- Drawing tools include trend lines, Fibonacci, rectangles, horizontal lines
- Trade markers clearly indicate entry/exit with P&L
- Chart can be exported as image

### 9. Performance Analytics

**Functionality:** Comprehensive statistical analysis of strategy performance including equity curves, drawdown charts, trade distribution, monthly/yearly breakdowns, and 25+ performance metrics.

**Purpose:** Provides deep insights into strategy behavior, helps identify strengths and weaknesses, and enables data-driven optimization.

**Trigger:** Backtest completes or user opens analytics panel for paper/live trading.

**Progression:** Strategy executes trades → Analytics engine collects trade data → Metrics calculated in real-time → Dashboard displays key metrics in cards → User explores detailed breakdowns (by month, by pair, by day of week) → User examines equity curve and drawdown chart → User identifies problem periods → User exports report as PDF.

**Success Criteria:**
- Displays 25+ metrics (Sharpe, Sortino, win rate, profit factor, max DD, etc.)
- Equity curve shows balance, equity, and drawdown over time
- Trade distribution histogram shows win/loss patterns
- Monthly/yearly performance tables highlight best/worst periods
- Advanced metrics include recovery factor, Calmar ratio, expectancy
- All metrics have tooltips explaining calculation and significance

### 10. Strategy Optimization

**Functionality:** Automated parameter optimization using grid search, genetic algorithms, or walk-forward analysis to find optimal indicator and logic parameters.

**Purpose:** Takes strategy from good to great by systematically testing parameter combinations to maximize performance metrics.

**Trigger:** User clicks "Optimize" after creating strategy.

**Progression:** User selects parameters to optimize (indicator periods, thresholds, etc.) → User sets ranges and step sizes → User chooses optimization method and target metric → Optimization engine runs hundreds/thousands of backtests → Progress bar shows completion → Results display as parameter heat map → User selects optimal parameters → Strategy updates with optimized values.

**Success Criteria:**
- Supports optimization of multiple parameters simultaneously
- Grid search tests all combinations within defined ranges
- Genetic algorithm finds near-optimal solutions faster than brute force
- Walk-forward analysis prevents overfitting
- Results visualized as heat maps and 3D surface plots
- Optimization can target any performance metric (Sharpe, profit, win rate)
- Overfitting warnings when optimization shows unrealistic results

---

## Edge Case Handling

- **Invalid Node Connections:** System prevents incompatible node connections (wrong data types) with visual feedback and helpful error messages.

- **Missing Historical Data:** Backtest gracefully handles data gaps with warnings and estimated impact on results.

- **Simultaneous Opposing Signals:** Strategy validator warns when logic could produce conflicting buy/sell signals; user must add priority rules.

- **Broker API Failures:** Live/paper trading mode automatically retries failed requests and alerts user to connection issues without stopping strategy.

- **Extreme Market Conditions:** Risk management enforces hard stops even if strategy logic malfunctions; circuit breakers prevent runaway losses.

- **Strategy Import Errors:** JSON import validates schema and provides specific error messages when file is corrupted or incompatible.

- **Performance Degradation:** Large strategies (100+ nodes) trigger performance warnings with suggestions to optimize (use sub-strategies, reduce complexity).

- **Timezone Mismatches:** System detects and converts all times to user's timezone with clear indication of broker server time.

- **Overfitting Detection:** Backtest results include overfitting indicators; optimization shows warning when parameters are too specifically tuned to historical data.

- **Zero-Balance Scenarios:** Paper trading continues tracking performance even if virtual account goes to zero, allowing full analysis of failure.

---

## Design Direction

ForexFlow should evoke a sense of professional competence and technological sophistication—the interface of a Bloomberg Terminal reimagined for the modern trader, balancing the serious, data-driven aesthetic of institutional trading platforms with the approachable elegance of contemporary design systems. The design should feel precise and utilitarian like an engineer's cockpit, where every element serves a clear purpose. The interface leans toward rich rather than minimal, as traders need dense information displays, multiple simultaneous data streams, and comprehensive controls without sacrificing clarity through thoughtful hierarchy and spatial organization.

---

## Color Selection

**Triadic** (three equally spaced colors) - Using a triadic scheme of deep blue (trust, stability), vibrant green (profit, buy), and bold red (loss, sell) to create visual harmony while maintaining the critical buy/sell color semantics traders universally recognize. The core blue grounds the interface with professionalism, while green and red provide instant semantic recognition for positive/negative states, profit/loss, and buy/sell actions.

### Color Palette

- **Primary Color (Deep Blue):** `oklch(0.35 0.12 250)` - Main brand color representing trust, stability, and financial professionalism. Used for primary actions, focused states, and key UI elements that guide user attention.

- **Secondary Color (Slate Gray):** `oklch(0.25 0.02 250)` - Supporting color for secondary actions, card backgrounds, and less prominent UI elements that maintain visual hierarchy without competing for attention.

- **Accent Color (Electric Cyan):** `oklch(0.70 0.15 210)` - Attention-grabbing highlight for interactive elements, hover states, and important status indicators that require immediate user attention.

- **Bullish/Buy (Profit Green):** `oklch(0.65 0.18 145)` - Universal indicator for buy signals, profitable trades, and positive performance metrics.

- **Bearish/Sell (Warning Red):** `oklch(0.55 0.20 25)` - Universal indicator for sell signals, losses, and negative performance metrics.

- **Background (Dark Charcoal):** `oklch(0.15 0.01 250)` - Primary background providing maximum contrast for data visualization and reducing eye strain during extended trading sessions.

- **Card/Surface (Elevated Slate):** `oklch(0.20 0.02 250)` - Elevated surfaces for cards, panels, and containers that create subtle depth hierarchy.

- **Muted (Subdued Gray):** `oklch(0.30 0.01 250)` - De-emphasized backgrounds for inactive states and supporting information.

### Foreground/Background Pairings

- **Background `oklch(0.15 0.01 250)` / Foreground `oklch(0.95 0 0)`:** White text on dark background - Ratio 13.8:1 ✓ (Primary content pairing)

- **Card `oklch(0.20 0.02 250)` / Card-Foreground `oklch(0.95 0 0)`:** White text on card surface - Ratio 12.5:1 ✓ (Card content)

- **Primary `oklch(0.35 0.12 250)` / Primary-Foreground `oklch(0.98 0 0)`:** White text on deep blue - Ratio 8.2:1 ✓ (Primary buttons and actions)

- **Secondary `oklch(0.25 0.02 250)` / Secondary-Foreground `oklch(0.95 0 0)`:** White text on slate - Ratio 11.5:1 ✓ (Secondary actions)

- **Accent `oklch(0.70 0.15 210)` / Accent-Foreground `oklch(0.10 0.01 250)`:** Dark text on cyan - Ratio 8.9:1 ✓ (Accent elements)

- **Bullish `oklch(0.65 0.18 145)` / Text `oklch(0.08 0 0)`:** Nearly black on green - Ratio 9.8:1 ✓ (Buy buttons and profit indicators)

- **Bearish `oklch(0.55 0.20 25)` / Text `oklch(0.98 0 0)`:** White on red - Ratio 5.2:1 ✓ (Sell buttons and loss indicators)

- **Muted `oklch(0.30 0.01 250)` / Muted-Foreground `oklch(0.65 0 0)`:** Light gray on muted background - Ratio 4.7:1 ✓ (Subtle supporting text)

---

## Font Selection

Typography should convey precision, clarity, and technological sophistication—the numerical data demands a monospaced font for perfect alignment in tables and charts, while interface labels benefit from a clean geometric sans-serif that feels modern and professional. **Inter** for all interface text (headings, labels, body) provides excellent legibility and a contemporary, neutral personality. **JetBrains Mono** for all numerical data, code snippets, and tabular content ensures perfect alignment and instant recognition of data patterns through consistent character width.

### Typographic Hierarchy

- **H1 (App Title / Page Headers):** Inter Bold / 32px / -0.02em letter spacing / 1.2 line height
- **H2 (Section Headers):** Inter Semibold / 24px / -0.01em letter spacing / 1.3 line height
- **H3 (Subsection Headers):** Inter Semibold / 18px / normal letter spacing / 1.4 line height
- **Body (Primary Text):** Inter Regular / 14px / normal letter spacing / 1.5 line height
- **Body Small (Supporting Text):** Inter Regular / 12px / normal letter spacing / 1.5 line height
- **Label (Form Labels):** Inter Medium / 12px / 0.01em letter spacing / 1.4 line height
- **Button Text:** Inter Semibold / 14px / 0.01em letter spacing / 1.0 line height
- **Numerical Data (Prices, Metrics):** JetBrains Mono Regular / 14px / normal letter spacing / 1.4 line height
- **Numerical Data Large (Key Metrics):** JetBrains Mono Semibold / 20px / normal letter spacing / 1.2 line height
- **Code/Technical:** JetBrains Mono Regular / 13px / normal letter spacing / 1.6 line height

---

## Animations

Animations should serve as functional choreography that guides attention and communicates state changes, maintaining the professional seriousness of a trading platform while adding subtle moments of tactile satisfaction that reward user interactions. Motion is restrained and purposeful—quick, precise transitions that feel mechanical and deliberate, like the movement of precision instruments. Every animation reinforces causality (this action caused this result) and maintains spatial consistency (elements move from where they came and return logically).

### Purposeful Meaning

Motion communicates system responsiveness, data flow direction, and state transitions—when nodes connect, a pulse travels along the edge to show data direction; when backtests complete, results cascade in revealing performance from top to bottom; when trades execute, entries/exits animate onto charts showing temporal sequence. Animations embody precision and confidence, never playful or bouncy, but smooth and mechanical like a well-oiled machine.

### Hierarchy of Movement

**Primary Focus (300-500ms):** Major state changes like page transitions, modal appearances, and backtest result revelations deserve fuller animations that command attention. 

**Secondary Actions (200-300ms):** Node additions to canvas, panel expansions, chart timeframe switches receive moderate animation that confirms the action without delay.

**Micro-Interactions (100-150ms):** Button presses, hover states, tooltip appearances, and dropdown opens use minimal motion—just enough feedback to feel responsive and tactile.

**Data Updates (50-100ms):** Real-time price updates, indicator recalculations, and metric refreshes happen near-instantly with subtle fades to avoid jarring changes.

**Continuous Motion:** Equity curves drawing during backtest, trade markers appearing chronologically on charts, and loading spinners use smooth, consistent motion that communicates ongoing processes.

---

## Component Selection

### Components

**Strategy Builder Canvas:**
- **Shadcn Components:** None directly (custom canvas implementation needed)
- **Customizations:** Custom React Flow integration with styled nodes, edges, minimap, and controls
- **Purpose:** Core visual programming interface
- **Tailwind Modifications:** Dark background `bg-background`, grid pattern overlay, custom node styling with `bg-card` and `border-border`

**Node Palette (Sidebar):**
- **Shadcn Components:** `Sheet` or `Sidebar` for collapsible panel
- **Customizations:** Custom node preview cards with drag handles
- **Purpose:** Library of draggable strategy components
- **Tailwind Modifications:** `bg-card`, accordion sections for categories, search input with `Input` component

**Properties Panel:**
- **Shadcn Components:** `ScrollArea`, `Label`, `Input`, `Select`, `Slider`, `Switch`, `Tabs`
- **Customizations:** Dynamic form builder based on selected node type
- **Purpose:** Configure node parameters
- **Tailwind Modifications:** Sticky header, form layout with `space-y-4`, section dividers with `Separator`

**Top Toolbar:**
- **Shadcn Components:** `Button`, `DropdownMenu`, `Tooltip`, `Separator`
- **Customizations:** Grouped button sets with icons
- **Purpose:** Primary actions (save, load, backtest, deploy, settings)
- **Tailwind Modifications:** Fixed position, glass morphism background `bg-card/80 backdrop-blur`, dividers between groups

**Backtesting Results Panel:**
- **Shadcn Components:** `Card`, `Tabs`, `Table`, `Progress`, `Badge`, `ScrollArea`
- **Customizations:** Custom chart components (equity curve, drawdown chart)
- **Purpose:** Display comprehensive backtest analytics
- **Tailwind Modifications:** Multi-column grid layout, metric cards with `bg-card`, colored badges for profit/loss

**Chart Viewer:**
- **Shadcn Components:** `Card`, `Select`, `Tabs`, `Tooltip`
- **Customizations:** Lightweight Charts library integration
- **Purpose:** Candlestick chart with indicators and trade markers
- **Tailwind Modifications:** Full-height container, toolbar overlay, dark theme matching overall design

**Strategy Library:**
- **Shadcn Components:** `Card`, `Input` (search), `Badge`, `Button`, `Dialog`
- **Customizations:** Grid of strategy preview cards with thumbnails
- **Purpose:** Browse, search, and load saved strategies
- **Tailwind Modifications:** Responsive grid `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`, hover effects, strategy cards with `bg-card`

**Optimization Panel:**
- **Shadcn Components:** `Dialog`, `Slider`, `Input`, `Select`, `Progress`, `Table`
- **Customizations:** Parameter range selectors, heat map visualization
- **Purpose:** Configure and run strategy optimization
- **Tailwind Modifications:** Large modal `max-w-6xl`, side-by-side parameter/results layout

**Risk Calculator:**
- **Shadcn Components:** `Card`, `Input`, `Label`, `Badge`
- **Customizations:** Live calculation display with formatted numbers
- **Purpose:** Calculate position sizing and risk metrics
- **Tailwind Modifications:** Compact card layout, monospace numerical outputs with `font-mono`

**Notification System:**
- **Shadcn Components:** `Sonner` (toast notifications)
- **Customizations:** Custom toast variants for trade events (buy/sell)
- **Purpose:** Real-time alerts for trades, errors, and system events
- **Tailwind Modifications:** Positioned `top-right`, themed toasts with green/red for trades

**Main Navigation:**
- **Shadcn Components:** `Tabs` or custom nav
- **Customizations:** Top-level navigation between Builder, Backtest, Live, Library, Settings
- **Purpose:** Primary app navigation
- **Tailwind Modifications:** Fixed top bar, active state indicators with `border-b-2 border-primary`

### Customizations

**React Flow Canvas Nodes:**
Custom node components for each type (indicator, condition, action, logic) with input/output ports (handles), parameter badges, and status indicators. Nodes use card-style elevation with `shadow-lg`, colored left borders indicating category, and icon + label layout.

**Live Number Displays:**
Animated numerical counters that smoothly transition when values change, using monospace font and color coding (green for positive, red for negative). Used extensively in analytics and P&L displays.

**Trade Marker Component:**
Custom overlay for charts showing entry/exit points with directional icons, P&L badge, and connecting line. Tooltip on hover shows full trade details.

**Equity Curve Component:**
Custom D3.js or Recharts line chart with dual-axis (balance and drawdown), shaded drawdown area, and trade markers synced to time axis.

**Parameter Heat Map:**
Custom visualization for optimization results using color gradient cells in a grid, with axes for parameter values and color intensity for performance metric.

**Formula Editor:**
Custom input with syntax highlighting for custom indicator formulas, auto-complete for functions and variables.

### States

**Buttons:**
- Default: `bg-primary text-primary-foreground`
- Hover: `hover:bg-primary/90`
- Active: `active:scale-95`
- Disabled: `disabled:opacity-50 disabled:pointer-events-none`
- Loading: Spinner inside button, `disabled` state
- Buy Action: `bg-bullish text-black hover:bg-bullish/90`
- Sell Action: `bg-bearish text-white hover:bg-bearish/90`

**Inputs:**
- Default: `border-input bg-background`
- Focus: `focus:ring-2 focus:ring-ring focus:border-primary`
- Error: `border-destructive focus:ring-destructive`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- Readonly: `bg-muted cursor-default`

**Nodes (Canvas):**
- Default: `bg-card border-2 border-border`
- Selected: `border-primary shadow-lg shadow-primary/20`
- Error: `border-destructive`
- Active (executing): `border-accent animate-pulse`
- Disabled: `opacity-50`

**Dropdowns/Select:**
- Default: Closed state with chevron down
- Open: Expanded with `Popover`, scrollable list
- Item Hover: `bg-accent text-accent-foreground`
- Item Selected: `bg-primary text-primary-foreground`
- Disabled Items: `opacity-50 pointer-events-none`

### Icon Selection

**@phosphor-icons/react** (Primary icon set):

**Strategy Builder:**
- `GitBranch` - Strategy flow/logic
- `FlowArrow` - Node connections
- `Function` - Indicator nodes
- `Lightning` - Action nodes
- `CirclesThreePlus` - Add node
- `ArrowsOutCardinal` - Canvas fit to screen
- `MagnifyingGlassMinus/Plus` - Zoom controls

**Trading Actions:**
- `TrendUp` - Buy/Long position
- `TrendDown` - Sell/Short position
- `X` - Close position
- `ShieldCheck` - Risk management
- `Target` - Take profit
- `WarningOctagon` - Stop loss

**Indicators:**
- `ChartLine` - Moving averages
- `ChartLineUp` - Trend indicators
- `Waveform` - Oscillators
- `Activity` - Volatility indicators
- `ChartBar` - Volume indicators

**Interface:**
- `Play` - Start backtest/paper trading
- `Pause` - Pause execution
- `Stop` - Stop execution
- `ArrowClockwise` - Refresh/reload
- `FloppyDisk` - Save strategy
- `FolderOpen` - Load strategy
- `Export` - Export results
- `Gear` - Settings
- `Question` - Help/documentation
- `BellRinging` - Notifications
- `CaretDown/Up/Left/Right` - Dropdown indicators

**Analytics:**
- `ChartLineUp` - Equity curve
- `ChartLineDown` - Drawdown
- `Percent` - Win rate
- `CurrencyDollar` - Profit/loss
- `TrendUp` - Sharpe ratio
- `ListNumbers` - Trade list

All icons use default `size` and `weight` unless specifically needed larger for primary actions or lighter for subtle UI elements.

### Spacing

**Component Spacing (using Tailwind's scale):**
- **Section Padding:** `p-6` (24px) for major sections, `p-4` (16px) for cards
- **Element Gaps:** `gap-4` (16px) for related elements, `gap-6` (24px) for section divisions
- **Form Spacing:** `space-y-4` (16px) between form fields
- **Button Padding:** `px-4 py-2` for standard buttons, `px-6 py-3` for primary CTAs
- **Card Spacing:** `p-4` internal padding, `gap-4` between cards in grids
- **Margins:** `mb-6` for section headers, `mb-4` for subsection headers
- **Node Spacing:** Minimum 32px between nodes on canvas for connection clarity

**Layout Spacing:**
- **Page Margins:** `px-6` horizontal page padding
- **Panel Gaps:** `gap-4` between adjacent panels
- **Grid Gaps:** `gap-4` for card grids
- **List Item Spacing:** `space-y-2` for dense lists, `space-y-4` for generous lists

### Mobile Responsiveness

**Responsive Breakpoints:**
- **Mobile (<768px):** Single column layout, collapsible panels, full-screen strategy builder, stacked charts, simplified toolbar with dropdown menu
- **Tablet (768px-1024px):** Two-column layout where appropriate, collapsible sidebars, responsive node palette as bottom sheet
- **Desktop (>1024px):** Full multi-panel layout with side-by-side canvas/properties, persistent toolbars, simultaneous chart/builder view

**Mobile Adaptations:**
- **Strategy Builder:** Full-screen canvas with floating action button (FAB) to open node palette as bottom drawer
- **Node Palette:** Slides up from bottom as sheet, categorized with tabs, search prominently placed
- **Properties Panel:** Full-screen overlay when editing node, back button to return to canvas
- **Charts:** Full-width with touch pinch-to-zoom, simplified toolbar
- **Tables:** Horizontally scrollable with sticky first column
- **Backtest Results:** Vertical stack of metric cards, collapsible sections for detailed breakdown
- **Navigation:** Hamburger menu with drawer navigation
- **Touch Targets:** Minimum 44x44px for all interactive elements

**Progressive Enhancement:**
- Start with mobile-first single-column layout
- Add side panels at tablet breakpoint
- Full multi-panel interface at desktop breakpoint
- Hide non-essential UI on smaller screens (minimap, advanced tools)
- Gestures on mobile: swipe to switch tabs, pinch to zoom canvas, long-press for context menu

---

## Technical Specifications

### Data Model

**Strategy Schema:**
```typescript
interface Strategy {
  id: string
  name: string
  description: string
  version: string
  createdAt: Date
  updatedAt: Date
  nodes: Node[]
  edges: Edge[]
  settings: StrategySettings
  metadata: {
    author: string
    tags: string[]
    category: string
    timeframe: string
    pairs: string[]
  }
}
```

**Node Schema:**
```typescript
interface Node {
  id: string
  type: NodeType
  position: { x: number, y: number }
  data: {
    label: string
    parameters: Record<string, any>
    inputs: Port[]
    outputs: Port[]
  }
}
```

**Backtest Results Schema:**
```typescript
interface BacktestResult {
  strategyId: string
  startDate: Date
  endDate: Date
  initialBalance: number
  finalBalance: number
  totalReturn: number
  trades: Trade[]
  metrics: PerformanceMetrics
  equityCurve: { time: Date, balance: number, equity: number }[]
}
```

### Browser Storage (useKV)

- **strategies:** Array of saved strategy objects
- **templates:** Array of strategy template objects
- **settings:** User preferences and configuration
- **backtest-results:** Array of recent backtest results
- **paper-trading-sessions:** Array of paper trading session data

### External Dependencies to Install

- **react-flow-renderer** or **@xyflow/react**: Visual node-based editor
- **lightweight-charts**: High-performance charting library
- **recharts**: Alternative for simple charts (equity curve, bar charts)
- **date-fns**: Already installed (date manipulation)
- **big.js** or **decimal.js**: Precise financial calculations

---

## Success Metrics

### User Success
- User creates first strategy in under 10 minutes (onboarding effectiveness)
- 80%+ of strategies pass validation without errors (intuitive design)
- Users run at least 3 backtests per strategy (engagement with testing)
- Average session duration > 30 minutes (engaging experience)

### Technical Success
- Strategy builder canvas renders 50+ nodes at 60fps (performance)
- Backtest engine processes 1 year of 1-minute data in <10 seconds (computation efficiency)
- Application loads in <3 seconds on 3G connection (load performance)
- All indicator calculations match MT4 within 0.01% (calculation accuracy)

### Feature Completeness
- 50+ technical indicators implemented
- 10+ strategy templates available
- 25+ performance metrics calculated
- Paper trading mode functional with real-time data
- Export/import strategies working reliably

---

## Future Enhancements (Post-MVP)

- Live broker integration (OANDA, Interactive Brokers)
- Multi-strategy portfolio mode
- Machine learning optimization
- Social features (follow traders, copy strategies)
- Mobile native app
- Cloud strategy sync
- Economic calendar integration
- News sentiment analysis
- Custom indicator scripting language
- Strategy marketplace with monetization
- Collaborative strategy building
- Video tutorials and academy
- Advanced pattern recognition
- Market scanner for opportunities
- Webhook integrations

---

## Research References

### FXDreema Feature Analysis
- Visual strategy builder ✓ (matching)
- 100+ technical indicators ✓ (50+ in MVP, expandable)
- Backtesting ✓ (matching with more metrics)
- MetaTrader export ⏭ (future enhancement)
- Strategy templates ✓ (matching)
- Paper trading ✓ (exceeding with real-time)

### Broker APIs
- **OANDA v20 REST API:** Well-documented REST API, streaming prices, demo accounts available
- **MetaTrader 4/5:** MQL language for custom indicators, extensive community, requires bridge
- **Interactive Brokers TWS API:** Comprehensive but complex, requires desktop application
- **Alpha Vantage:** Free tier for historical data (500 requests/day), good for development

### Technical Indicator References
- **TA-Lib:** Industry standard indicator library (reference for calculations)
- **TradingView Pine Script Docs:** Well-documented indicator logic
- **MetaTrader MQL4/5 Docs:** Technical reference for indicator implementations

---

*This PRD defines the complete vision for ForexFlow v1.0 and guides all development decisions toward creating a professional-grade visual trading bot builder that empowers traders at all skill levels.*
