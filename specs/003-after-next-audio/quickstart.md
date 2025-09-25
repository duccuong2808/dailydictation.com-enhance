# Quickstart: Auto Reset Playback Speed Testing (Updated with Clarifications)

## Prerequisites
- Chrome browser with Tampermonkey extension installed
- Access to https://dailydictation.com
- Modified script.js with clarified auto-reset functionality

## Test Scenario 1: Basic Reset Functionality (Clarified)

### Setup
1. Navigate to https://dailydictation.com
2. Find any lesson with audio player
3. Wait for speed control buttons to appear below audio player
4. **VERIFY**: Initial speed shows 1.0x (updated per clarifications)

### Test Steps
1. **Change Speed**: Click any speed button (0.25x, 0.5x, or 0.6x) - NOT the 1.0x button
2. **Verify Speed Change**: Confirm audio playback speed changes and button highlights
3. **Navigate to Trigger Audio Src Change**: 
   - Click "Next" lesson button (if it changes audio src), OR
   - Use lesson navigation that changes the audio file, OR
   - Any action that changes the audio element's src attribute
4. **Wait for Audio Src Change**: Allow new audio src to load
5. **Verify Auto Reset**: Check that speed controls show 1.0x highlighted and audio plays at normal speed

### Expected Results (Clarified)
- ✅ Initial speed is 1.0x (not 0.6x as before)
- ✅ Speed changes normally in step 2
- ✅ Auto reset to 1.0x occurs on EVERY audio src change
- ✅ 1.0x button is highlighted after reset
- ✅ No user interaction needed for reset to occur

## Test Scenario 2: Edge Cases (Clarified)

### Test 2.1: Multiple Speed Changes Before Src Change
1. Change speed to 0.25x
2. Change speed to 0.5x  
3. Change speed to 0.6x
4. Trigger audio src change
5. **Expected**: Resets to 1.0x (not the last user speed per clarifications)

### Test 2.2: Rapid Audio Source Changes  
1. Change speed to 0.5x
2. Rapidly navigate through multiple audio exercises (multiple src changes)
3. **Expected**: Resets to 1.0x on EVERY audio src change

### Test 2.3: Page Refresh Behavior (New Test from Clarifications)
1. Change speed to any non-1.0x speed
2. Refresh the browser page
3. Navigate to lesson with audio
4. **Expected**: Speed starts at 1.0x (not user's last speed)

### Test 2.4: Audio Src vs Element Changes
1. Change speed to 0.25x
2. Find page action that changes audio src (same element)
3. Find page action that creates new audio element
4. **Expected**: Both trigger reset to 1.0x

## Test Scenario 3: Integration with Existing Features (Updated)

### Initialization Behavior (New)
1. Load page fresh
2. Navigate to any lesson with audio
3. **Expected**: Controls show 1.0x highlighted initially (not 0.6x)

### Keyboard Shortcuts
1. Use [ or ] keys to change speed
2. Trigger audio src change
3. **Expected**: Auto-reset works same as button clicks

### Multiple Audio Elements  
1. Change speed on first audio
2. Navigate to lesson with different audio src
3. **Expected**: Reset occurs immediately when src changes

### Original Functionality Preserved
1. Test all existing speed controls work normally
2. Test keyboard shortcuts [ and ] work normally  
3. Test visual feedback (button highlighting) works normally
4. **Expected**: All original features function identically

## Test Scenario 4: Clarified Behavior Validation

### Reset Trigger Independence (From Clarifications)
1. Start fresh session (no speed changes made yet)
2. Navigate between different audio exercises
3. **Expected**: Reset to 1.0x occurs on every src change regardless of whether user changed speed

### Speed Change Memory (From Clarifications)  
1. Change speed to 0.25x
2. Change speed to 0.6x (final user selection)
3. Trigger audio src change
4. **Expected**: Resets to 1.0x, not 0.6x (clarification confirms always 1.0x)

## Manual Testing Checklist (Updated)

- [ ] Initial speed is 1.0x on page load
- [ ] Basic reset functionality works on audio src changes
- [ ] Reset occurs on EVERY audio src change (not conditional)
- [ ] Reset always targets 1.0x (not user's final selection)
- [ ] Page refresh starts with 1.0x speed
- [ ] Multiple rapid src changes each trigger reset
- [ ] Keyboard shortcuts trigger same behavior as buttons
- [ ] Reset works for both src changes and new audio elements
- [ ] All existing functionality preserved
- [ ] Visual feedback works correctly after reset

## Debugging (Updated)
If tests fail, check browser console for:
- "Audio đã tìm thấy, đang thiết lập controls" messages
- Current speed logging: "Tốc độ mới: Xx"  
- Audio src change detection logging
- Reset trigger and execution logging
- JavaScript errors that might prevent reset execution

## Success Criteria (Clarified)
All manual test scenarios pass with clarified behavior:
- Reset happens on every audio src change
- Reset always goes to 1.0x speed  
- Page loads start with 1.0x speed
- Rapid src changes each trigger individual resets
- Original functionality remains intact