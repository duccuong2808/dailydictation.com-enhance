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
 * Keyboard shortcuts (using e.code for consistency)
 */
export const KEYBOARD_SHORTCUTS = {
  decrease: 'BracketLeft',
  increase: 'BracketRight',
  reset: 'Backslash',
} as const;

/**
 * Debug logging prefix
 */
export const LOG_PREFIX = '[DailyDict]';
