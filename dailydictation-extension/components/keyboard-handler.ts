import type { IKeyboardHandler } from '../types';
import type { AudioController } from './audio-controller';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

export class KeyboardHandler implements IKeyboardHandler {
  private controller: AudioController;
  private handleKeyDown: (e: KeyboardEvent) => void;

  constructor(controller: AudioController) {
    this.controller = controller;
    this.handleKeyDown = this.createHandler();
  }

  /**
   * Update the controller reference (when audio changes)
   */
  updateController(controller: AudioController): void {
    this.controller = controller;
  }

  /**
   * Create the keydown handler
   */
  private createHandler(): (e: KeyboardEvent) => void {
    return (e: KeyboardEvent) => {
      console.log('[DailyDict] Key event - code:', e.code);
      if (e.code === KEYBOARD_SHORTCUTS.decrease) {
        e.preventDefault();
        this.controller.decreaseSpeed();
      } else if (e.code === KEYBOARD_SHORTCUTS.increase) {
        e.preventDefault();
        this.controller.increaseSpeed();
      } else if (e.code === KEYBOARD_SHORTCUTS.reset) {
        e.preventDefault();
        this.controller.resetSpeed();
      }
    };
  }

  /**
   * Initialize keyboard event listeners
   * @param ctx - WXT ContentScriptContext for Firefox compatibility
   */
  init(ctx?: any): void {
    if (ctx && ctx.addEventListener) {
      ctx.addEventListener(document, 'keydown', this.handleKeyDown);
    } else {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  /**
   * Remove keyboard event listeners
   */
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
