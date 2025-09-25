# Tasks: Auto Reset Playback Speed After Next Audio (Updated with Clarifications)

**Input**: Design documents from `/specs/003-after-next-audio/`
**Prerequisites**: plan.md (required), research.md, data-model.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Found: Single-file userscript project, JavaScript ES6+, vanilla JS
   → Structure: All functionality in script.js (no build tools)
   → Clarifications: All resolved via session 2025-09-26
2. Load optional design documents: ✓
   → data-model.md: Updated state variables with clarified behavior
   → research.md: Technical decisions incorporating clarifications  
   → quickstart.md: Updated test scenarios reflecting clarified requirements
3. Generate tasks by category: ✓
   → Setup: Code analysis and state modification
   → Core: Audio src monitoring and reset logic with clarifications
   → Integration: Enhanced audio detection system
   → Polish: Manual testing with clarified scenarios
4. Apply task rules: ✓
   → Single file = sequential tasks (no [P] markers)
   → Tests are manual (no separate test files)
   → Updated behavior per clarifications
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Validate task completeness ✓
8. Return: SUCCESS (tasks ready for execution with clarifications) ✓
```

## Format: `[ID] Description`
- All tasks work on single file: `script.js`
- Manual testing only (userscript architecture)
- Updated requirements from clarifications session 2025-09-26

## Path Conventions
- **Single userscript**: All code in `script.js` at repository root
- **Testing**: Manual testing on https://dailydictation.com

## Phase 3.1: Setup & Analysis (Updated)
- [x] T001 Analyze current speed control implementation and identify changes needed for clarified requirements
- [x] T002 Identify integration points for audio src monitoring (clarification: trigger on src changes, not DOM changes)
- [x] T003 Update initialization to start with 1.0x speed (currentIndex = 3, not 2) per clarifications

## Phase 3.2: Audio Source Monitoring Implementation (New - From Clarifications)
- [x] T004 Add currentAudioSrc state variable to track audio src changes
- [x] T005 Implement audio src change detection using MutationObserver with attributes monitoring  
- [x] T006 Create setupAudioSrcMonitoring() function to observe src attribute changes
- [x] T007 Integrate src change detection with existing audio element discovery

## Phase 3.3: Reset Logic Implementation (Updated)
- [x] T008 Update activateResetTrigger() function (still needed for user interaction tracking)
- [x] T009 Implement executeReset() function to reset to 1.0x speed (DEFAULT_SPEED_INDEX = 3)
- [x] T010 Modify all speed change handlers to activate reset trigger as before
- [x] T011 Add automatic reset execution on every audio src change (per clarifications)

## Phase 3.4: Integration with Existing System (Updated)  
- [x] T012 Ensure setupControls() works with updated initialization (1.0x start)
- [x] T013 Verify updateDisplay() function works correctly with reset to 1.0x
- [x] T014 Add console logging for audio src changes and reset execution
- [x] T015 Test integration ensuring both new elements AND src changes trigger resets

## Phase 3.5: Manual Testing & Validation (Updated with Clarified Scenarios)
- [x] T016 Execute Test Scenario 1: Basic reset on audio src change (from quickstart.md)
- [x] T017 Execute Test Scenario 2: Multiple rapid src changes (each triggers reset per clarifications) 
- [x] T018 Execute Test Scenario 3: Page refresh behavior (starts with 1.0x per clarifications)
- [x] T019 Execute Test Scenario 4: Multiple speed changes before src change (resets to 1.0x, not final user speed)
- [x] T020 Verify all original functionality preserved with updated initialization

## Dependencies (Updated)
- T001-T002 (analysis) before T003 (initialization update)
- T003 (initialization) before T004-T007 (src monitoring)
- T004-T007 (src monitoring) before T008-T011 (reset logic)
- T008-T011 (reset logic) before T012-T015 (integration)
- T012-T015 (integration) before T016-T020 (testing)

## Sequential Execution (Single File)
All tasks modify `script.js` sequentially. No parallel execution possible due to single-file architecture.

## Task Generation Rules Applied (Updated)
1. **From Data Model (Updated)**: 
   - Initialization change: currentIndex = 3 → T003
   - Audio src tracking: currentAudioSrc variable → T004
   - State transitions with clarified behavior → T008-T011
   
2. **From Research (Updated)**: 
   - Audio src monitoring instead of DOM mutations → T005-T007
   - Always reset to 1.0x per clarifications → T009, T011
   - Every src change triggers reset → T011, T017
   
3. **From Quickstart (Updated)**: 
   - Basic functionality with src changes → T016
   - Multiple rapid changes behavior → T017  
   - Page refresh starting with 1.0x → T018
   - Speed change behavior clarification → T019

4. **Ordering (Updated)**:
   - Analysis → Initialization Update → Src Monitoring → Reset Logic → Integration → Testing
   - Each phase blocks the next, incorporating clarified requirements

## Clarified Requirements Integration
Based on session 2025-09-26, tasks incorporate:

1. **Next Audio Trigger**: Audio src changes (T005-T007, T011)
2. **Default Speed**: Always 1.0x (T003, T009)  
3. **Multiple Changes**: Reset on every change (T011, T017)
4. **Page Refresh**: Start with 1.0x (T003, T018)
5. **Speed Behavior**: Reset to 1.0x regardless of user final selection (T019)

## Validation Checklist (Updated)
- [x] All clarified requirements have implementation tasks
- [x] Audio src monitoring replaces DOM element detection for triggers
- [x] Initialization updated to start with 1.0x speed
- [x] Reset behavior accounts for "every src change" requirement
- [x] Test scenarios reflect clarified behavior patterns
- [x] Sequential execution respects single-file constraint
- [x] Each task specifies exact function or integration target
- [x] No conflicts with constitutional single-file requirement

## Notes (Updated)
- Clarifications resolved all ambiguous behavior from original spec
- Audio src monitoring is more precise than DOM element detection
- Page refresh behavior explicitly defined (start with 1.0x)
- Reset occurs on every src change, not conditionally
- Manual testing covers all clarified edge cases
- Version increment in userscript header after completion

## Expected Outcome (Updated)
After completing all tasks with clarifications, users will experience:
1. Initial speed of 1.0x when loading any page with audio
2. Automatic reset to 1.0x on every audio src change 
3. Reset behavior that ignores user's final speed selection
4. Consistent behavior across page refreshes and rapid navigation
5. All existing functionality preserved with updated initialization