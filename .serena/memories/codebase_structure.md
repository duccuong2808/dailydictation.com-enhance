# Codebase Structure

## File Organization
```
daily-dictation-enhance/
├── script.js          # Main userscript file
└── .serena/          # Serena configuration (development tool)
    ├── project.yml
    ├── .gitignore
    └── memories/
```

## Main Components in script.js
- **Speed Configuration**: Array of speed values [0.25, 0.5, 0.6, 1.0]
- **DOM Setup**: MutationObserver to detect audio elements
- **UI Creation**: Dynamic button and display element creation
- **Event Handling**: Keyboard shortcuts and button click handlers
- **Speed Control**: Playback rate manipulation functionality

## Key Functions
- `setupControls()`: Main setup function that creates UI elements
- `updateDisplay()`: Updates button highlighting and applies speed changes
- MutationObserver: Watches for audio element insertion into DOM