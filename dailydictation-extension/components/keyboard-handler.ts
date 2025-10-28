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
   * @param ctx - WXT ContentScriptContext for Firefox compatibility
   */
  init(ctx?: any): void {
    // Use ctx.addEventListener for Firefox compatibility if available
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
