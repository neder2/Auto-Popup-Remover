chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ quality: "1080p" }, function () {
        console.log("✅ 기본 화질이 1080p로 설정되었습니다.");
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "fetchData") {
        fetch(request.url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => sendResponse(data))
        .catch(error => sendResponse({ error: error.message }));

        return true; // 비동기 응답을 보낼 수 있도록 설정
    }
});
