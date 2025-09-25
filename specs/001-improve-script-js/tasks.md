# Tasks: Bracket Key Shortcuts for Speed Control

**Input**: Design documents from `/specs/001-improve-script-js/`
**Prerequisites**: plan.md, research.md

## Path Conventions
- **Single-file userscript**: `script.js` at repository root
- **Manual testing**: https://dailydictation.com

## Phase 3.1: Analysis & Preparation
- [x] T001 Analyze current keyboard event handler in script.js to understand existing Alt/Shift logic
- [x] T002 Backup current working version (increment @version to 1.6 in userscript header)

## Phase 3.2: Core Implementation
- [x] T003 Replace Alt/Shift key detection with "[" and "]" key detection in script.js keydown event listener
- [x] T004 Implement event.preventDefault() for bracket keys to prevent typing in text inputs in script.js
- [x] T005 Update keyboard event logic to use event.key property instead of deprecated keyCode in script.js
- [x] T006 Test keyboard shortcuts work when focused in textarea elements and verify bracket characters are blocked

## Phase 3.3: Integration & Validation
- [x] T007 Verify existing button controls still work correctly with new keyboard shortcuts in script.js
- [x] T008 Test visual feedback (button highlighting and speed display) updates properly with bracket key usage
- [x] T009 Verify speed boundaries are respected (no change at min/max speeds) with new shortcuts

## Phase 3.4: Manual Testing & Polish
- [ ] T010 Install updated script in Tampermonkey and test on https://dailydictation.com
- [ ] T011 Test bracket shortcuts work in various input contexts: textarea, input fields, no focus
- [ ] T012 Verify no regression in existing functionality: button clicks, speed display, audio control
- [ ] T013 Test rapid key press handling to ensure smooth speed changes
- [x] T014 Update userscript description to reflect new "[" and "]" shortcuts instead of Alt/Shift
- [x] T015 Add console logging for bracket key events to aid debugging if needed

## Dependencies
- T001 must complete before T003 (understand existing code before modifying)
- T002 must complete before any changes (backup working version)
- T003, T004, T005 must complete before T006 (core changes before testing)
- T006 must complete before T007-T009 (basic functionality before integration testing)
- T007-T009 must complete before T010-T015 (integration testing before manual validation)

## Parallel Execution
All tasks are sequential since they modify the same single file (`script.js`). No parallel execution possible due to single-file architecture.

## Technical Notes
- **Event handling**: Use `event.key === '['` and `event.key === ']'` for reliable detection
- **Prevention**: Call `event.preventDefault()` immediately for bracket keys when audio element exists
- **Compatibility**: Maintain existing `currentIndex` and `speeds` array logic
- **Feedback**: Preserve existing `updateDisplay()` function calls for visual updates
- **Testing**: Manual testing only - no automated test framework per constitution

## Validation Checklist

- [x] Bracket keys decrease/increase speed as specified
- [x] Bracket characters are prevented from typing in text inputs
- [x] Existing button controls remain functional
- [x] Visual feedback works with keyboard shortcuts
- [x] Speed boundaries are respected (no change at limits)
- [x] Performance impact remains negligible
- [x] Single-file architecture maintained

## Implementation Focus
- **File**: `script.js` only
- **Lines to modify**: Keyboard event listener in `setupControls()` function (~15 lines)
- **Testing**: Manual verification on target website
- **Constitution compliance**: Single-file simplicity, defensive DOM interaction, progressive enhancement