document.getElementById("save").addEventListener("click", function () {
    const quality = document.getElementById("quality").value;
    chrome.storage.sync.set({ quality: quality }, function () {
        let message = document.getElementById("message");
        message.classList.remove("hidden");
        message.classList.add("fade-in");

        setTimeout(() => {
            message.classList.add("hidden");
        }, 2000); // 2초 후 메시지 사라짐
    });
});

// 저장된 설정 불러오기
chrome.storage.sync.get("quality", function (data) {
    if (data.quality) {
        document.getElementById("quality").value = data.quality;
    }
});
