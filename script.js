// ==UserScript==
// @name         DailyDictation Playback Speed Controls with Buttons and Display
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Thêm phím tắt [ và ], các nút chọn tốc độ nhanh, element hiển thị tốc độ, auto reset về 1.0x khi audio src thay đổi, bắt đầu với 1.0x
// @author       You
// @match        https://dailydictation.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const speeds = [0.25, 0.5, 0.6, 1.0];
  let currentIndex = 3; // Bắt đầu từ 1.0x per clarifications
  let audio = null;
  let speedDisplay = null;
  let buttonsContainer = null;

  // Auto reset functionality
  let resetOnNextAudio = false; // Flag indicating reset should occur on next audio
  const DEFAULT_SPEED_INDEX = 3; // Index for 1.0x speed (default after reset)
  let currentAudioSrc = null; // Track current audio src for change detection

  // Hàm kích hoạt reset trigger khi user thay đổi speed
  function activateResetTrigger() {
    resetOnNextAudio = true;
    console.log("Reset trigger activated - will reset to 1.0x on next audio");
  }

  // Hàm thực hiện reset speed về mặc định
  function executeReset() {
    currentIndex = DEFAULT_SPEED_INDEX;
    resetOnNextAudio = false;
    console.log(
      `Auto reset executed - speed reset to ${speeds[DEFAULT_SPEED_INDEX]}x`,
    );
  }

  // Hàm xử lý khi audio src thay đổi
  function handleAudioSrcChange() {
    if (audio && audio.src !== currentAudioSrc) {
      console.log(
        `Audio src changed from "${currentAudioSrc}" to "${audio.src}"`,
      );
      currentAudioSrc = audio.src;
      executeReset();
      updateDisplay();
    }
  }

  // Hàm thiết lập monitoring cho audio src changes
  function setupAudioSrcMonitoring() {
    if (audio) {
      // Initialize current src
      currentAudioSrc = audio.src;
      console.log(`Initial audio src: "${currentAudioSrc}"`);

      // Create observer for src attribute changes
      const audioSrcObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src"
          ) {
            handleAudioSrcChange();
          }
        });
      });

      // Start observing src attribute changes
      audioSrcObserver.observe(audio, {
        attributes: true,
        attributeFilter: ["src"],
      });

      console.log("Audio src monitoring setup complete");
    }
  }

  // Hàm cập nhật hiển thị và highlight button
  function updateDisplay() {
    if (buttonsContainer) {
      Array.from(buttonsContainer.children).forEach((btn, idx) => {
        if (btn.tagName === "BUTTON") {
          // Chỉ highlight buttons
          btn.style.backgroundColor = idx === currentIndex ? "#007bff" : "#ccc";
          btn.style.color = idx === currentIndex ? "#fff" : "#000";
        }
      });
    }
    if (audio) {
      audio.playbackRate = speeds[currentIndex];
    }
    console.log(`Tốc độ mới: ${speeds[currentIndex]}x`);
  }

  // Hàm thiết lập khi audio sẵn sàng
  function setupControls() {
    if (audio && !buttonsContainer) {
      // Chỉ setup một lần
      console.log("Audio đã tìm thấy, đang thiết lập controls.");

      // Kiểm tra và thực hiện reset nếu cần
      if (resetOnNextAudio) {
        executeReset();
      }

      // Tạo container cho buttons và display
      buttonsContainer = document.createElement("div");
      buttonsContainer.style.display = "block"; // Đảm bảo ở dòng mới
      buttonsContainer.style.marginTop = "20px"; // Khoảng cách phía trên để xuống dòng dưới player
      buttonsContainer.style.alignItems = "center";

      // Tạo buttons cho từng tốc độ
      speeds.forEach((speed, index) => {
        const button = document.createElement("button");
        button.innerText = `${speed}`;
        button.style.marginRight = "5px";
        button.style.width = "50px";
        button.style.height = "32px";
        button.style.boxSizing = "border-box";
        button.style.padding = "0";
        button.style.textAlign = "center";
        button.style.lineHeight = "32px";
        button.style.border = "1px solid #ccc";
        button.style.cursor = "pointer";
        button.addEventListener("click", () => {
          currentIndex = index;
          updateDisplay();
          activateResetTrigger();
        });
        buttonsContainer.appendChild(button);
      });

      // Tạo element hiển thị tốc độ (tùy chọn, bên cạnh buttons)
      speedDisplay = document.createElement("span");
      speedDisplay.style.marginLeft = "10px";
      speedDisplay.style.fontWeight = "bold";
      speedDisplay.style.color = "#007bff";
      buttonsContainer.appendChild(speedDisplay);

      // Chèn container vào cuối parent của audio (để ở dưới player)
      audio.parentNode.appendChild(buttonsContainer);

      // Cập nhật ban đầu
      updateDisplay();

      // Thêm phím tắt bracket [ và ]
      document.addEventListener("keydown", (event) => {
        let updated = false;
        if (event.key === "[" && audio) {
          event.preventDefault(); // Chặn việc gõ ký tự [
          console.log(
            `[${event.key}] key pressed - attempting to decrease speed`,
          );
          if (currentIndex > 0) {
            currentIndex--;
            updated = true;
            console.log(`Speed decreased to: ${speeds[currentIndex]}x`);
          } else {
            console.log("Already at minimum speed (0.25x)");
          }
        } else if (event.key === "]" && audio) {
          event.preventDefault(); // Chặn việc gõ ký tự ]
          console.log(
            `[${event.key}] key pressed - attempting to increase speed`,
          );
          if (currentIndex < speeds.length - 1) {
            currentIndex++;
            updated = true;
            console.log(`Speed increased to: ${speeds[currentIndex]}x`);
          } else {
            console.log("Already at maximum speed (1.0x)");
          }
        }
        if (updated) {
          updateDisplay();
          activateResetTrigger();
        }
      });
      console.log(
        "Controls (buttons, display, phím tắt) đã được thiết lập ở dòng dưới player.",
      );

      // Setup audio src monitoring for clarified requirements
      setupAudioSrcMonitoring();
    }
  }

  // MutationObserver để theo dõi DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        audio = document.querySelector("audio");
        if (audio) {
          setupControls();
          observer.disconnect();
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log("MutationObserver đang chờ audio element.");

  // Kiểm tra ngay nếu đã load
  window.addEventListener("load", () => {
    audio = document.querySelector("audio");
    if (audio) {
      setupControls();
      observer.disconnect();
    }
  });
})();
