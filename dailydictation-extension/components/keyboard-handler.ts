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
