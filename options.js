// 옵션 페이지 로드 후 저장된 화질을 불러오고, 변경된 값을 저장

// DOM 요소 로드 후 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
    const qualitySelect = document.getElementById("quality");
    const saveButton = document.getElementById("save");
    const message = document.getElementById("message");

    // 저장된 화질 불러오기
    chrome.storage.sync.get("quality", ({ quality }) => {
        if (quality) qualitySelect.value = quality;
    });

    // 저장 버튼 클릭 시 설정 저장
    saveButton.addEventListener("click", () => {
        const quality = qualitySelect.value;
        chrome.storage.sync.set({ quality }, () => {
            message.classList.remove("hidden");
            message.classList.add("fade-in");
            setTimeout(() => message.classList.add("hidden"), 2000);
        });
    });
});