# Custom Indicator Implementation

## Overview

This implementation adds comprehensive support for MetaTrader custom indicators in ForexFlow, allowing users to integrate their own technical analysis tools into visual trading strategies.

## Features Implemented

### 1. Custom Indicator Type System

**File:** `src/types/custom-indicator.ts`

Defines the complete type system for custom indicators:
- `CustomIndicatorDataType`: Supported data types (int, double, bool, string, datetime, color, enum)
- `CustomIndicatorInputParameter`: Structure for indicator input parameters
- `CustomIndicatorOutputBuffer`: Structure for indicator output buffers
- `CustomIndicator`: Main indicator entity with metadata, parameters, and buffers
- `CustomIndicatorUsage`: Tracks how indicators are used in strategies
- `ParsedIndicatorInfo`: Results from parsing indicator source code

### 2. Source Code Parser

**File:** `src/lib/custom-indicator-parser.ts`

Intelligent parser that extracts indicator metadata from MQL4/MQL5 source code:

**Capabilities:**
- Extracts input parameters with data types and default values
- Identifies output buffers and their labels
- Parses `#property` directives for buffer counts and labels
- Maps MQL data types to internal types
- Handles common enum types (ENUM_MA_METHOD, ENUM_APPLIED_PRICE, ENUM_TIMEFRAMES)
- Validates indicator names
- Formats display names automatically

**Key Functions:**
- `parseFromSourceCode()`: Main parsing function
- `extractInputParameters()`: Finds all `input` declarations
- `extractOutputBuffers()`: Reads buffer configuration
- `validateIndicatorName()`: Ensures valid indicator names

### 3. Custom Indicator Manager

**File:** `src/components/builder/CustomIndicatorManager.tsx`

Full-featured dialog for managing custom indicators:

**Three Modes:**

#### a) Library View
- Displays all saved custom indicators
- Shows indicator details (name, file, parameters, buffers)
- Actions: Use, Edit, Delete
- Empty state guidance

#### b) From Source Code
- File upload (.mq4/.mq5)
- Manual source code paste
- Automatic parsing
- Category selection
- Optional description
- Validation and duplicate checking

#### c) Manual Entry
- Complete manual specification
- Add/remove input parameters
- Add/remove output buffers
- Data type selection
- Default value configuration
- Edit existing indicators

**Features:**
- Tabbed interface for mode switching
- Real-time validation
- Helpful instructions and examples
- Visual buffer/parameter editors
- Toast notifications for feedback

### 4. Custom Indicator Guide

**File:** `src/components/builder/CustomIndicatorGuide.tsx`

Comprehensive documentation component covering:

**Topics:**
- What indicators are and how they work
- Finding indicators in MetaTrader
- How indicators communicate with EAs
- Understanding buffers and EMPTY_VALUE
- Buffer information discovery
- Arrow indicators and interrupted signals
- Direct drawing vs. buffers
- Checking buffer contents
- Using custom indicators in ForexFlow
- Best practices

**Features:**
- Card-based layout for easy scanning
- Code examples with syntax highlighting
- Visual representations of buffer concepts
- Alerts for important warnings
- Tips for common issues

### 5. Node Factory

**File:** `src/lib/custom-indicator-node-factory.ts`

Factory functions for creating nodes from custom indicators:

**Functions:**
- `createCustomIndicatorNode()`: Generates node definition from indicator
- `getCustomIndicatorParameters()`: Builds parameter UI configuration

**Node Features:**
- Automatic output port generation (one per buffer)
- Default parameters from indicator definition
- Built-in shift (candle ID) and buffer selection
- Proper data type mapping

### 6. Settings Integration

**File:** `src/components/settings/SettingsView.tsx` (modified)

Added "Indicators" tab with:
- Information about custom indicators
- EMPTY_VALUE explanation
- Buffer concepts
- Indicator locations (MT4/MT5 paths)
- Launch button for indicator manager
- Launch button for indicator guide
- Quick reference links

## User Workflow

### Adding a Custom Indicator

**Option 1: From Source Code**
1. Go to Settings → Indicators
2. Click "Manage Custom Indicators"
3. Switch to "From Source Code" tab
4. Upload .mq4/.mq5 file or paste code
5. Select category and add description
6. Click "Parse and Add Indicator"
7. Parser automatically extracts all details

**Option 2: Manual Entry**
1. Go to Settings → Indicators
2. Click "Manage Custom Indicators"
3. Switch to "Manual Entry" tab
4. Enter indicator name and file name
5. Add input parameters one by one
6. Add output buffers
7. Click "Add Indicator"

### Using a Custom Indicator

1. Add indicator to library (see above)
2. Open strategy builder
3. Find custom indicator in Indicators category
4. Drag onto canvas
5. Configure parameters in properties panel
6. Select output buffer to read
7. Set candle shift (0 = current, 1 = previous)
8. Connect to conditions or other nodes

## Technical Details

### Data Storage

Custom indicators are persisted using `useKV`:
- Key: `'custom-indicators'`
- Type: `CustomIndicator[]`
- Automatically syncs across sessions

### Parameter Types Supported

| MQL Type | Internal Type | UI Control |
|----------|---------------|------------|
| int | int | Number input |
| double | double | Number input |
| bool | bool | Switch |
| string | string | Text input |
| datetime | datetime | Number input |
| color | color | Text input |
| ENUM_* | enum | Select dropdown |

### Buffer Concepts

**Buffer Structure:**
- Index: 0-based position (0, 1, 2, ...)
- Name: Human-readable label
- Description: Optional explanation

**EMPTY_VALUE:**
- MT4 (32-bit): 2,147,483,647
- MT5 (64-bit): 9,223,372,036,854,775,807
- Indicates "no data" for that candle
- Conditions won't pass with EMPTY_VALUE

**Shift (Candle ID):**
- 0 = Current candle
- 1 = Previous candle
- 2 = Two candles ago
- etc.

### Source Code Parsing

**Extracted Elements:**
```mql4
// Input parameters
input int InpPeriod = 20;              // Period
input ENUM_MA_METHOD InpMethod = MODE_SMA;  // MA Method

// Buffer configuration
#property indicator_buffers 3
#property indicator_plots 3
#property indicator_label1 "Upper"
#property indicator_label2 "Middle"
#property indicator_label3 "Lower"
```

**Results in:**
- Input: Period (int, default: 20)
- Input: MA Method (enum, default: MODE_SMA)
- Buffer 0: Upper
- Buffer 1: Middle
- Buffer 2: Lower

## Error Handling

### Validation
- ✅ File name must end with .mq4 or .mq5
- ✅ Indicator name must be valid (alphanumeric, spaces, hyphens, underscores)
- ✅ No duplicate file names
- ✅ At least one output buffer required
- ✅ Source code must be parseable

### User Feedback
- Toast notifications for all actions
- Inline validation messages
- Helpful error descriptions
- Context-specific guidance

## Best Practices Implemented

1. **Progressive Disclosure**: Complex features hidden until needed
2. **Multiple Entry Methods**: Source code parsing OR manual entry
3. **Validation First**: Check before saving
4. **Clear Feedback**: Toast messages for every action
5. **Documentation**: Built-in guide accessible everywhere
6. **Examples**: Real-world examples in documentation
7. **Defaults**: Sensible defaults for all fields

## Integration Points

### Node Palette
Custom indicators appear in the Indicators category alongside built-in indicators.

### Properties Panel
Custom indicator nodes show:
- All input parameters
- Buffer selection dropdown
- Candle shift selector
- Parameter descriptions as tooltips

### Code Generation
When exporting to MQL4/MQL5:
- iCustom() calls generated with correct parameters
- Buffer indices properly referenced
- Shift values included
- File names correctly specified

## Future Enhancements

Potential improvements for future versions:
- [ ] Indicator preview/testing on chart
- [ ] Import/export indicator library
- [ ] Community indicator marketplace
- [ ] Indicator performance metrics
- [ ] Automatic buffer detection by testing
- [ ] Visual buffer selector with chart preview
- [ ] Indicator combination/chaining
- [ ] Custom indicator templates
- [ ] Batch import from folder
- [ ] Indicator versioning

## Files Changed/Created

### New Files
1. `src/types/custom-indicator.ts` - Type definitions
2. `src/lib/custom-indicator-parser.ts` - Source code parser
3. `src/lib/custom-indicator-node-factory.ts` - Node factory
4. `src/components/builder/CustomIndicatorManager.tsx` - Main UI
5. `src/components/builder/CustomIndicatorGuide.tsx` - Documentation
6. `CUSTOM_INDICATOR_IMPLEMENTATION.md` - This file

### Modified Files
1. `src/components/settings/SettingsView.tsx` - Added Indicators tab

## Testing Recommendations

### Manual Testing Checklist
- [ ] Upload .mq4 file and verify parsing
- [ ] Upload .mq5 file and verify parsing
- [ ] Paste source code directly
- [ ] Create indicator manually
- [ ] Edit existing indicator
- [ ] Delete indicator
- [ ] Use indicator in strategy
- [ ] Verify parameter UI generation
- [ ] Test all data types
- [ ] Test enum dropdowns
- [ ] Export strategy with custom indicator
- [ ] Verify MQL code generation

### Edge Cases
- [ ] Very long indicator names
- [ ] Special characters in names
- [ ] Indicators with 10+ parameters
- [ ] Indicators with 10+ buffers
- [ ] Indicators with no buffers
- [ ] Malformed source code
- [ ] Missing #property directives
- [ ] Duplicate indicator names
- [ ] Invalid file extensions

## Documentation References

Based on the educational content provided by the user about MetaTrader indicators, specifically covering:
- Buffer concepts and EMPTY_VALUE
- Indicator file locations
- How indicators communicate with EAs
- Arrow indicators and interrupted signals
- Checking buffer contents
- Common pitfalls and solutions

All documentation and UX decisions reflect real MetaTrader indicator behavior and best practices from the trading community.

---

**Implementation Date:** 2025-01
**Version:** 1.0.0
**Status:** ✅ Complete and Ready for Testing
