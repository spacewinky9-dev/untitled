# Custom Node Name Editing - Complete Implementation

## Overview
ForexFlow now features a comprehensive custom node name editing system that allows users to rename any node in their trading strategy through multiple intuitive methods. This feature enhances strategy organization and readability by enabling personalized node labels.

## Features Implemented

### 1. Inline Editing (Double-Click)
- **Activation**: Double-click on any node label
- **Implementation**: All 17 node types support inline editing via the `InlineNodeEditor` component
- **User Experience**:
  - Input field appears with current label pre-selected
  - Press Enter to save
  - Press Escape to cancel
  - Click outside to save automatically
  - Visual feedback with border highlight and shadow during editing

### 2. Keyboard Shortcut (F2)
- **Activation**: Select a node and press F2
- **Behavior**: Opens the `EditBlockLabelDialog` for advanced label editing
- **Benefits**: Quick access without mouse interaction, standard across many applications

### 3. Context Menu (Right-Click)
- **Activation**: Right-click on a node and select "Edit Title"
- **Shortcut Display**: Shows "F2" hint next to menu item
- **Behavior**: Opens the `EditBlockLabelDialog`

### 4. Edit Block Label Dialog
A comprehensive dialog that provides two label types:

#### Number Labels
- Input field for numeric labels
- Useful for execution order visualization
- Default format for block numbering
- Min value: 1

#### Text Labels
- Input field for custom text (max 12 characters)
- Auto-converts to uppercase for consistency
- Useful for semantic organization (ENTRY, EXIT, FILTER, etc.)
- Quick presets: ENTRY, EXIT, FILTER, CONFIRM, CHECK
- Latin characters and numbers recommended

### 5. Enter Key Support
- Both inline editor and dialog support Enter key to save quickly
- Shift+Enter in dialog preserved for future multi-line support

### 6. Feature Discovery
- First-time users see a helpful tooltip: "💡 Tip: Double-click or press F2 to rename any node!"
- Appears 2 seconds after loading the canvas
- Shows only once per user (persisted via useKV)
- Duration: 5 seconds

## Node Types Supporting Custom Names

All 17 node types have been enhanced with inline editing:

1. ✅ **IndicatorNode** - Technical indicators (RSI, MA, etc.)
2. ✅ **ConditionNode** - Comparison and condition blocks
3. ✅ **ActionNode** - Buy, Sell, Close, Alert actions
4. ✅ **LogicNode** - AND, OR, NOT, XOR gates
5. ✅ **RiskNode** - Risk management blocks
6. ✅ **EventNode** - OnTick, OnInit, OnTimer, etc.
7. ✅ **PassNode** - Pass-through blocks
8. ✅ **MTFNode** - Multi-timeframe analysis blocks
9. ✅ **PatternNode** - Pattern recognition blocks
10. ✅ **VariableNode** - Variable storage and retrieval
11. ✅ **AdvancedNode** - Break-even, trailing stops, etc.
12. ✅ **MoneyManagementNode** - Position sizing strategies
13. ✅ **GraphicalNode** - Chart object blocks
14. ✅ **MessagingNode** - Notification blocks
15. ✅ **FileOpsNode** - File I/O operations
16. ✅ **TerminalNode** - Terminal information blocks
17. ✅ **CustomBlockNode** - User-defined custom blocks

## Technical Implementation

### Component Structure
```
Canvas.tsx
├── InlineNodeEditor (embedded in each node)
├── EditBlockLabelDialog (modal for advanced editing)
├── ContextMenu (right-click menu with Edit Title)
└── Keyboard handler (F2 shortcut)
```

### Data Persistence
- Custom labels stored in node's `data.customLabel` property
- Persists through save/load cycles
- Undo/redo support via history system
- Changes tracked for validation and export

### Visual Feedback
- **Inline Editing**: Border highlight (2px primary), shadow, ring effect
- **Selected Node**: Orange ring (ring-2 ring-[#f59e0b])
- **Block Numbers**: Circular badges with color coding by node type

## User Workflows

### Quick Rename (Most Common)
1. Double-click node label
2. Type new name
3. Press Enter or click outside

### Advanced Rename (With Options)
1. Select node
2. Press F2 (or right-click → Edit Title)
3. Choose Number or Text label
4. Enter value
5. Press Enter or click Save

### Context Menu Rename
1. Right-click node
2. Click "Edit Title" (F2 shown)
3. Dialog opens with options
4. Save changes

## Keyboard Shortcuts Summary
- **F2**: Open edit label dialog
- **Enter**: Save current edit
- **Escape**: Cancel inline edit
- **Ctrl/Cmd+Z**: Undo label change
- **Ctrl/Cmd+Y**: Redo label change

## Integration with Other Features

### Block Numbering System
- Custom labels override auto-generated block numbers
- Toggle block numbers on/off without losing custom labels
- Execution order preserved independently

### Export (MQL4/MQL5)
- Custom node names included in exported code comments
- Helps identify blocks in generated MT4/MT5 EA code

### Strategy Validation
- Custom labels improve error message readability
- Validation shows custom names for easier debugging

### History/Undo System
- All label changes tracked in history
- Undo/redo fully supported
- History entry: "Edit block label"

## Best Practices for Users

### Naming Conventions
- **Entry Conditions**: "ENTRY_1", "ENTRY_2" or "MA_CROSS", "RSI_FILTER"
- **Exit Conditions**: "EXIT_1", "EXIT_2" or "STOP_LOSS", "TAKE_PROFIT"
- **Filters**: "FILTER_1", "TREND_CHECK", "VOLATILITY"
- **Actions**: "BUY", "SELL", "CLOSE_ALL"
- **Logic**: "AND_1", "OR_COMBINE"

### Organization Tips
- Use consistent prefixes for related blocks
- Keep names under 12 characters for readability
- Use uppercase for better visibility
- Number similar blocks sequentially

## Success Metrics
- ✅ All 17 node types support custom naming
- ✅ Three access methods (double-click, F2, context menu)
- ✅ Visual feedback during editing
- ✅ Persistence across sessions
- ✅ Undo/redo support
- ✅ First-time user discovery tooltip
- ✅ Enter key quick-save
- ✅ Integration with existing features

## Future Enhancements (Potential)
- Batch rename multiple selected nodes
- Copy/paste formatting for labels
- Label templates and presets library
- Label search/filter in complex strategies
- Label color customization
- Multi-line labels for detailed descriptions
