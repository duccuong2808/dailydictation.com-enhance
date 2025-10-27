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
