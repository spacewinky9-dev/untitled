# Custom Indicator Builder - Implementation Complete

## Overview
Added a comprehensive custom indicator builder with an intuitive visual parameter configuration interface. Users can now create, configure, and manage custom MetaTrader indicators without writing code.

## Features Implemented

### 1. **Visual Parameter Builder**
- **Drag-and-Reorder Parameters**: Use arrow buttons to change parameter order
- **Rich Data Type Support**: int, double, bool, string, datetime, color, and enum (dropdown)
- **Parameter Validation**: Real-time validation with helpful error messages
- **Default Values**: Configure default values for each parameter
- **Min/Max/Step**: Define numerical constraints for int and double types
- **Enum Options**: Build dropdown selects with custom options (label + value pairs)
- **Parameter Descriptions**: Add helpful descriptions for each parameter

### 2. **Output Buffer Management**
- **Multiple Buffers**: Define multiple output buffers (like MACD with 3 lines)
- **Auto-Indexing**: Buffers automatically indexed (0, 1, 2, etc.)
- **Buffer Naming**: Give meaningful names to each buffer
- **Buffer Descriptions**: Document what each buffer represents
- **Validation**: Ensures at least one output buffer exists

### 3. **Complete Builder Dialog**
The custom indicator builder provides:

#### Basic Information Section
- Indicator name (display name for the node)
- File name (MT4/MT5 filename without extension)
- Category (Trend, Momentum, Volatility, Volume, Custom)
- Description (what the indicator does)

#### Input Parameters Section
- Add unlimited parameters
- Reorder parameters with up/down arrows
- Configure each parameter:
  - Variable name (code identifier)
  - Display name (user-friendly label)
  - Data type with icon indicators
  - Default value (type-specific input)
  - Min/Max/Step for numbers
  - Enum options for dropdowns
  - Optional description

#### Output Buffers Section
- Add multiple buffers
- Buffer index (auto-assigned)
- Buffer name (e.g., "Upper Band", "Lower Band")
- Buffer description

### 4. **Integration with Existing System**
- **Replaces Manual Entry**: The new builder replaces the old simple manual entry form
- **Quick Access Button**: "Builder" button in CustomIndicatorManager header
- **Edit Support**: Edit existing indicators by clicking the edit button
- **Validation**: All validations from the parser are preserved
- **Auto-Save**: Changes saved to useKV automatically

## User Workflow

### Creating a Custom Indicator

1. **Open Custom Indicator Manager**
   - From Canvas toolbar, click "Custom Indicators" or similar button

2. **Click "Builder" Button**
   - Located in the header of the manager dialog

3. **Fill Basic Information**
   - Enter indicator name: `Custom ATR`
   - Enter file name: `CustomATR`
   - Select category: `Volatility`
   - Add description: `Custom implementation of Average True Range`

4. **Add Input Parameters**
   - Click "Add Parameter"
   - Configure each parameter:
     - Example: Period parameter
       - Name: `Period`
       - Display Name: `ATR Period`
       - Type: `int`
       - Default: `14`
       - Min: `1`, Max: `500`, Step: `1`
       - Description: `Number of bars to calculate ATR`

5. **Configure Output Buffers**
   - Default buffer already exists
   - Rename to meaningful names
   - Add more buffers if needed (e.g., for indicators with multiple lines)

6. **Save**
   - Click "Create Indicator" or "Update Indicator"
   - Indicator appears in library

### Editing an Existing Indicator

1. **Open Library Tab**
2. **Click Edit Icon** on any indicator card
3. **Builder Opens** with all fields pre-filled
4. **Make Changes**
5. **Click "Update Indicator"**

## Technical Implementation

### Component Structure
```
CustomIndicatorBuilder.tsx (NEW)
├── Main Dialog
│   ├── Basic Information Card
│   ├── Input Parameters Card
│   │   └── ParameterEditor (for each parameter)
│   └── Output Buffers Card
│       └── BufferEditor (for each buffer)
└── Save/Cancel Actions

CustomIndicatorManager.tsx (UPDATED)
├── Library Tab
├── From Source Code Tab
└── Builder Integration
```

### Data Flow
1. **Create New**: Empty form → User fills → Save → useKV storage
2. **Edit Existing**: Load from storage → Pre-fill form → User edits → Update → useKV storage
3. **Delete**: Remove from useKV storage → Update library view

### Parameter Types and UI

| Type | Input Widget | Features |
|------|-------------|----------|
| `int` | Number input | Min, Max, Step |
| `double` | Number input (decimal) | Min, Max, Step |
| `bool` | Switch toggle | True/False display |
| `string` | Text input | Free text |
| `datetime` | Text input | ISO format |
| `color` | Text input | Color code |
| `enum` | Select dropdown | Custom options with labels and values |

### State Management
- Uses React `useState` for form state
- Parameter list array with add/remove/update operations
- Output buffer list with automatic indexing
- Validation before save
- Auto-reset form on cancel

## Benefits

### For Users
1. **No Coding Required**: Visual interface for parameter configuration
2. **Intuitive**: Form-based approach similar to spreadsheets
3. **Validation**: Immediate feedback on errors
4. **Flexible**: Supports all MT4/MT5 data types
5. **Professional**: Polished UI with icons and clear labels

### For the Application
1. **Replaces Complex Form**: Single, comprehensive builder vs fragmented forms
2. **Better UX**: Visual hierarchy and clear sections
3. **Maintainable**: Single source of truth for indicator definition
4. **Extensible**: Easy to add new data types or features
5. **Consistent**: Same UI patterns as rest of application

## Future Enhancements

### Potential Additions
1. **Import from File**: Direct .mq4/.mq5 file upload to builder
2. **Parameter Templates**: Pre-defined parameter sets (e.g., "Period", "Source", "Shift")
3. **Buffer Preview**: Visual preview of what buffer data looks like
4. **Validation Rules**: Custom validation rules per parameter
5. **Parameter Groups**: Organize parameters into collapsible sections
6. **Code Generation**: Show generated MQL code preview
7. **Test Mode**: Test indicator with dummy data before saving
8. **Duplicate**: Clone existing indicators to create variations
9. **Export/Import**: Share indicator definitions as JSON
10. **Help System**: Contextual help for each field

## Usage Examples

### Example 1: Simple Moving Average
```
Name: Custom SMA
File: CustomSMA
Category: Trend

Parameters:
1. Period (int, default: 20, min: 1, max: 500)
2. Source (enum: Close, Open, High, Low)
3. Shift (int, default: 0, min: 0, max: 100)

Buffers:
0. SMA Value
```

### Example 2: Bollinger Bands
```
Name: Custom BB
File: CustomBB
Category: Volatility

Parameters:
1. Period (int, default: 20)
2. Deviation (double, default: 2.0, min: 0.1, max: 5.0, step: 0.1)
3. Source (enum: Close, Open, High, Low)

Buffers:
0. Upper Band
1. Middle Band
2. Lower Band
```

### Example 3: Custom Oscillator
```
Name: Custom RSI
File: CustomRSI
Category: Momentum

Parameters:
1. Period (int, default: 14)
2. Overbought (int, default: 70, min: 50, max: 95)
3. Oversold (int, default: 30, min: 5, max: 50)
4. Apply to (enum: Close, Open, High, Low)
5. Show Levels (bool, default: true)

Buffers:
0. RSI Value
1. Overbought Level
2. Oversold Level
```

## Integration Points

### With Canvas
- Custom indicators appear in node palette under "Indicators"
- Draggable to canvas like built-in indicators
- Full parameter configuration in properties panel

### With Strategy Export
- Custom indicators referenced in MQL export
- iCustom() calls generated with correct parameters
- Buffer indices mapped correctly

### With Backtesting
- Custom indicator values simulated during backtest
- Parameters adjustable in strategy settings
- Performance impact monitored

## Files Modified/Created

### New Files
- `src/components/builder/CustomIndicatorBuilder.tsx` - Main builder component

### Modified Files
- `src/components/builder/CustomIndicatorManager.tsx` - Integrated builder, removed old manual entry

### Unchanged (Works With)
- `src/types/custom-indicator.ts` - Type definitions
- `src/lib/custom-indicator-parser.ts` - Source code parser
- `src/lib/custom-indicator-node-factory.ts` - Node creation from indicator definition

## Conclusion

The Custom Indicator Builder provides a professional, user-friendly interface for creating and managing custom MetaTrader indicators. It eliminates the complexity of manual form entry and provides a visual, guided experience similar to professional trading platforms.

Users can now:
✅ Create custom indicators visually
✅ Configure complex parameters with validation
✅ Define multiple output buffers
✅ Edit existing indicators easily
✅ Organize indicators by category
✅ Use custom indicators in their strategies

This feature brings ForexFlow closer to parity with FXDreema while providing a more modern and intuitive user experience.
