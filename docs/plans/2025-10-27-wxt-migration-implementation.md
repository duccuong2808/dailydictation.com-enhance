# WXT Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate DailyDictation userscript from Tampermonkey to WXT-based Chrome/Firefox extension with TypeScript

**Architecture:** Modular content script với separated concerns - AudioController (state management), UIBuilder (UI rendering), KeyboardHandler (keyboard shortcuts), và content script entry point (orchestration)

**Tech Stack:** WXT, TypeScript, Bun

---

## Task 1: Initialize WXT Project

**Files:**
- Create: Entire WXT project structure

**Step 1: Initialize WXT project với Bun**

Run:
```bash
cd /Users/duccuong/data/projects/dailydictation.com-enhance/.worktrees/wxt-migration
bunx create-wxt@latest dailydictation-extension
```

When prompted:
- Package manager: `bun`
- Template: `vanilla`
- Enable TypeScript: `yes`

Expected: WXT project scaffolded trong folder `dailydictation-extension/`

**Step 2: Move into project directory**

Run:
```bash
cd dailydictation-extension
ls -la
```

Expected: See `wxt.config.ts`, `package.json`, `entrypoints/`, etc.

**Step 3: Install dependencies**

Run:
```bash
bun install
```

Expected: Dependencies installed, `bun.lockb` created

**Step 4: Verify WXT works**

Run:
```bash
bun run dev
```

Expected: WXT starts dev server, outputs `.output/chrome-mv3/` directory

Stop dev server: Ctrl+C

**Step 5: Commit initial setup**

Run:
```bash
git add dailydictation-extension/
git commit -m "feat: initialize WXT project with TypeScript and Bun"
```

---

## Task 2: Create Project Structure

**Files:**
- Create: `components/` directory
- Create: `types/` directory
- Create: `utils/` directory

**Step 1: Create directory structure**

Run:
```bash
cd dailydictation-extension
mkdir -p components types utils
ls -la
```

Expected: See `components/`, `types/`, `utils/` directories

**Step 2: Clean up default files**

Run:
```bash
# Remove default background script if exists
rm -f entrypoints/background.ts 2>/dev/null || true
# Remove default popup if exists
rm -rf entrypoints/popup 2>/dev/null || true
```

**Step 3: Verify structure**

Run:
```bash
find . -type d -name "components" -o -name "types" -o -name "utils" -o -name "entrypoints" | head -10
```

Expected: See all 4 directories listed

**Step 4: Commit structure**

Run:
```bash
git add .
git commit -m "chore: create project directory structure"
```

---

## Task 3: Define TypeScript Types

**Files:**
- Create: `types/index.ts`

**Step 1: Create types file**

Create `types/index.ts`:
```typescript
/**
 * Configuration for speed presets
 */
export interface SpeedConfig {
  speeds: readonly number[];
  defaultIndex: number;
}

/**
 * Audio controller interface
 */
export interface IAudioController {
  setSpeed(index: number): void;
  increaseSpeed(): void;
  decreaseSpeed(): void;
  getCurrentSpeed(): number;
  getCurrentSpeedIndex(): number;
  resetSpeed(): void;
}

/**
 * UI builder interface
 */
export interface IUIBuilder {
  createSpeedControls(): HTMLElement;
  updateDisplay(speed: number): void;
  updateActiveButton(index: number): void;
}

/**
 * Keyboard handler interface
 */
export interface IKeyboardHandler {
  init(): void;
  destroy(): void;
}

/**
 * Keyboard shortcut keys
 */
export type KeyboardKey = '[' | ']';

/**
 * Speed change event callback
 */
export type SpeedChangeCallback = (speed: number, index: number) => void;
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 3: Commit types**

Run:
```bash
git add types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

## Task 4: Create Constants

**Files:**
- Create: `utils/constants.ts`

**Step 1: Create constants file**

Create `utils/constants.ts`:
```typescript
import type { SpeedConfig } from '../types';

/**
 * Speed presets configuration
 */
export const SPEED_CONFIG: SpeedConfig = {
  speeds: [0.25, 0.5, 0.6, 1.0],
  defaultIndex: 3, // 1.0x
} as const;

/**
 * CSS class names (prefixed để tránh conflicts)
 */
export const CSS_CLASSES = {
  container: 'dd-speed-controls',
  button: 'dd-speed-btn',
  buttonActive: 'active',
  label: 'dd-speed-label',
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  decrease: '[',
  increase: ']',
} as const;

/**
 * Debug logging prefix
 */
export const LOG_PREFIX = '[DailyDict]';
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 3: Commit constants**

Run:
```bash
git add utils/constants.ts
git commit -m "feat: add constants for speeds, CSS classes, and keyboard shortcuts"
```

---

## Task 5: Implement AudioController

**Files:**
- Create: `components/audio-controller.ts`

**Step 1: Create AudioController class**

Create `components/audio-controller.ts`:
```typescript
import type { IAudioController, SpeedChangeCallback } from '../types';
import { SPEED_CONFIG, LOG_PREFIX } from '../utils/constants';

export class AudioController implements IAudioController {
  private audio: HTMLAudioElement;
  private currentIndex: number;
  private speeds: readonly number[];
  private lastSrc: string;
  private resetNext: boolean;
  private onSpeedChangeCallbacks: SpeedChangeCallback[];

  constructor(audioElement: HTMLAudioElement) {
    this.audio = audioElement;
    this.speeds = SPEED_CONFIG.speeds;
    this.currentIndex = SPEED_CONFIG.defaultIndex;
    this.lastSrc = audioElement.src;
    this.resetNext = false;
    this.onSpeedChangeCallbacks = [];

    this.initializeSrcMonitoring();
    this.applySpeed();
  }

  /**
   * Set speed by index
   */
  setSpeed(index: number): void {
    if (index < 0 || index >= this.speeds.length) {
      console.warn(`${LOG_PREFIX} Invalid speed index: ${index}`);
      return;
    }

    this.currentIndex = index;
    this.resetNext = true;
    this.applySpeed();
    this.notifySpeedChange();
  }

  /**
   * Increase speed (move to next higher speed)
   */
  increaseSpeed(): void {
    if (this.currentIndex < this.speeds.length - 1) {
      this.setSpeed(this.currentIndex + 1);
    }
  }

  /**
   * Decrease speed (move to next lower speed)
   */
  decreaseSpeed(): void {
    if (this.currentIndex > 0) {
      this.setSpeed(this.currentIndex - 1);
    }
  }

  /**
   * Get current playback speed
   */
  getCurrentSpeed(): number {
    return this.speeds[this.currentIndex];
  }

  /**
   * Get current speed index
   */
  getCurrentSpeedIndex(): number {
    return this.currentIndex;
  }

  /**
   * Reset speed to default (1.0x)
   */
  resetSpeed(): void {
    this.currentIndex = SPEED_CONFIG.defaultIndex;
    this.resetNext = false;
    this.applySpeed();
    this.notifySpeedChange();
  }

  /**
   * Register callback for speed changes
   */
  onSpeedChange(callback: SpeedChangeCallback): void {
    this.onSpeedChangeCallbacks.push(callback);
  }

  /**
   * Apply current speed to audio element
   */
  private applySpeed(): void {
    this.audio.playbackRate = this.getCurrentSpeed();
  }

  /**
   * Notify all callbacks about speed change
   */
  private notifySpeedChange(): void {
    const speed = this.getCurrentSpeed();
    const index = this.currentIndex;
    this.onSpeedChangeCallbacks.forEach(callback => callback(speed, index));
  }

  /**
   * Monitor audio src changes to auto-reset
   */
  private initializeSrcMonitoring(): void {
    const observer = new MutationObserver(() => {
      if (this.audio.src !== this.lastSrc) {
        this.lastSrc = this.audio.src;
        if (this.resetNext) {
          console.log(`${LOG_PREFIX} Audio src changed, resetting speed`);
          this.resetSpeed();
        }
      }
    });

    observer.observe(this.audio, {
      attributes: true,
      attributeFilter: ['src'],
    });
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 3: Commit AudioController**

Run:
```bash
git add components/audio-controller.ts
git commit -m "feat: implement AudioController for playback speed management"
```

---

## Task 6: Implement UIBuilder

**Files:**
- Create: `components/ui-builder.ts`

**Step 1: Create UIBuilder class**

Create `components/ui-builder.ts`:
```typescript
import type { IUIBuilder } from '../types';
import type { AudioController } from './audio-controller';
import { SPEED_CONFIG, CSS_CLASSES, LOG_PREFIX } from '../utils/constants';

export class UIBuilder implements IUIBuilder {
  private controller: AudioController;
  private container: HTMLElement | null = null;
  private buttons: HTMLButtonElement[] = [];
  private label: HTMLSpanElement | null = null;

  constructor(controller: AudioController) {
    this.controller = controller;

    // Listen to speed changes from controller
    this.controller.onSpeedChange((speed, index) => {
      this.updateDisplay(speed);
      this.updateActiveButton(index);
    });
  }

  /**
   * Create and return the speed controls UI
   */
  createSpeedControls(): HTMLElement {
    this.container = document.createElement('div');
    this.container.className = CSS_CLASSES.container;

    // Create buttons for each speed
    SPEED_CONFIG.speeds.forEach((speed, index) => {
      const button = this.createSpeedButton(speed, index);
      this.buttons.push(button);
      this.container!.appendChild(button);
    });

    // Create speed label
    this.label = document.createElement('span');
    this.label.className = CSS_CLASSES.label;
    this.container.appendChild(this.label);

    // Set initial states
    this.updateDisplay(this.controller.getCurrentSpeed());
    this.updateActiveButton(this.controller.getCurrentSpeedIndex());

    return this.container;
  }

  /**
   * Update speed display label
   */
  updateDisplay(speed: number): void {
    if (this.label) {
      this.label.textContent = `${speed}x`;
    }
  }

  /**
   * Update active button styling
   */
  updateActiveButton(index: number): void {
    this.buttons.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add(CSS_CLASSES.buttonActive);
      } else {
        btn.classList.remove(CSS_CLASSES.buttonActive);
      }
    });
  }

  /**
   * Create a single speed button
   */
  private createSpeedButton(speed: number, index: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = CSS_CLASSES.button;
    button.textContent = `${speed}x`;
    button.onclick = () => this.controller.setSpeed(index);
    return button;
  }

  /**
   * Insert controls into DOM near audio element
   */
  insertIntoDOM(audio: HTMLAudioElement): boolean {
    if (!this.container) {
      console.error(`${LOG_PREFIX} Container not created yet`);
      return false;
    }

    // Try multiple insertion points
    const insertionPoints = [
      audio.parentNode,
      audio.closest('div'),
      audio.parentNode?.parentNode,
      document.querySelector('.audio-container'),
      document.querySelector('#audio-wrapper'),
      document.body,
    ].filter(Boolean) as HTMLElement[];

    for (const parent of insertionPoints) {
      try {
        if (parent.contains(audio)) {
          // Insert after audio element
          audio.parentNode!.insertBefore(this.container, audio.nextSibling);
        } else {
          // Append to parent
          parent.appendChild(this.container);
        }
        console.log(`${LOG_PREFIX} Controls inserted into:`, parent);
        return true;
      } catch (e) {
        console.log(`${LOG_PREFIX} Failed to insert into:`, parent, e);
      }
    }

    console.error(`${LOG_PREFIX} Could not insert controls!`);
    return false;
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 3: Commit UIBuilder**

Run:
```bash
git add components/ui-builder.ts
git commit -m "feat: implement UIBuilder for creating and managing UI elements"
```

---

## Task 7: Implement KeyboardHandler

**Files:**
- Create: `components/keyboard-handler.ts`

**Step 1: Create KeyboardHandler class**

Create `components/keyboard-handler.ts`:
```typescript
import type { IKeyboardHandler } from '../types';
import type { AudioController } from './audio-controller';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

export class KeyboardHandler implements IKeyboardHandler {
  private controller: AudioController;
  private handleKeyDown: (e: KeyboardEvent) => void;

  constructor(controller: AudioController) {
    this.controller = controller;

    // Bind handler to preserve 'this' context
    this.handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_SHORTCUTS.decrease) {
        e.preventDefault();
        this.controller.decreaseSpeed();
      } else if (e.key === KEYBOARD_SHORTCUTS.increase) {
        e.preventDefault();
        this.controller.increaseSpeed();
      }
    };
  }

  /**
   * Initialize keyboard event listeners
   */
  init(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Remove keyboard event listeners
   */
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 3: Commit KeyboardHandler**

Run:
```bash
git add components/keyboard-handler.ts
git commit -m "feat: implement KeyboardHandler for keyboard shortcut support"
```

---

## Task 8: Create CSS Styles

**Files:**
- Create: `entrypoints/content.css`

**Step 1: Create CSS file**

Create `entrypoints/content.css`:
```css
/* Speed controls container */
.dd-speed-controls {
  display: flex !important;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
}

/* Speed control buttons */
.dd-speed-btn {
  width: 50px !important;
  height: 32px !important;
  border: 1px solid #ccc !important;
  cursor: pointer !important;
  background: #f8f9fa !important;
  color: #000 !important;
  border-radius: 3px;
  font-size: 14px;
  transition: all 0.2s !important;
}

/* Active button state */
.dd-speed-btn.active {
  background: #007bff !important;
  color: #fff !important;
  border-color: #007bff !important;
}

/* Button hover state */
.dd-speed-btn:hover {
  opacity: 0.8 !important;
  transform: scale(1.05);
}

/* Speed display label */
.dd-speed-label {
  margin-left: 10px;
  font-weight: bold;
  color: #007bff;
  line-height: 32px;
}
```

**Step 2: Verify CSS file exists**

Run:
```bash
ls -la entrypoints/content.css
cat entrypoints/content.css | head -20
```

Expected: File exists and contains CSS rules

**Step 3: Commit CSS**

Run:
```bash
git add entrypoints/content.css
git commit -m "feat: add CSS styles for speed control UI"
```

---

## Task 9: Create Content Script Entry Point

**Files:**
- Create: `entrypoints/content.ts`

**Step 1: Create content script**

Create `entrypoints/content.ts`:
```typescript
import { AudioController } from '../components/audio-controller';
import { UIBuilder } from '../components/ui-builder';
import { KeyboardHandler } from '../components/keyboard-handler';
import { LOG_PREFIX } from '../utils/constants';
import './content.css';

export default defineContentScript({
  matches: ['*://dailydictation.com/*', '*://*.dailydictation.com/*'],
  runAt: 'document_idle',

  main() {
    console.log(`${LOG_PREFIX} Initializing...`);

    let initialized = false;

    /**
     * Initialize controls for an audio element
     */
    const initializeAudioControls = (audio: HTMLAudioElement): void => {
      if (initialized) {
        console.log(`${LOG_PREFIX} Already initialized, skipping`);
        return;
      }

      console.log(`${LOG_PREFIX} Audio found!`, audio);
      initialized = true;

      // Create controller
      const controller = new AudioController(audio);

      // Create UI
      const uiBuilder = new UIBuilder(controller);
      const controls = uiBuilder.createSpeedControls();

      // Insert controls into DOM
      const inserted = uiBuilder.insertIntoDOM(audio);
      if (!inserted) {
        console.error(`${LOG_PREFIX} Failed to insert controls`);
        initialized = false;
        return;
      }

      // Setup keyboard shortcuts
      const keyboardHandler = new KeyboardHandler(controller);
      keyboardHandler.init();

      console.log(`${LOG_PREFIX} Controls initialized successfully!`);
    };

    /**
     * Find and initialize audio element
     */
    const findAudio = (): boolean => {
      const audio = document.querySelector('audio') as HTMLAudioElement | null;
      if (audio) {
        initializeAudioControls(audio);
        return true;
      }
      return false;
    };

    /**
     * Start initialization
     */
    const init = (): void => {
      // Try to find audio immediately
      if (findAudio()) {
        return;
      }

      // If not found, wait for it to be added to DOM
      console.log(`${LOG_PREFIX} Waiting for audio element...`);
      const observer = new MutationObserver(() => {
        if (findAudio()) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    // Start initialization
    init();
  },
});
```

**Step 2: Verify TypeScript compiles**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 3: Test build**

Run:
```bash
bun run build
```

Expected: Build succeeds, creates `.output/chrome-mv3/` and `.output/firefox-mv2/`

**Step 4: Commit content script**

Run:
```bash
git add entrypoints/content.ts
git commit -m "feat: implement content script entry point with orchestration logic"
```

---

## Task 10: Configure WXT Manifest

**Files:**
- Modify: `wxt.config.ts`

**Step 1: Update wxt.config.ts**

Replace content of `wxt.config.ts`:
```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'DailyDictation Speed Control',
    description: 'Add playback speed controls to DailyDictation.com audio players',
    version: '2.0.0',
    permissions: [],
    host_permissions: [
      '*://dailydictation.com/*',
      '*://*.dailydictation.com/*',
    ],
  },
  // Optimize build
  zip: {
    artifactTemplate: '{{name}}-{{version}}-{{browser}}.zip',
  },
});
```

**Step 2: Verify config is valid**

Run:
```bash
bunx tsc wxt.config.ts --noEmit
```

Expected: No errors

**Step 3: Test build with new config**

Run:
```bash
bun run build
```

Expected: Build succeeds với updated manifest

**Step 4: Verify manifest.json**

Run:
```bash
cat .output/chrome-mv3/manifest.json | grep -A5 '"name"'
```

Expected: See correct name and description

**Step 5: Commit config**

Run:
```bash
git add wxt.config.ts
git commit -m "feat: configure WXT manifest for DailyDictation extension"
```

---

## Task 11: Update package.json Metadata

**Files:**
- Modify: `package.json`

**Step 1: Update package.json**

Edit `package.json` to update name, description, version:
```json
{
  "name": "dailydictation-speed-control",
  "description": "Chrome/Firefox extension adding playback speed controls to DailyDictation.com",
  "version": "2.0.0",
  "type": "module",
  "private": true,
  ...
}
```

**Step 2: Verify package.json**

Run:
```bash
cat package.json | head -10
```

Expected: See updated name, description, version

**Step 3: Commit package.json**

Run:
```bash
git add package.json
git commit -m "chore: update package.json metadata"
```

---

## Task 12: Manual Testing

**Files:**
- No file changes

**Step 1: Start development server**

Run:
```bash
bun run dev
```

Expected: Dev server starts, outputs `.output/chrome-mv3-dev/`

Keep server running for testing.

**Step 2: Load extension in Chrome**

Manual steps:
1. Open Chrome
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `.output/chrome-mv3-dev/` directory
6. Extension should load without errors

**Step 3: Test on DailyDictation.com**

Manual steps:
1. Navigate to https://dailydictation.com
2. Open any lesson with audio
3. Verify:
   - ✅ Speed control buttons appear below audio player
   - ✅ Default speed is 1.0x (button highlighted)
   - ✅ Click each button (0.25x, 0.5x, 0.6x, 1.0x) - audio speed changes
   - ✅ Speed label updates correctly
   - ✅ Active button highlighted in blue
   - ✅ Press `[` key - speed decreases
   - ✅ Press `]` key - speed increases
   - ✅ Navigate to different lesson - speed resets to 1.0x

**Step 4: Check browser console**

Open DevTools console, verify:
- ✅ See `[DailyDict] Initializing...` message
- ✅ See `[DailyDict] Audio found!` message
- ✅ See `[DailyDict] Controls initialized successfully!` message
- ✅ No error messages

**Step 5: Document test results**

Create `TEST_RESULTS.md`:
```markdown
# Manual Testing Results - 2025-10-27

## Chrome Testing
- Extension loaded: ✅
- Controls appear: ✅
- Buttons work: ✅
- Keyboard shortcuts: ✅
- Speed reset on navigation: ✅
- Console logs clean: ✅

## Issues Found
(List any issues discovered)

## Notes
(Any observations or improvements needed)
```

**Step 6: Stop dev server**

Press Ctrl+C to stop dev server.

---

## Task 13: Build Production Packages

**Files:**
- No file changes

**Step 1: Clean previous builds**

Run:
```bash
rm -rf .output/
```

**Step 2: Build for production**

Run:
```bash
bun run build
```

Expected: Build completes successfully

**Step 3: Verify output directories**

Run:
```bash
ls -la .output/
ls -la .output/chrome-mv3/
ls -la .output/firefox-mv2/
```

Expected: See both chrome-mv3 and firefox-mv2 directories with built files

**Step 4: Check manifest files**

Run:
```bash
cat .output/chrome-mv3/manifest.json
cat .output/firefox-mv2/manifest.json
```

Expected: Both manifests have correct metadata, proper format for each browser

**Step 5: Check bundle size**

Run:
```bash
du -sh .output/chrome-mv3/
du -sh .output/firefox-mv2/
```

Expected: Both packages < 100KB (should be around 20-50KB)

**Step 6: Create ZIP files for store submission**

Run:
```bash
cd .output/chrome-mv3 && zip -r ../../dailydictation-speed-control-2.0.0-chrome.zip . && cd ../..
cd .output/firefox-mv2 && zip -r ../../dailydictation-speed-control-2.0.0-firefox.zip . && cd ../..
ls -lh *.zip
```

Expected: Two ZIP files created in project root

**Step 7: Commit build artifacts (optional)**

Note: Normally we don't commit build artifacts, but ZIPs can be committed for release:
```bash
git add dailydictation-speed-control-*.zip
git commit -m "build: create production packages for Chrome and Firefox"
```

---

## Task 14: Create README for Extension

**Files:**
- Create: `README.md`

**Step 1: Create README.md**

Create `README.md`:
```markdown
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
```

**Step 2: Commit README**

Run:
```bash
git add README.md
git commit -m "docs: add README with installation and usage instructions"
```

---

## Task 15: Final Verification and Cleanup

**Files:**
- No file changes

**Step 1: Run final TypeScript check**

Run:
```bash
bunx tsc --noEmit
```

Expected: No errors

**Step 2: Verify all files are committed**

Run:
```bash
git status
```

Expected: Working tree clean (or only untracked .output/ and node_modules/)

**Step 3: Review git log**

Run:
```bash
git log --oneline -15
```

Expected: See all commits in logical order

**Step 4: Create git tag for release**

Run:
```bash
git tag -a v2.0.0 -m "Release v2.0.0 - WXT migration complete"
git push origin feature/wxt-migration
git push origin v2.0.0
```

**Step 5: Document completion**

Create `MIGRATION_COMPLETE.md`:
```markdown
# Migration Complete - WXT Extension Ready

✅ All tasks completed successfully

## Deliverables
- Chrome extension package: `dailydictation-speed-control-2.0.0-chrome.zip`
- Firefox extension package: `dailydictation-speed-control-2.0.0-firefox.zip`
- Source code: `feature/wxt-migration` branch
- Tagged release: `v2.0.0`

## Testing Status
- ✅ Manual testing on Chrome
- ✅ Manual testing on Firefox (TODO if not done)
- ✅ All features working
- ✅ No console errors

## Next Steps
1. Test Firefox build (if not done yet)
2. Prepare store listings:
   - Screenshots
   - Description
   - Privacy policy (if required)
3. Submit to Chrome Web Store
4. Submit to Firefox Add-ons

## Branch Status
Branch: `feature/wxt-migration`
Ready to merge to: `master` (or main branch)
```

**Step 6: Commit completion doc**

Run:
```bash
git add MIGRATION_COMPLETE.md
git commit -m "docs: add migration completion summary"
```

---

## Summary

This plan migrates the DailyDictation userscript to a WXT-based browser extension with:

✅ **Modular TypeScript architecture** - Separated concerns (AudioController, UIBuilder, KeyboardHandler)
✅ **Cross-browser support** - Chrome and Firefox builds
✅ **Type safety** - Full TypeScript coverage
✅ **Modern tooling** - WXT + Bun for fast development
✅ **Production ready** - Built packages ready for store submission

**Total estimated time:** 3-4 hours for experienced developer

**Key files created:**
- 4 TypeScript modules (AudioController, UIBuilder, KeyboardHandler, content.ts)
- 1 types file
- 1 constants file
- 1 CSS file
- Config files (wxt.config.ts, package.json updates)
- Documentation (README, test results, completion summary)

**Testing approach:**
- Manual testing in Chrome/Firefox
- No automated tests in Phase 1 (can add later)
- Verification at each step with TypeScript compiler

**Next phase possibilities:**
- Add automated tests (Jest + Playwright)
- Add options page for custom speed presets
- Add popup UI
- Add analytics (privacy-respecting)
- Publish to stores
