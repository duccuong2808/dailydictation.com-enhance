# Code Style and Conventions

## JavaScript Style
- Uses ES6+ features (const, let, arrow functions)
- Strict mode enabled with "use strict"
- Console logging for debugging and status updates
- Vietnamese comments mixed with English variable names

## Naming Conventions
- camelCase for variables and functions (currentIndex, setupControls, updateDisplay)
- Descriptive function names that indicate their purpose
- DOM elements stored in variables with clear names (audio, speedDisplay, buttonsContainer)

## Code Organization
- IIFE (Immediately Invoked Function Expression) pattern for userscript
- Clear separation of concerns:
  - Configuration constants at top
  - State variables
  - Helper functions
  - Event setup and initialization

## Userscript Headers
- Standard Tampermonkey metadata block with @name, @version, @description, @match
- Version tracking for updates
- Proper namespace and author attribution