chrome.storage.sync.get("quality", function (data) {
    const preferredQuality = data.quality || "1080p"; // ✅ 기본값을 1080p로 변경
    console.log("✅ 사용자가 설정한 화질:", preferredQuality);

    function removeAdsPopup() {
        let popup = document.querySelector(".popup_container__Aqx-3");
        if (popup) {
            console.log("🚨 광고 차단 감지 팝업 발견! 즉시 제거");
            popup.remove();
        }
    }

    function changeQuality(attempts = 10) {
        console.log(`🔄 화질 변경 시도... 남은 재시도 횟수: ${attempts}`);

        let qualityButtons = document.querySelectorAll("li.pzp-ui-setting-quality-item");

        if (!qualityButtons.length) {
            if (attempts > 0) {
                setTimeout(() => changeQuality(attempts - 1), 1000);
            }
            return;
        }

        let found = false;
        qualityButtons.forEach(button => {
            let qualityText = button.innerText.trim();
            if (qualityText.includes(preferredQuality)) {
                console.log(`✅ ${preferredQuality} 클릭 시도...`);
                button.click();

                setTimeout(() => {
                    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
                    console.log(`🎯 ${preferredQuality} 적용을 위해 Enter 키 이벤트 발생!`);
                }, 500);

                found = true;
            }
        });

        if (!found) console.log("❌ 원하는 화질 옵션을 찾을 수 없음.");
    }

    function waitForQualityChange() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const currentQuality = document.querySelector("li.pzp-ui-setting-quality-item.pzp-ui-setting-pane-item-selected")?.innerText;
                if (currentQuality && currentQuality.includes("360p")) {
                    console.log("🚨 자동 360p 감지됨! 즉시 변경...");
                    setTimeout(changeQuality, 1000);
                }
            });
        });

        setTimeout(() => {
            const targetNode = document.querySelector("li.pzp-ui-setting-quality-item");
            if (targetNode) {
                observer.observe(targetNode, { childList: true, subtree: true });
                console.log("🔄 화질 변경 감시 활성화됨");
            }
        }, 1000);
    }

    function detectPageChange() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                console.log("🔄 방송 변경 감지! 팝업 제거 & 화질 즉시 설정...");
                lastUrl = location.href;
                setTimeout(() => {
                    removeAdsPopup();
                    changeQuality();
                }, 500);
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // ✅ 즉시 실행 (사이트 처음 진입 시)
    removeAdsPopup();

    // ✅ 최초 진입 시 버튼 로딩 기다리면서 10번까지 반복 시도
    setTimeout(() => changeQuality(10), 500);

    // ✅ 방송 변경 시 팝업 제거 + 화질 변경 감지
    waitForQualityChange();
    detectPageChange();

    // ✅ MutationObserver로 팝업 감지 (필요할 때만 실행)
    new MutationObserver(() => removeAdsPopup()).observe(document.body, { childList: true, subtree: true });
});
