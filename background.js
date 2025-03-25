// 확장 프로그램 설치 시 기본 화질을 1080p로 설정
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ quality: "1080p" });
});