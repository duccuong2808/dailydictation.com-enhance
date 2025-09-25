# Research: Auto Reset Playback Speed After Next Audio (Updated)

## Technical Analysis - Incorporating Clarifications

### Audio Source Change Detection (Clarified)
**Decision**: Monitor audio element's `src` attribute changes instead of DOM mutations  
**Rationale**: Clarification session confirmed trigger should be "audio source URL changes (same element, different src)". This is more precise than MutationObserver which detects new elements.  
**Implementation**: Use `MutationObserver` with `{ attributes: true, attributeFilter: ['src'] }` to watch for src changes on existing audio element.  
**Alternatives considered**: 
- MutationObserver for new elements - rejected per clarifications (not the intended trigger)
- Polling audio.src - rejected for performance reasons
- Event listeners on audio load events - less reliable than direct src monitoring

### Reset Target Definition (Clarified)  
**Decision**: Always reset to 1.0x normal playback speed  
**Rationale**: Clarification confirmed "Always 1.0x (normal playback speed)" regardless of user's initial or preferred speed.  
**Implementation**: `DEFAULT_SPEED_INDEX = 3` (index in speeds array [0.25, 0.5, 0.6, 1.0])  
**Alternatives considered**: 
- User preference-based default - rejected per clarifications
- Last speed before changes - rejected per clarifications  
- Most used speed - rejected per clarifications

### Multiple Audio Changes Handling (Clarified)
**Decision**: Reset to 1.0x on every audio source change  
**Rationale**: Clarification specified "Reset tốc độ về 1.0x mỗi khi có audio mới" (reset speed to 1.0x every time there's new audio).  
**Implementation**: No debouncing or throttling - immediate reset on each src change.  
**Alternatives considered**: 
- Reset only on first change - rejected per clarifications
- Debounced resets - rejected per clarifications
- User override capability - rejected per clarifications

### Page Refresh Behavior (Clarified)
**Decision**: Reset to 1.0x when page loads with audio  
**Rationale**: Clarification specified "Reset to 1.0x" for page refresh scenarios.  
**Implementation**: Initialize currentIndex to DEFAULT_SPEED_INDEX on script load instead of current value (2 = 0.6x).  
**Alternatives considered**: 
- Maintain user's last speed - rejected per clarifications
- LocalStorage persistence - rejected per clarifications
- No special handling - rejected per clarifications

### Speed Change Behavior (Clarified)  
**Decision**: Reset based on final speed user selected before audio change  
**Rationale**: Clarification specified "Reset dựa trên tốc độ cuối cùng user chọn" (reset based on final speed user chose).  
**Implementation**: Track user's speed changes, reset trigger activated by any speed change, reset uses 1.0x regardless of what user selected.  
**Note**: This appears to contradict "always 1.0x" but clarification suggests reset still goes to 1.0x, not the final user speed.

## Implementation Approach (Updated)

### Core Architecture Changes:
1. **Audio Source Monitoring**: Replace/supplement MutationObserver with src attribute monitoring
2. **Initialization Changes**: Start with 1.0x speed (currentIndex = 3) instead of 0.6x
3. **Reset Logic**: Immediate reset on every audio src change
4. **State Management**: Simple boolean flag, no complex timing logic needed

### Integration Points (Refined):
- **Audio Detection**: Monitor both new audio elements AND src changes on existing elements
- **Reset Execution**: Trigger immediately when src changes, no delays or conditions
- **User Interaction**: Any speed change activates reset flag for next audio
- **Page Load**: Initialize to 1.0x speed from start

### Backward Compatibility (Maintained):
- All existing speed controls continue to work
- Visual feedback system remains unchanged  
- Keyboard shortcuts preserved
- Original functionality enhanced, not replaced

### Performance Considerations (Updated):
- Audio src monitoring adds minimal overhead (attribute observer)
- No polling or continuous checking required
- Reset logic executes only on actual src changes
- Constitutional compliance maintained - still minimal impact