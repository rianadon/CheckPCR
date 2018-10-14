chrome.runtime.onInstalled.addListener(function(details) {
    chrome.tabs.create({url: "index.html"});
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: "index.html"});
});