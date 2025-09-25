# Research: Keyboard Event Handling for Bracket Shortcuts

## Keyboard Event Handling Patterns for Userscripts

### Decision: Use global `keydown` event listener with event.preventDefault()
**Rationale**: 
- `keydown` fires before character input, allowing prevention of typing
- Global listener ensures shortcuts work regardless of focus state
- `event.preventDefault()` blocks default character insertion behavior

**Alternatives considered**:
- `keypress` event: Deprecated and inconsistent across browsers
- `keyup` event: Fires after character is already typed, too late to prevent
- Element-specific listeners: Would miss global shortcuts when not focused on audio controls

## Event.preventDefault() Behavior in Text Input Contexts

### Decision: Always call preventDefault() for bracket keys when audio exists
**Rationale**:
- Prevents "[" and "]" from being typed in any text field
- User explicitly wants shortcuts to override typing behavior
- Consistent behavior regardless of focus state

**Implementation approach**:
```javascript
if (event.key === '[' && audio) {
  event.preventDefault(); // Block typing
  // Handle speed decrease
}
```

## Cross-Browser Compatibility for Bracket Key Detection

### Decision: Use `event.key` property for key detection
**Rationale**:
- Modern browsers (Chrome, Firefox, Safari, Edge) all support `event.key`
- More reliable than `event.keyCode` which is deprecated
- Direct string comparison with '[' and ']' is clear and maintainable

**Alternatives considered**:
- `event.keyCode`: Deprecated, numeric codes less readable
- `event.which`: Also deprecated, browser compatibility issues
- `event.code`: Physical key location, doesn't account for keyboard layouts

## Integration with Existing Code Structure

### Decision: Replace existing keyboard event logic in setupControls()
**Rationale**:
- Maintain single event listener pattern established in current code
- Preserve existing speed control logic and visual feedback
- Minimal changes to working codebase structure

**Current structure to modify**:
- Existing Alt/Shift detection in keydown listener
- Same updateDisplay() function for visual feedback
- Same speeds array and currentIndex state management

## Performance Considerations

### Decision: Use same event delegation pattern as current implementation
**Rationale**:
- Current code already has global keydown listener
- No additional performance impact from bracket key detection
- Event filtering by key name is efficient

**Performance impact**: Negligible - single additional string comparison per keydown event