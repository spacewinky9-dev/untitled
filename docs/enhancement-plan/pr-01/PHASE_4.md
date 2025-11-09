# PR-01 Phase 4: Keyboard Shortcuts & Accessibility

## Status: PLANNED

## Overview
Add comprehensive keyboard shortcuts and accessibility features for power users and inclusive design.

## Objectives
1. Comprehensive keyboard shortcuts
2. Accessibility improvements (ARIA, screen readers)
3. Command palette for quick actions
4. Enhanced tooltips and contextual help

## Implementation Plan

### 1. Keyboard Shortcuts
**Global Shortcuts**:
- `Ctrl+S`: Save strategy
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Ctrl+C/V`: Copy/Paste
- `Delete`: Delete selected
- `Ctrl+A`: Select all
- `Ctrl+F`: Search nodes
- `Ctrl+K`: Command palette

**Canvas Shortcuts**:
- Arrow keys: Move selected nodes
- `+/-`: Zoom in/out
- `0`: Fit to view
- `Space+Drag`: Pan canvas
- `Shift+Drag`: Constrain movement

### 2. Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation throughout app
- Screen reader announcements
- High contrast mode
- Focus indicators

### 3. Command Palette
- Quick access to all actions
- Fuzzy search
- Recent commands
- Keyboard shortcuts shown

### 4. Tooltips & Help
- Contextual tooltips
- Inline documentation
- Help button for each node
- Tutorial mode

## Technical Requirements

### Files to Create/Modify
- `src/hooks/useKeyboardShortcuts.ts` (new)
- `src/components/ui/CommandPalette.tsx` (new)
- `src/utils/accessibility.ts` (new)
- Add ARIA attributes throughout

### Keyboard Handler
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    // ... other shortcuts
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

## Testing Requirements
- [ ] All shortcuts work consistently
- [ ] No conflicts with browser shortcuts
- [ ] Screen reader announces changes
- [ ] Keyboard navigation complete
- [ ] Command palette finds all actions
- [ ] Tooltips provide useful info

## Accessibility Checklist
- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] Focus order is logical
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard-only navigation works
- [ ] Screen reader tested

## Documentation
- Shortcut reference card
- Accessibility statement
- Keyboard navigation guide

## Estimated Effort
1-2 days

## Continuation Prompt
```
Implement PR-01 Phase 4: Keyboard Shortcuts & Accessibility
1. Add keyboard shortcut system
2. Implement command palette
3. Add ARIA labels throughout
4. Create tooltip system
5. Test with keyboard only
6. Test with screen reader
7. Document all shortcuts
```
