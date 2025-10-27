# DailyDictation WXT Extension - Design Document

**Date:** 2025-10-27
**Status:** Approved
**Author:** Design Session with User

## Overview

Migration của DailyDictation.com userscript từ Tampermonkey sang Chrome Extension chính thức sử dụng WXT framework với TypeScript. Extension sẽ publish lên Chrome Web Store và Firefox Add-ons.

## Requirements

### Functional Requirements
- Giữ nguyên tất cả tính năng hiện tại:
  - Speed control buttons (0.25x, 0.5x, 0.6x, 1.0x)
  - Keyboard shortcuts (Alt giảm, Shift tăng tốc độ)
  - Visual feedback (highlight button active)
  - Auto reset về 1.0x khi audio src thay đổi
- Hỗ trợ DailyDictation.com dynamic content loading

### Non-Functional Requirements
- Hỗ trợ Chrome và Firefox
- TypeScript cho type safety
- Modular architecture để dễ maintain
- Chuẩn bị publish lên stores
- Development experience tốt với hot reload

### Constraints
- Không thêm tính năng mới (popup, settings) trong phase này
- Phải backward compatible về behavior với userscript hiện tại
- Không yêu cầu permissions đặc biệt

## Architectural Approach

**Selected: Modular Content Script Architecture**

### Rationale
- Cân bằng giữa đơn giản và maintainability
- Tận dụng TypeScript type system hiệu quả
- Dễ mở rộng trong tương lai
- Clear separation of concerns

### Alternatives Considered
1. **Single File Content Script**: Quá monolithic, khó maintain
2. **Modular + WXT Storage**: Over-engineering cho requirements hiện tại

## Project Structure

```
dailydictation-extension/
├── entrypoints/
│   ├── content.ts              # Entry point, MutationObserver setup
│   └── content.css             # Styles cho controls
├── components/
│   ├── audio-controller.ts     # Audio playback speed management
│   ├── ui-builder.ts           # UI creation & updates
│   └── keyboard-handler.ts     # Keyboard shortcut handling
├── types/
│   └── index.ts                # TypeScript interfaces & types
├── utils/
│   └── constants.ts            # Speed presets, config values
├── wxt.config.ts               # WXT configuration
├── package.json
├── tsconfig.json
└── bun.lockb
```

## Component Design

### 1. AudioController (`components/audio-controller.ts`)

**Responsibility:** Single source of truth cho audio playback speed state

**Interface:**
```typescript
class AudioController {
  private audio: HTMLAudioElement;
  private currentSpeedIndex: number;
  private speeds: number[];

  constructor(audioElement: HTMLAudioElement)
  setSpeed(index: number): void
  increaseSpeed(): void
  decreaseSpeed(): void
  getCurrentSpeed(): number
  getCurrentSpeedIndex(): number
  resetSpeed(): void
}
```

**Key Behaviors:**
- Quản lý `audio.playbackRate` property
- Emit events khi speed thay đổi để UI update
- Lắng nghe 'loadedmetadata' event để auto reset
- Circular navigation (tăng từ 1.0x quay về 0.25x)

### 2. UIBuilder (`components/ui-builder.ts`)

**Responsibility:** Create và update DOM elements cho speed controls

**Interface:**
```typescript
class UIBuilder {
  createSpeedControls(audio: HTMLAudioElement): HTMLElement
  createSpeedButton(speed: number, isActive: boolean): HTMLButtonElement
  createSpeedDisplay(currentSpeed: number): HTMLElement
  updateDisplay(display: HTMLElement, speed: number): void
  updateActiveButton(container: HTMLElement, activeIndex: number): void
}
```

**Key Behaviors:**
- Tạo container với buttons + display
- Insert vào DOM (audio.parentNode.appendChild)
- Attach event listeners cho buttons
- Update visual state khi speed thay đổi
- Scoped CSS classes để tránh conflicts

### 3. KeyboardHandler (`components/keyboard-handler.ts`)

**Responsibility:** Handle keyboard shortcuts

**Interface:**
```typescript
class KeyboardHandler {
  private controller: AudioController;

  constructor(controller: AudioController)
  init(): void
  handleKeyDown(event: KeyboardEvent): void
  destroy(): void
}
```

**Key Behaviors:**
- Listen document keydown events
- Alt key → decreaseSpeed()
- Shift key → increaseSpeed()
- Prevent default nếu cần
- Cleanup listeners khi destroy

### 4. Entry Point (`entrypoints/content.ts`)

**Responsibility:** Initialize extension, setup MutationObserver

**Flow:**
```typescript
export default defineContentScript({
  matches: ['*://dailydictation.com/*'],
  runAt: 'document_idle',
  main() {
    // Setup MutationObserver
    // Detect audio elements added to DOM
    // Initialize AudioController + UIBuilder + KeyboardHandler
    // Handle cleanup on page unload
  }
});
```

## Data Flow & Event Handling

### Initialization Flow
1. Content script loads khi DailyDictation.com opens
2. MutationObserver watches cho audio elements
3. Khi audio detected:
   - Create AudioController instance
   - Create UIBuilder instance với controller reference
   - Create KeyboardHandler instance với controller reference
   - UIBuilder renders controls vào DOM

### Event Flow

**Button Click:**
```
User click button
→ UIBuilder event handler
→ AudioController.setSpeed(index)
→ audio.playbackRate updated
→ Event emitted
→ UIBuilder.updateDisplay()
```

**Keyboard Shortcut:**
```
User press Alt/Shift
→ KeyboardHandler.handleKeyDown()
→ AudioController.increaseSpeed()/decreaseSpeed()
→ audio.playbackRate updated
→ Event emitted
→ UIBuilder.updateDisplay()
```

**Audio Source Change:**
```
Audio src changes
→ 'loadedmetadata' event fires
→ AudioController.resetSpeed()
→ audio.playbackRate = 1.0
→ currentSpeedIndex = 3
→ UIBuilder.updateDisplay()
```

### State Management
- **No global state**: Mỗi audio element có instance riêng
- **Encapsulation**: State chỉ trong AudioController
- **Derived UI**: UI là function của AudioController state
- **Event-driven**: Components communicate qua events, không direct coupling

## WXT Configuration

### Manifest Config (`wxt.config.ts`)
```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'DailyDictation Speed Control',
    description: 'Add playback speed controls to DailyDictation.com',
    version: '2.0.0',
    permissions: [],
    host_permissions: [
      '*://dailydictation.com/*',
      '*://*.dailydictation.com/*'
    ]
  }
});
```

### Content Script Config
```typescript
export default defineContentScript({
  matches: ['*://dailydictation.com/*', '*://*.dailydictation.com/*'],
  runAt: 'document_idle',  // Wait for DOM ready
  main() { /* ... */ }
});
```

### Cross-Browser Support
- WXT auto-handles Chrome MV3 vs Firefox MV2 differences
- Build outputs:
  - `.output/chrome-mv3/` - Chrome/Edge package
  - `.output/firefox-mv2/` - Firefox package
- Single codebase, multiple targets

## TypeScript Configuration

### Compiler Options
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["@wxt-dev/module-react", "@types/chrome"]
  }
}
```

### Key Types
```typescript
// types/index.ts
interface SpeedConfig {
  speeds: number[];
  defaultIndex: number;
}

interface AudioControllerEvents {
  speedChange: (speed: number, index: number) => void;
}

type KeyboardShortcut = 'increase' | 'decrease';
```

## Styling Strategy

### Approach: Scoped Inline + CSS File

**Inline styles** cho critical positioning:
```typescript
// Ensures controls appear correctly regardless của site CSS
container.style.cssText = `
  display: flex;
  align-items: center;
  margin: 10px 0;
`;
```

**CSS file** (`entrypoints/content.css`) cho theming:
```css
/* Prefix với .dd- để avoid conflicts */
.dd-speed-btn {
  padding: 8px 12px;
  margin: 0 4px;
  border-radius: 4px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s;
}

.dd-speed-btn.active {
  background: #4CAF50;
  color: white;
}

.dd-speed-display {
  font-weight: bold;
  margin-left: 10px;
}
```

## Testing Strategy

### Development Testing
```bash
bun run dev  # Hot reload enabled
```
- Load unpacked extension trong Chrome/Firefox
- Navigate to dailydictation.com
- Test audio controls appearance
- Test buttons và keyboard shortcuts
- Test audio src changes và reset behavior

### Test Cases
1. **Audio Detection**: Controls xuất hiện khi audio loads
2. **Button Click**: Mỗi button set correct speed
3. **Keyboard Shortcuts**: Alt/Shift work correctly
4. **Visual Feedback**: Active button highlighted
5. **Speed Display**: Shows current speed accurately
6. **Auto Reset**: Speed resets về 1.0x khi change audio
7. **Multiple Audios**: Multiple audio elements không conflict
8. **Browser Compatibility**: Works trên Chrome và Firefox

### Production Build Testing
```bash
bun run build
```
- Test cả Chrome và Firefox builds
- Verify manifest.json generated correctly
- Check bundle size reasonable
- Test performance (no lag)

## Migration Strategy

### Phase 1: Setup (Day 1)
```bash
bunx create-wxt@latest
# Chọn TypeScript template
cd dailydictation-extension
bun install
```

### Phase 2: Structure (Day 1)
- Create folder structure (components, types, utils)
- Setup TypeScript configs
- Create type definitions

### Phase 3: Port Logic (Day 2-3)
- Di chuyển MutationObserver logic → content.ts
- Port speed control logic → AudioController
- Port UI creation → UIBuilder
- Port keyboard handling → KeyboardHandler
- Add TypeScript types throughout

### Phase 4: Testing (Day 3-4)
- Manual testing với `bun run dev`
- Fix bugs discovered
- Test trên multiple pages của dailydictation.com
- Cross-browser testing

### Phase 5: Polish (Day 4-5)
- Optimize performance
- Clean up console.logs cho production
- Update comments và documentation
- Add error handling

### Phase 6: Build & Package (Day 5)
```bash
bun run build
# Creates .output/chrome-mv3/ và .output/firefox-mv2/
```
- Create ZIP files
- Test final builds
- Prepare store listings

## Version Control Strategy

### Repository Structure
```
dailydictation.com-enhance/  (existing repo)
├── script.js                (keep for backward compatibility)
├── README.md                (update với WXT instructions)
└── wxt-extension/           (new WXT project)
    └── [WXT files]
```

**Alternative:** Migration branch
```bash
git checkout -b wxt-migration
# Do all WXT work in branch
# Merge to main when ready
```

### Commit Strategy
- Commit design document first
- Small, logical commits during development
- Clear commit messages (Vietnamese OK)
- Tag releases: `v2.0.0-chrome`, `v2.0.0-firefox`

## Success Criteria

### Must Have
- ✅ All existing features work identically
- ✅ Works on Chrome and Firefox
- ✅ No console errors
- ✅ Passes manual test cases
- ✅ Ready to submit to stores

### Nice to Have
- TypeScript coverage > 95%
- Bundle size < 50KB
- No performance regression vs userscript
- Clean, maintainable code

## Future Considerations

### Phase 2 Enhancements (Not in scope now)
- Settings page cho custom speed presets
- Popup UI để control từ toolbar
- WXT storage để persist preferences
- Additional keyboard shortcuts
- Dark mode support
- Analytics (privacy-respecting)

### Extensibility Points
- AudioController có thể extend cho advanced features
- UIBuilder có thể swap cho custom themes
- Constants file dễ config cho variations
- Type system supports future additions

## Risk Mitigation

### Risks & Mitigations

**Risk:** WXT có breaking changes
- **Mitigation:** Pin versions trong package.json

**Risk:** Store rejection do policy violations
- **Mitigation:** Follow Web Store policies, minimal permissions

**Risk:** DailyDictation.com changes DOM structure
- **Mitigation:** Robust selectors, graceful degradation

**Risk:** Performance issues với MutationObserver
- **Mitigation:** Throttle/debounce observer callbacks

**Risk:** Browser compatibility issues
- **Mitigation:** Test extensively, use WXT's cross-browser APIs

## Build & Deployment

### Development Commands
```bash
bun install          # Install dependencies
bun run dev          # Development mode với hot reload
bun run build        # Build production cho all browsers
bun run build:firefox # Build Firefox only
```

### Build Output
```
.output/
├── chrome-mv3/      # Chrome/Edge package
│   ├── manifest.json
│   └── [bundled files]
└── firefox-mv2/     # Firefox package
    ├── manifest.json
    └── [bundled files]
```

### Store Submission
1. **Chrome Web Store:**
   - ZIP `.output/chrome-mv3/`
   - Submit tại developer dashboard
   - Complete store listing (screenshots, description)

2. **Firefox Add-ons:**
   - ZIP `.output/firefox-mv2/`
   - Submit tại addons.mozilla.org
   - Wait for review (có thể cần source code)

## Appendix

### Dependencies
```json
{
  "devDependencies": {
    "wxt": "latest",
    "@types/chrome": "latest",
    "typescript": "latest"
  }
}
```

### Reference Links
- [WXT Documentation](https://wxt.dev)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Web Store Publish Guide](https://developer.chrome.com/docs/webstore/publish/)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-27
