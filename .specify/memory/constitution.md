# Daily Dictation Enhance Constitution

<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.1 (template compatibility clarification)
- Modified sections: None (content unchanged)
- Added clarifications: Template compatibility note for userscript projects
- Templates requiring updates: ⚠ All templates incompatible with userscript architecture
  - .specify/templates/plan-template.md: Assumes multi-file project structure
  - .specify/templates/spec-template.md: Designed for complex feature specs
  - .specify/templates/tasks-template.md: Assumes TDD workflow with test files
- Follow-up TODOs: Templates need userscript-specific variants or project type detection
-->

## Core Principles

### I. Single-File Simplicity
All functionality MUST remain within `script.js` as a self-contained userscript. No build tools, external dependencies, or multiple files permitted. The entire enhancement must be deliverable as a single JavaScript file compatible with Tampermonkey/Greasemonkey.

**Rationale**: Userscripts are designed for simplicity and easy distribution. Adding complexity defeats the purpose and creates barriers for users who just want to install and use the enhancement.

### II. Defensive DOM Interaction
All DOM manipulation MUST be defensive and non-destructive to the target website. Use MutationObserver for dynamic content detection, check for element existence before manipulation, and gracefully handle missing or changed elements without breaking the target site.

**Rationale**: The script runs on someone else's website and must not interfere with the site's core functionality. DailyDictation.com could change at any time, and our script must be resilient.

### III. Progressive Enhancement
The script MUST enhance existing functionality without replacing or breaking original audio controls. If the script fails or is disabled, the original website must remain fully functional. All enhancements should be additive only.

**Rationale**: Users should never be left worse off than before installing the script. The original site functionality is the baseline that must always work.

### IV. Minimal Performance Impact
DOM operations must be efficient and minimal. Use event delegation where possible, avoid polling, and limit console logging in production. The script should have negligible impact on page load time and user experience.

**Rationale**: Userscripts run on every page load and poor performance reflects badly on the enhancement. Users will uninstall slow scripts.

### V. Clear User Feedback
All user interactions must provide immediate visual feedback. Speed changes should update button states, keyboard shortcuts should show current speed, and errors should be logged to console for debugging.

**Rationale**: Users need to understand what's happening when they interact with the controls. Immediate feedback builds confidence in the tool's reliability.

## Browser Compatibility

The script MUST work in modern browsers (Chrome, Firefox, Safari, Edge) with Tampermonkey or equivalent userscript managers. Use ES6+ features that have broad support but avoid bleeding-edge JavaScript features that might not be universally supported.

Testing should be performed in at least Chrome with Tampermonkey before any version releases.

## Governance

All changes must maintain compatibility with the target website (https://dailydictation.com). Constitution compliance is verified through manual testing on the target site.

Version increments follow userscript conventions:
- MAJOR: Breaking changes to user interface or functionality
- MINOR: New features or significant enhancements  
- PATCH: Bug fixes and minor improvements

**Template Compatibility**: The existing `.specify/templates/` are designed for complex multi-file projects and are **incompatible** with single-file userscript architecture. Future template usage would require userscript-specific variants that align with the Single-File Simplicity principle.

**Version**: 1.0.1 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25