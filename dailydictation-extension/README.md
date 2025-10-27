# DailyDictation Speed Control

Chrome/Firefox extension that adds playback speed controls to DailyDictation.com audio players.

## Features

- 🎚️ Quick speed controls (0.25x, 0.5x, 0.6x, 1.0x)
- ⌨️ Keyboard shortcuts (`[` to decrease, `]` to increase)
- 🔄 Auto-reset to 1.0x when changing audio
- 🎨 Clean, non-intrusive UI
- 🌐 Works on all DailyDictation.com pages

## Installation

### Chrome/Edge
1. Download `dailydictation-speed-control-2.0.0-chrome.zip`
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the unzipped extension folder

### Firefox
1. Download `dailydictation-speed-control-2.0.0-firefox.zip`
2. Go to `about:addons`
3. Click gear icon → "Install Add-on From File"
4. Select the `.zip` file

## Usage

1. Navigate to any DailyDictation.com page with audio
2. Speed controls appear automatically below the audio player
3. Click buttons to change speed, or use keyboard shortcuts:
   - Press `[` to decrease speed
   - Press `]` to increase speed
4. Speed resets to 1.0x when you navigate to a different lesson

## Development

Built with:
- [WXT](https://wxt.dev) - Extension framework
- TypeScript
- Bun

### Setup
```bash
bun install
```

### Development
```bash
bun run dev
```

### Build
```bash
bun run build
```

## License

MIT

## Credits

Migrated from Tampermonkey userscript to proper browser extension.
