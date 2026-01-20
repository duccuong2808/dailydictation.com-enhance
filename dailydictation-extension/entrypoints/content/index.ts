import { AudioController } from '../../components/audio-controller';
import { UIBuilder } from '../../components/ui-builder';
import { KeyboardHandler } from '../../components/keyboard-handler';

export default defineContentScript({
  matches: ['*://dailydictation.com/*', '*://*.dailydictation.com/*'],
  runAt: 'document_idle',

  main(ctx) {
    // Inject CSS directly into DOM (Firefox compatibility fix)
    const injectCSS = (): void => {
      const styleId = 'dd-speed-controls-styles';

      // Check if already injected
      if (document.getElementById(styleId)) {
        return;
      }

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
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
      `;

      document.head.appendChild(style);
    };

    // Inject CSS first
    injectCSS();

    // Track current audio and controls
    let currentAudio: HTMLAudioElement | null = null;
    let currentController: AudioController | null = null;
    let currentUIBuilder: UIBuilder | null = null;
    let currentKeyboardHandler: KeyboardHandler | null = null;

    /**
     * Check if controls are correctly positioned next to audio
     */
    const isControlsValid = (): boolean => {
      if (!currentAudio || !currentUIBuilder) return false;

      const controls = document.querySelector('.dd-speed-controls');
      if (!controls) return false;

      // Check if controls and audio share the same visible parent
      const audioParent = currentAudio.parentElement;
      const controlsParent = controls.parentElement;

      // Controls should be sibling of audio or in same parent
      return audioParent === controlsParent;
    };

    /**
     * Remove existing controls from DOM
     */
    const removeControls = (): void => {
      const existingControls = document.querySelector('.dd-speed-controls');
      if (existingControls) {
        existingControls.remove();
      }
    };

    /**
     * Initialize controls for an audio element
     */
    const initializeAudioControls = (audio: HTMLAudioElement): void => {
      // If same audio and controls are valid, skip
      if (currentAudio === audio && isControlsValid()) {
        return;
      }

      // Remove old controls if any
      removeControls();

      // Update current audio reference
      currentAudio = audio;

      // Create controller
      currentController = new AudioController(audio);

      // Create UI
      currentUIBuilder = new UIBuilder(currentController);
      currentUIBuilder.createSpeedControls();

      // Insert controls into DOM
      const inserted = currentUIBuilder.insertIntoDOM(audio);
      if (!inserted) {
        currentAudio = null;
        return;
      }

      // Setup keyboard shortcuts (only once, but update controller reference)
      if (!currentKeyboardHandler) {
        currentKeyboardHandler = new KeyboardHandler(currentController);
        currentKeyboardHandler.init(ctx);
      } else {
        // Update controller reference when audio changes
        currentKeyboardHandler.updateController(currentController);
      }
    };

    /**
     * Find visible audio element (one with src or visible in DOM)
     */
    const findVisibleAudio = (): HTMLAudioElement | null => {
      const audios = document.querySelectorAll('audio');
      for (const audio of audios) {
        // Prefer audio with src (actually playing/loaded)
        if (audio.src || audio.querySelector('source')) {
          // Check if audio is in visible part of DOM
          const parent = audio.parentElement;
          if (parent && parent.offsetHeight > 0) {
            return audio;
          }
        }
      }
      // Fallback to first audio
      return audios[0] as HTMLAudioElement || null;
    };

    /**
     * Check and update controls position
     */
    const checkAndUpdateControls = (): void => {
      const audio = findVisibleAudio();

      if (!audio) {
        return;
      }

      // If audio changed or controls not valid, reinitialize
      if (audio !== currentAudio || !isControlsValid()) {
        initializeAudioControls(audio);
      }
    };

    /**
     * Start initialization with continuous monitoring
     */
    const init = (): void => {
      // Initial check
      checkAndUpdateControls();

      // Ensure document.body exists before observing
      const targetNode = document.body || document.documentElement;

      // Flag to ignore mutations caused by our own DOM changes
      let isUpdating = false;

      // Wrap checkAndUpdateControls to set flag
      const safeCheckAndUpdate = (): void => {
        if (isUpdating) return;
        isUpdating = true;
        try {
          checkAndUpdateControls();
        } finally {
          // Reset flag after DOM has settled
          setTimeout(() => {
            isUpdating = false;
          }, 50);
        }
      };

      // Keep observing for DOM changes (DailyDictation re-renders content)
      const observer = new MutationObserver((mutations) => {
        // Skip if we're currently updating (our own changes)
        if (isUpdating) return;

        // Skip mutations that only affect our controls
        const isOurMutation = mutations.every(m => {
          const target = m.target as Element;
          return target.closest?.('.dd-speed-controls') !== null;
        });
        if (isOurMutation) return;

        // Debounce: wait for DOM to settle
        setTimeout(() => {
          safeCheckAndUpdate();
        }, 100);
      });

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    };

    // Start initialization
    init();
  },
});
