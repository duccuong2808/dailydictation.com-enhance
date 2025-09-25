# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a userscript that enhances DailyDictation.com by adding playback speed controls to audio elements. The script provides speed control buttons (0.25x, 0.5x, 0.6x, 1.0x) and keyboard shortcuts (Alt to decrease, Shift to increase) with visual feedback.

## Architecture

**Single File Structure**: The entire functionality is contained in `script.js` - a Tampermonkey userscript with no build system or dependencies.

**Key Components**:
- **MutationObserver**: Watches for audio element insertion into DOM
- **Dynamic UI Creation**: Creates speed control buttons and display elements
- **Event System**: Handles both keyboard shortcuts and button clicks
- **Speed Management**: Controls HTML5 audio playback rate

## Development Workflow

**No Build Commands**: This project has no package.json, build tools, or dependencies. Development involves:
1. Edit `script.js` directly
2. Test by installing in Tampermonkey and visiting https://dailydictation.com
3. Debug using browser console (script includes console.log statements)

**Testing**: Manual testing only - install script in Tampermonkey browser extension and verify functionality on target website.

**Version Updates**: Increment `@version` in userscript header for significant changes.

## Code Style

- Uses ES6+ features (const, let, arrow functions) within IIFE pattern
- camelCase naming for variables and functions
- Vietnamese comments mixed with English code
- Console logging for debugging and status tracking
- Descriptive function names (setupControls, updateDisplay)

## Key Implementation Details

**Audio Detection**: Uses MutationObserver to detect when audio elements are added to the page, as DailyDictation loads content dynamically.

**UI Placement**: Controls are inserted as new DOM elements below the audio player using `audio.parentNode.appendChild()`.

**State Management**: Simple index-based system tracking current speed from predefined array `[0.25, 0.5, 0.6, 1.0]`.

## Note
- Always answer and response by Vietnamese
