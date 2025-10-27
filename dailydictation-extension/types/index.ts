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
