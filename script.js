// ==UserScript==
// @name         DailyDictation Speed Control - Fixed
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Fixed version - ensure buttons are visible
// @author       Optimized
// @match        https://dailydictation.com/*
// @grant        none
// ==/UserScript==

(() => {
  "use strict";

  const SPEEDS = [0.25, 0.5, 0.6, 1.0];
  let currentIndex = 3,
    audio,
    buttons = [],
    lastSrc,
    resetNext = false,
    initialized = false;

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .dd-speed-controls {
      display: flex !important;
      gap: 5px;
      padding: 10px;
      border-radius: 5px;
    }
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
    .dd-speed-btn.active {
      background: #007bff !important;
      color: #fff !important;
      border-color: #007bff !important;
    }
    .dd-speed-btn:hover {
      opacity: 0.8 !important;
      transform: scale(1.05);
    }
    .dd-speed-label {
      margin-left: 10px;
      font-weight: bold;
      color: #007bff;
      line-height: 32px;
    }
  `;
  document.head.appendChild(style);

  const updateSpeed = () => {
    if (!audio) return;
    audio.playbackRate = SPEEDS[currentIndex];
    buttons.forEach((btn, i) =>
      btn.classList.toggle("active", i === currentIndex),
    );
    const label = document.querySelector(".dd-speed-label");
  };

  const setSpeed = (index) => {
    currentIndex = index;
    resetNext = true;
    updateSpeed();
  };

  const setupControls = () => {
    if (!audio || initialized) return;
    initialized = true;

    console.log("[DailyDict] Setting up controls...");
    console.log("[DailyDict] Audio element:", audio);
    console.log("[DailyDict] Audio parent:", audio.parentNode);

    // Create container
    const container = document.createElement("div");
    container.className = "dd-speed-controls";

    // Create buttons
    SPEEDS.forEach((speed, i) => {
      const btn = document.createElement("button");
      btn.className = "dd-speed-btn";
      btn.textContent = speed;
      btn.onclick = () => setSpeed(i);
      buttons.push(btn);
      container.appendChild(btn);
    });

    // Add speed label
    const label = document.createElement("span");
    label.className = "dd-speed-label";
    container.appendChild(label);

    // Try multiple insertion points
    const insertionPoints = [
      audio.parentNode, // Direct parent
      audio.closest("div"), // Closest div
      audio.parentNode.parentNode, // Grandparent
      document.querySelector(".audio-container"), // Common class name
      document.querySelector("#audio-wrapper"), // Common ID
      document.body, // Fallback to body
    ].filter(Boolean);

    let inserted = false;
    for (const parent of insertionPoints) {
      try {
        // Try inserting after audio element or at the end
        const audioInParent = parent.contains(audio);
        if (audioInParent) {
          // Insert after audio element
          audio.parentNode.insertBefore(container, audio.nextSibling);
        } else {
          // Append to parent
          parent.appendChild(container);
        }
        inserted = true;
        console.log("[DailyDict] Controls inserted into:", parent);
        break;
      } catch (e) {
        console.log("[DailyDict] Failed to insert into:", parent, e);
      }
    }

    if (!inserted) {
      console.error("[DailyDict] Could not insert controls!");
      return;
    }

    lastSrc = audio.src;
    updateSpeed();

    // Monitor src changes
    new MutationObserver(() => {
      if (audio.src !== lastSrc) {
        lastSrc = audio.src;
        if (resetNext) {
          currentIndex = 3;
          resetNext = false;
          updateSpeed();
        }
      }
    }).observe(audio, { attributes: true, attributeFilter: ["src"] });

    console.log("[DailyDict] Controls initialized successfully!");
  };

  const findAudio = () => {
    audio = document.querySelector("audio");
    if (audio) {
      console.log("[DailyDict] Audio found!");
      setupControls();
      return true;
    }
    return false;
  };

  // Keyboard handler
  document.addEventListener("keydown", (e) => {
    if (!audio) return;

    if (e.key === "[" || e.key === "]") {
      e.preventDefault();
      if (e.key === "[" && currentIndex > 0) setSpeed(currentIndex - 1);
      if (e.key === "]" && currentIndex < SPEEDS.length - 1)
        setSpeed(currentIndex + 1);
    }
  });

  // Initialize
  const init = () => {
    console.log("[DailyDict] Initializing...");
    if (findAudio()) return;

    // Wait for audio element
    const observer = new MutationObserver(() => {
      if (findAudio()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Start when ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // Add small delay to ensure page is fully rendered
    setTimeout(init, 500);
  }
})();
