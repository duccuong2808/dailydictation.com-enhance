# Implementation Plan: Bracket Key Shortcuts for Speed Control

**Branch**: `001-improve-script-js` | **Date**: 2025-09-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-improve-script-js/spec.md`

## Summary
Replace Alt/Shift keyboard shortcuts with "[" and "]" keys for audio speed control, ensuring the shortcuts work even when focused in text input elements and prevent bracket characters from being typed.

## Technical Context
**Language/Version**: JavaScript ES6+ (Userscript)  
**Primary Dependencies**: None (Tampermonkey/Greasemonkey only)  
**Storage**: In-memory state only  
**Testing**: Manual testing on https://dailydictation.com  
**Target Platform**: Modern browsers with userscript managers  
**Project Type**: Single-file userscript  
**Performance Goals**: Negligible performance impact, responsive key handling  
**Constraints**: Must not interfere with website functionality, single-file only  
**Scale/Scope**: Single user per browser, lightweight DOM manipulation

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Single-File Simplicity**: All changes remain within script.js
- ✅ **Defensive DOM Interaction**: Existing MutationObserver pattern maintained
- ✅ **Progressive Enhancement**: Existing functionality preserved, shortcuts only enhanced
- ✅ **Minimal Performance Impact**: Keyboard event handling is lightweight
- ✅ **Clear User Feedback**: Visual feedback via existing speed display system

## Project Structure

### Documentation (this feature)
```
specs/001-improve-script-js/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command)
```

### Source Code (repository root)
```
script.js                # Single userscript file (all changes here)
```

**Structure Decision**: Single-file userscript architecture (Constitution requirement)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context**:
   - Keyboard event handling patterns for userscripts
   - Event.preventDefault() behavior in text input contexts
   - Cross-browser compatibility for bracket key detection

2. **Research tasks**:
   - Best practices for global keyboard shortcuts in userscripts
   - Methods to prevent default typing behavior in text fields
   - Event handling patterns that work across different input elements

3. **Consolidate findings** in `research.md`

**Output**: research.md with keyboard event handling approach

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **No data entities** - this is a pure UI enhancement
2. **No API contracts** - direct DOM manipulation only
3. **No separate tests** - manual testing approach per constitution
4. **User interaction flow**:
   - User presses "[" → speed decreases, character blocked
   - User presses "]" → speed increases, character blocked
   - Visual feedback via existing button highlighting

**Output**: Simplified design approach documentation

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Replace existing keyboard event listener (Alt/Shift → bracket keys)
- Implement event.preventDefault() for bracket keys
- Test keyboard handling in various input contexts
- Verify compatibility with existing button controls
- Manual testing on target website

**Ordering Strategy**:
1. Modify keyboard event detection logic
2. Add event.preventDefault() for bracket keys  
3. Test in text input scenarios
4. Verify visual feedback still works
5. Manual testing and validation

**Estimated Output**: 5-6 sequential tasks in tasks.md

## Complexity Tracking
*No constitution violations - single-file approach maintained*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.1 - See `/.specify/memory/constitution.md`*