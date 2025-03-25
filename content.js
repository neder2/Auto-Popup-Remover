chrome.storage.sync.get("quality", ({ quality }) => {
    const preferredQuality = quality || "1080p";
  
    // 광고 차단 관련 팝업만 제거
    function removeAdsPopup() {
      const popup = document.querySelector(".popup_container__Aqx-3");
      if (popup && popup.innerText.includes("광고 차단")) {
        popup.style.display = "none";
      }
    }
  
    // 설정된 화질로 변경 시도 (최대 10회 재시도)
    function changeQuality(attempts = 10) {
      const buttons = document.querySelectorAll("li.pzp-ui-setting-quality-item");
      if (!buttons.length) {
        if (attempts > 0) setTimeout(() => changeQuality(attempts - 1), 1000);
        return;
      }
      buttons.forEach(btn => {
        const text = btn.innerText.trim();
        if (text.includes(preferredQuality)) {
          btn.click();
          setTimeout(() => {
            btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
          }, 500);
        }
      });
    }
  
    // 자동 360p 설정 감지 시 화질 변경
    function watchAuto360p() {
      const observer = new MutationObserver(() => {
        const current = document.querySelector("li.pzp-ui-setting-quality-item.pzp-ui-setting-pane-item-selected")?.innerText;
        if (current?.includes("360p")) setTimeout(changeQuality, 1000);
      });
      setTimeout(() => {
        const target = document.querySelector("li.pzp-ui-setting-quality-item");
        if (target) observer.observe(target, { childList: true, subtree: true });
      }, 1000);
    }
  
    // URL 변경 감지 시 팝업 제거 + 화질 재설정
    function onPageChange() {
      let lastUrl = location.href;
      new MutationObserver(() => {
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          setTimeout(() => {
            removeAdsPopup();
            changeQuality();
          }, 500);
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  
    // overflow: hidden이 강제로 적용되는 경우 복구
    function enableScroll() {
      const html = document.documentElement;
      const body = document.body;
      if (body.style.overflow === 'hidden' || html.style.overflow === 'hidden') {
        body.style.overflow = 'auto';
        html.style.overflow = 'auto';
      }
    }
  
    new MutationObserver(() => enableScroll()).observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true
    });
  
    // 스크롤 차단을 막기 위해 스타일 강제 삽입
    function forceEnableScroll() {
      const style = document.createElement('style');
      style.innerHTML = `
        html, body {
          overflow: auto !important;
          position: static !important;
          height: auto !important;
        }
        * {
          overscroll-behavior: auto !important;
          scroll-behavior: auto !important;
        }
        ::-webkit-scrollbar {
          display: initial !important;
        }
      `;
      document.head.appendChild(style);
    }
  
    // 초기 실행: 팝업 제거, 화질 설정, 감시 시작
    removeAdsPopup();
    changeQuality();
    watchAuto360p();
    onPageChange();
    forceEnableScroll();
  
    // 팝업이 나중에 뜨는 경우를 대비한 감시자 추가
    new MutationObserver(() => removeAdsPopup()).observe(document.body, { childList: true, subtree: true });
  });