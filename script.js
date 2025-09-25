// ==UserScript==
// @name         DailyDictation Playback Speed Controls with Buttons and Display
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Thêm phím tắt [ và ], các nút chọn tốc độ nhanh, và element hiển thị tốc độ, với vị trí ở dòng dưới player
// @author       You
// @match        https://dailydictation.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const speeds = [0.25, 0.5, 0.6, 1.0];
  let currentIndex = 2; // Bắt đầu từ 1.0
  let audio = null;
  let speedDisplay = null;
  let buttonsContainer = null;

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
        button.style.padding = "5px 10px";
        button.style.border = "1px solid #ccc";
        button.style.cursor = "pointer";
        button.addEventListener("click", () => {
          currentIndex = index;
          updateDisplay();
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

      // Thêm phím tắt (giữ nguyên)
      document.addEventListener("keydown", (event) => {
        let updated = false;
        if (event.key === "Alt") {
          if (currentIndex > 0) {
            currentIndex--;
            updated = true;
          }
        } else if (event.key === "Shift") {
          if (currentIndex < speeds.length - 1) {
            currentIndex++;
            updated = true;
          }
        }
        if (updated) {
          updateDisplay();
        }
      });
      console.log(
        "Controls (buttons, display, phím tắt) đã được thiết lập ở dòng dưới player.",
      );
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
