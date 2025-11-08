# FxDreema-Style Block System Implementation

## Overview
ForexFlow now implements the complete fxDreema-style visual block programming system with enhanced connection handling, multiple output types, and intuitive block management.

## Key Features Implemented

### 1. **Visual Block Connection System**

#### Input Handles (Top)
- **White semicircle** at the top of each block
- Positioned at `Position.Top` with centered alignment
- 16px diameter (4x larger than output handles)
- White background with gray border for visibility

#### Output Handles (Bottom)
- **Color-coded circular handles** at bottom of blocks
- Multiple output types with different colors:
  - **Green (#10b981)**: Normal output (success/true path)
  - **Orange (#f59e0b)**: Inverted output (false path)
  - **Red (#ef4444)**: Error output (failure path)
- 14px diameter, positioned at bottom center

### 2. **Block Types with fxDreema-Style Connections**

#### Event Blocks (Starting Points)
- **Purple** left border and badge
- Single output handle (bottom, purple)
- No input handle (starts execution flow)
- Examples: OnInit, OnTick, OnTimer

#### Indicator Blocks
- **Cyan** left border and badge
- Input at top (white semicircle)
- Single output at bottom (green)
- Display parameters (e.g., "Period: 20")

#### Condition Blocks
- **Green** left border and badge
- Input at top (white semicircle)
- **Two outputs** at bottom:
  - Left: Normal output (green) - True path
  - Right: Inverted output (orange) - False path
- Allows branching logic

#### Action Blocks (Buy/Sell)
- **Green** (Buy) or **Red** (Sell) left border and badge
- Input at top (white semicircle)
- **Two outputs** at bottom:
  - Left: Success output (green)
  - Right: Error output (red)
- Trade execution with error handling

#### Logic Blocks (AND, OR, NOT, XOR)
- **Blue/Purple** left border and badge
- Input at top (white semicircle)
- Single output at bottom (green)
- Boolean logic operations

#### Pass Block (Special)
- **Gray** left border and badge
- **Dashed border** styling
- Input at top, single output at bottom
- Empty block that does nothing
- **Purpose**: Connect single blocks for testing without side effects

### 3. **Block Numbers and Labels**

#### Numbered Badges
- Top-left corner of each block
- Color-coded by block type
- Minimum 24px × 24px size
- Font: Monospace, bold, 10px
- Can display **numbers OR text labels**

#### Text Labels (FxDreema Feature)
- Blocks can be labeled with text instead of numbers
- Example: "ENTRY" instead of "1"
- Useful for organizing complex strategies
- Latin characters and numbers recommended

### 4. **Connection Rules (FxDreema Logic)**

#### Disconnected Blocks Do Not Work
- Blocks MUST be connected to participate in strategy
- Disconnected blocks are ignored during execution
- Visual indicator: Standard border (not highlighted)
- Can keep disconnected blocks for later use

#### Multiple Branches Support
- Single event can trigger multiple parallel branches
- Example:
  ```
  OnTick Event
    ├─ Branch 1: RSI → Buy
    └─ Branch 2: MACD → Sell
  ```
- Both branches execute independently
- Block numbers show execution order

#### Pass Block for Single Testing
- Connect any block to Pass block to test it alone
- Pass block does nothing but allows execution
- Example: `OnTick → Buy → Pass`

### 5. **Block Context Menu (Right-Click)**

Available actions:
- **Edit Title**: Change block label/number
- **Information**: View block execution details
- **Copy/Cut/Paste**: Clipboard operations (Ctrl+C/X/V)
- **Duplicate**: Quick copy (Ctrl+D)
- **Delete**: Remove block (Delete key)
- **Transform**: Resize, lock position, show/hide
- **Create Area**: Group blocks together
- **Wait to Pass**: Break connections

### 6. **Connection Visual Feedback**

#### Edge Styling
- **Green (#10b981)** default edge color
- 2px stroke width (3px when selected)
- Smooth curved connections (Bezier)
- Animated dashed lines for active connections
- Selected edges: Primary color with thicker stroke

#### Handle Hover States
- Handles enlarge slightly on hover
- Connection preview shows during drag
- Valid/invalid connection indicators
- Drop zones highlight when dragging

### 7. **Block Execution Flow**

#### Execution Order Rules
1. **Start from Event blocks** (OnInit, OnTick, etc.)
2. **Follow connections** from top to bottom
3. **Multiple outputs**: All connected paths execute
4. **Block numbers**: Show logical execution sequence
5. **Parallel branches**: Lower numbers execute first

#### Connection Types
- **Normal Output** (Green): Primary success path
- **Inverted Output** (Orange): Alternative/false path
- **Error Output** (Red): Error handling path

### 8. **Keyboard Shortcuts**

- `Ctrl+S`: Save strategy
- `Ctrl+Z`: Undo
- `Ctrl+Y` or `Ctrl+Shift+Z`: Redo
- `Ctrl+C`: Copy selected blocks
- `Ctrl+X`: Cut selected blocks
- `Ctrl+V`: Paste blocks
- `Ctrl+D`: Duplicate selected blocks
- `Delete` or `Backspace`: Delete selected blocks

### 9. **Visual Enhancements**

#### Block Styling
- **Rounded corners** (8px border-radius)
- **Shadow** for depth (md shadow)
- **Left border** (4px) color-coded by type
- **Selected state**: Primary color border with glow
- **Hover state**: Slight elevation increase

#### Spacing and Layout
- Minimum 140px width for blocks
- 12px padding inside blocks
- 4px gap between icon and text
- Badge positioned -10px from top-left

### 10. **Block Organization**

#### Multiple Branches Pattern
```
Event Block
  ├─ Branch A: Condition → Action
  ├─ Branch B: Indicator → Condition → Action
  └─ Branch C: Logic → Action
```

#### Linear Flow Pattern
```
Event → Indicator → Condition → Logic → Action
```

#### Error Handling Pattern
```
Action Block
  ├─ Success → Next Action
  └─ Error → Alert/Log
```

## Implementation Details

### Files Modified
1. `/src/components/builder/nodes/ActionNode.tsx` - Multi-output support
2. `/src/components/builder/nodes/ConditionNode.tsx` - True/False outputs
3. `/src/components/builder/nodes/EventNode.tsx` - Event block styling
4. `/src/components/builder/nodes/IndicatorNode.tsx` - Indicator display
5. `/src/components/builder/nodes/LogicNode.tsx` - Logic operations
6. `/src/components/builder/nodes/PassNode.tsx` - NEW: Empty pass block
7. `/src/components/builder/Canvas.tsx` - PassNode type registration
8. `/src/constants/node-categories.ts` - Pass block definition
9. `/src/index.css` - Enhanced edge and handle styling

### Color Palette
- **Event**: `oklch(0.80 0.10 320)` - Purple
- **Indicator**: `oklch(0.70 0.15 210)` - Cyan
- **Condition**: `oklch(0.65 0.18 145)` - Green
- **Logic**: `oklch(0.60 0.12 280)` - Blue/Purple
- **Action (Buy)**: `oklch(0.65 0.18 145)` - Green
- **Action (Sell)**: `oklch(0.55 0.20 25)` - Red
- **Pass**: `#6b7280` - Gray

### Connection Colors
- **Normal**: `#10b981` - Green
- **Inverted**: `#f59e0b` - Orange
- **Error**: `#ef4444` - Red

## Usage Examples

### Creating a Simple Strategy
1. Add `OnTick` event block (auto-starts)
2. Add `RSI` indicator block
3. Connect OnTick output to RSI input (top)
4. Add `Condition` block (RSI > 30)
5. Connect RSI output to Condition input
6. Add `Buy` action block
7. Connect Condition's "True" output (left, green) to Buy input
8. Strategy is complete!

### Testing a Single Block
1. Add `OnTick` event
2. Add action block (e.g., `Buy`)
3. Add `Pass` block
4. Connect: OnTick → Buy → Pass
5. Buy block now executes (Pass allows single-block testing)

### Multiple Parallel Conditions
1. Add `OnTick` event
2. Add two condition blocks
3. Connect OnTick to both condition inputs
4. Add action blocks for each condition's outputs
5. Both conditions evaluate on every tick

## Benefits of This Implementation

1. **Visual Clarity**: Color-coded handles show connection types instantly
2. **Error Handling**: Red error outputs make error paths explicit
3. **Branching Logic**: Multiple outputs enable complex decision trees
4. **Testing**: Pass block allows isolated block testing
5. **Block Numbers**: Clear execution order visualization
6. **FxDreema Compatibility**: Familiar workflow for fxDreema users
7. **Professional Look**: Modern, clean visual design
8. **Intuitive**: Top-to-bottom flow matches natural reading

## Future Enhancements

- [ ] Animated "flow" visualization during backtest
- [ ] Block grouping/areas for organization
- [ ] Breakpoints for debugging
- [ ] Conditional outputs based on parameters
- [ ] Custom output colors per block type
- [ ] Connection labels showing data types
- [ ] Zoom-to-fit selected blocks
- [ ] Auto-arrange blocks feature
