import { verifiedUrlList, scamUrlList } from "./url_list.js";

function onTabActivate(current_tab_url) {
  const hostName = getHostNameFromUrl(current_tab_url);
  if (verifiedUrlList.indexOf(hostName) > -1) {
    setBadge("green", "PASS");
  } else if (scamUrlList.indexOf(hostName) > -1) {
    setBadge("red", "WARN");
  } else {
    setBadge("black", "UNKN");
  }
}

function getHostNameFromUrl(url) {
  const { hostname } = new URL(url);
  return hostname;
}

function setBadge(color, text) {
  chrome.action.setBadgeBackgroundColor({
    color,
  });
  chrome.action.setBadgeText({
    text,
  });
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    if (current_tab_info.url) {
      onTabActivate(current_tab_info.url);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    onTabActivate(tab.url);
  }
});
