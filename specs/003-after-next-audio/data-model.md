# Data Model: Auto Reset Playback Speed State (Updated with Clarifications)

## State Variables

### Existing State (preserved)
```javascript
const speeds = [0.25, 0.5, 0.6, 1.0];  // Available playback speeds
let currentIndex = 3;                    // UPDATED: Start at 1.0x (was 2 = 0.6x)
let audio = null;                        // Current audio element reference  
let speedDisplay = null;                 // Speed display element reference
let buttonsContainer = null;             // Button container element reference
```

### New State (additions)
```javascript
let resetOnNextAudio = false;           // Flag indicating reset should occur on next audio
const DEFAULT_SPEED_INDEX = 3;         // Index for 1.0x speed (default after reset)
let currentAudioSrc = null;             // Track current audio src for change detection
```

## State Transitions (Updated with Clarifications)

### Initialization (Clarified)
**Trigger**: Script loads or page refresh
**Action**: Set `currentIndex = DEFAULT_SPEED_INDEX` (1.0x speed)
**State Change**: Start with 1.0x speed instead of 0.6x
**Rationale**: Clarification confirmed page refresh should reset to 1.0x

### Reset Trigger Activation  
**Trigger**: User changes playback speed (any button click or keyboard shortcut)
**Action**: Set `resetOnNextAudio = true`
**State Change**: Speed change occurs normally + reset flag activated
**Behavior**: Any user speed change activates reset for next audio

### Reset Execution (Clarified)
**Trigger**: Audio element's `src` attribute changes
**Condition**: Always (regardless of `resetOnNextAudio` flag per clarifications)
**Actions**: 
1. Set `currentIndex = DEFAULT_SPEED_INDEX` (1.0x speed)
2. Set `resetOnNextAudio = false` (clear flag)
3. Update `currentAudioSrc` to new src value
4. Call `updateDisplay()` to apply changes
**State Change**: Speed reset to 1.0x + reset flag cleared + src updated
**Rationale**: Clarification specified reset on every audio src change

### Normal Operation (enhanced)
**Triggers**: Button clicks, keyboard shortcuts  
**Actions**: 
1. Normal speed changes via existing logic
2. Set `resetOnNextAudio = true` (activate reset for next audio)
**State Change**: currentIndex changes + reset flag activated

## Data Flow (Updated)

```
Script Load → currentIndex = DEFAULT_SPEED_INDEX (1.0x)
                                ↓
User changes speed → resetOnNextAudio = true → Normal speed change
                                           ↓
Audio src changes → ALWAYS reset to 1.0x (currentIndex = DEFAULT_SPEED_INDEX)
                   resetOnNextAudio = false
                   currentAudioSrc = new src
                   updateDisplay()
                                           ↓
                         Speed controls show 1.0x, audio plays at normal speed
```

## Audio Source Monitoring

### Src Change Detection
```javascript
// New: Monitor audio src attribute changes
const audioObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
      const newSrc = audio.src;
      if (newSrc !== currentAudioSrc) {
        executeReset();
        currentAudioSrc = newSrc;
      }
    }
  });
});

// Setup: audioObserver.observe(audio, { attributes: true, attributeFilter: ['src'] });
```

## Validation Rules (Updated)

### Reset Behavior (Clarified)
- Reset occurs on EVERY audio src change (not conditional on resetOnNextAudio flag)
- Reset always targets 1.0x speed regardless of user's previous selections
- Reset flag is cleared after execution but reset happens regardless
- Multiple rapid src changes each trigger individual resets

### Audio Source Tracking
- `currentAudioSrc` must be updated after each reset
- Src comparison prevents duplicate resets on same audio
- Observer must be reattached if audio element changes

### Speed Index Bounds  
- `DEFAULT_SPEED_INDEX` must be valid index in speeds array
- Initialization uses DEFAULT_SPEED_INDEX instead of hardcoded value
- All existing speed validation rules remain unchanged

## Integration with Existing System (Updated)

### Initialization Changes
- `currentIndex` starts at 3 (1.0x) instead of 2 (0.6x)
- Complies with clarification for page refresh behavior

### Audio Detection Enhancement  
- Existing MutationObserver for new audio elements remains
- Additional attribute observer for src changes on existing audio
- Both observers can coexist safely

### updateDisplay() Function
- No changes required - works with any currentIndex value
- Reset behavior is transparent to display system
- Maintains all existing visual feedback

### Speed Control Handlers  
- Button clicks: Execute normal speed change + set reset flag
- Keyboard shortcuts: Execute normal speed change + set reset flag  
- Reset execution is now automatic on every audio src change