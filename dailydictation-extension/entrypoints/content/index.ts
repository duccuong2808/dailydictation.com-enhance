import { AudioController } from '../../components/audio-controller';
import { UIBuilder } from '../../components/ui-builder';
import { KeyboardHandler } from '../../components/keyboard-handler';
import { LOG_PREFIX } from '../../utils/constants';

export default defineContentScript({
  matches: ['*://dailydictation.com/*', '*://*.dailydictation.com/*'],
  runAt: 'document_idle',

  main() {
    console.log(`${LOG_PREFIX} Initializing...`);

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
      console.log(`${LOG_PREFIX} CSS injected`);
    };

    // Inject CSS first
    injectCSS();

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
