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
    // Don't apply speed immediately - wait for user interaction
    // This avoids triggering autoplay policy restrictions
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
