import { AudioController } from '../../components/audio-controller';
import { UIBuilder } from '../../components/ui-builder';
import { KeyboardHandler } from '../../components/keyboard-handler';
import { LOG_PREFIX } from '../../utils/constants';
import './style.css';

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
