# Tasks: Standardized Button Sizes

**Input**: Design documents from `/specs/002-the-added-buttons/`
**Prerequisites**: plan.md (required), research.md, data-model.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → SUCCESS: Implementation plan loaded - Single userscript styling
   → Extract: JavaScript ES6+, single file, inline CSS approach
2. Load optional design documents:
   → data-model.md: UI elements and CSS properties identified
   → contracts/: N/A - internal styling only
   → research.md: Button sizing decisions and approach loaded
3. Generate tasks by category:
   → Setup: N/A - no project init needed
   → Tests: Manual testing scenarios
   → Core: CSS styling implementation
   → Integration: N/A - no external integrations
   → Polish: Manual verification and cleanup
4. Apply task rules:
   → Single file = sequential tasks (no [P])
   → Manual testing → implementation → verification
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create execution examples
8. Validate task completeness:
   → All styling requirements covered?
   → Manual testing scenarios included?
   → Rollback plan considered?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] Description`
- Single file userscript - no parallel execution possible
- All tasks modify `script.js` or involve manual testing

## Path Conventions
- **Single file**: All changes in `script.js` at repository root
- **Manual testing**: On https://dailydictation.com with Tampermonkey

## Phase 3.1: Analysis & Preparation
- [x] T001 Analyze current button creation code in setupControls() function in script.js to identify exact styling inconsistencies
- [x] T002 Document current CSS properties applied to speed buttons and identify which ones cause size variations

## Phase 3.2: Implementation
- [x] T003 Apply standardized button dimensions (width: 50px, height: 32px) to all speed control buttons in script.js
- [x] T004 Add box-sizing: border-box and remove padding from button styling to ensure consistent dimensions
- [x] T005 Implement text centering (text-align: center, line-height: 32px) for all speed buttons in script.js
- [x] T006 Verify visual feedback states (hover, active, selected) work consistently with new standardized dimensions

## Phase 3.3: Testing & Verification  
- [x] T007 Perform manual testing on https://dailydictation.com following quickstart.md verification steps
- [x] T008 Test button functionality preservation - verify all click events and keyboard shortcuts still work correctly
- [x] T009 Test visual consistency across browsers (Chrome, Firefox, Edge) if available
- [x] T010 Verify no console errors or JavaScript warnings after styling changes

## Phase 3.4: Polish & Cleanup
- [x] T011 Remove any debugging console.log statements related to button sizing (if added during development)
- [x] T012 Update userscript version number in header comment if changes are significant
- [x] T013 Document any issues found during testing and ensure rollback plan is validated

## Dependencies
- T001, T002 must complete before T003-T006 (analysis before implementation)
- T003-T006 must complete before T007-T010 (implementation before testing)
- T007-T010 must complete before T011-T013 (testing before polish)

## Execution Example
```
# Sequential execution required (single file):
1. First complete analysis tasks:
   Task: "Analyze current button creation code in setupControls() function"
   
2. Then implement styling changes:
   Task: "Apply standardized button dimensions (width: 50px, height: 32px)"
   
3. Finally verify and test:
   Task: "Perform manual testing on https://dailydictation.com"
```

## Notes
- All tasks modify same file (script.js) - no parallel execution
- Manual testing required - no automated tests for userscripts
- Changes are additive styling only - low risk
- Constitutional compliance verified in planning phase

## Task Generation Rules
*Applied during main() execution*

1. **From Research**:
   - Button sizing approach → implementation tasks
   - CSS properties decisions → specific styling tasks
   
2. **From Data Model**:
   - UI elements identified → styling standardization tasks
   - Visual feedback requirements → consistency verification tasks
   
3. **From Quickstart**:
   - Manual testing scenarios → verification tasks
   - Troubleshooting steps → rollback planning

4. **Ordering**:
   - Analysis → Implementation → Testing → Polish
   - Single file architecture prevents parallelization

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All styling requirements from research.md covered
- [x] All UI elements from data-model.md addressed  
- [x] All manual testing scenarios from quickstart.md included
- [x] Tasks respect single-file architecture constraints
- [x] Each task specifies exact file or testing approach
- [x] No parallel tasks (single file modification)
- [x] Constitutional compliance maintained throughout

## Implementation Notes

### Critical CSS Properties to Apply
```javascript
// In setupControls() function button creation loop:
button.style.width = "50px";
button.style.height = "32px"; 
button.style.boxSizing = "border-box";
button.style.textAlign = "center";
button.style.lineHeight = "32px";
button.style.padding = "0";  // Remove variable padding
```

### Success Criteria
- All 4 speed buttons (0.25x, 0.5x, 0.6x, 1.0x) have identical visual dimensions
- Text remains centered in all buttons
- All existing functionality preserved (click events, keyboard shortcuts)
- Visual feedback states (selected, hover) work consistently
- No console errors or warnings

### Rollback Strategy
If any task fails or causes issues:
1. Revert script.js to previous working version
2. Test original functionality is restored
3. Re-analyze approach if needed
4. Document lessons learned in task notes