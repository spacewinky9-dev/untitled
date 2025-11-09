# PR-01 Phase 3: Canvas Interaction Improvements

## Status: PLANNED

## Overview
Improve canvas interactions for efficient strategy building with multi-select, bulk operations, and smart guides.

## Objectives
1. Multi-select nodes with drag or Ctrl/Shift+Click
2. Bulk operations (delete, copy, move, align)
3. Smart guides and snap-to-grid
4. Connection hints and auto-routing

## Implementation Plan

### 1. Multi-Select
- Drag selection box
- Ctrl+Click for individual selection
- Shift+Click for range selection
- Visual feedback for selected nodes

### 2. Bulk Operations
- Delete multiple nodes
- Copy/paste selection
- Move nodes together
- Align nodes (left, right, top, bottom, center)
- Distribute nodes evenly

### 3. Smart Guides
- Show alignment guides when dragging
- Snap to grid (optional)
- Snap to other nodes
- Equal spacing indicators

### 4. Connection Hints
- Show compatible pins when hovering
- Auto-route connections
- Suggest connections based on types
- Highlight connection errors

## Technical Requirements

### Files to Modify
- `src/components/builder/Canvas.tsx`
- `src/hooks/useSelection.ts` (new)
- `src/hooks/useSmartGuides.ts` (new)

### State Management
- Selection state (Set<nodeId>)
- Guide lines state
- Snap settings

## Testing Requirements
- [ ] Multi-select works with all methods
- [ ] Bulk operations don't break connections
- [ ] Guides show/hide correctly
- [ ] Snap works with keyboard override
- [ ] Connection hints accurate

## Estimated Effort
2-3 days

## Continuation Prompt
```
Implement PR-01 Phase 3: Canvas Interaction Improvements
1. Add multi-select functionality
2. Implement bulk operations
3. Create smart guides system
4. Add connection hints
5. Test all interactions
6. Document keyboard shortcuts
```
