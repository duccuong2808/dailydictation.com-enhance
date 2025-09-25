# Suggested Commands

## Development Commands
Since this is a userscript project with no build system, there are no specific build, test, or lint commands. Development is done by:

1. **Editing the script**: Modify `script.js` directly
2. **Testing**: Install the script in Tampermonkey and visit https://dailydictation.com
3. **Debugging**: Use browser developer tools console to see console.log outputs

## System Commands (macOS)
- `ls -la`: List all files including hidden ones
- `cat script.js`: View the userscript content
- `open .`: Open current directory in Finder
- `code .`: Open project in VS Code (if available)

## Installation Process
1. Install Tampermonkey browser extension
2. Create new userscript in Tampermonkey dashboard
3. Copy contents of `script.js` into the userscript editor
4. Save and enable the script
5. Visit https://dailydictation.com to test functionality

## No Build Process
This project has no package.json, no dependencies, and no build tools. It's a simple userscript that runs directly in the browser.