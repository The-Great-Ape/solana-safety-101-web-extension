let fireAlretTabId = 0;

function onTabActivate(current_tab_url, tabId) {
  const verifiedUrlList = [];
  const scamUrlList = [];

  fetch(
    "https://raw.githubusercontent.com/The-Great-Ape/solana-safety-101/main/pages/api/data.json"
  )
    .then((response) => response.json())
    .then((json) => {
      json.forEach((urlGroup) =>
        urlGroup.forEach((url) => {
          if (url.status === "Real") {
            verifiedUrlList.push(url.domain);
          } else {
            scamUrlList.push(url.domain);
          }
        })
      );
    }).then(() => {
      verifyUrl(current_tab_url, tabId, verifiedUrlList, scamUrlList)
    });
}

function verifyUrl(current_tab_url, tabId, verifiedUrlList, scamUrlList) {
  const hostName = getHostNameFromUrl(current_tab_url);
  if (verifiedUrlList.indexOf(hostName) > -1) {
    setBadge("green", "PASS");
  } else if (scamUrlList.indexOf(hostName) > -1) {
    setBadge("red", "WARN");
    setAlert(tabId);
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

function setAlert(tabId) {
  if (fireAlretTabId != tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      func: () => alert("Warning: This website might not be an official website"),
    });
    fireAlretTabId = tabId;
  }
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    if (current_tab_info.url) {
      onTabActivate(current_tab_info.url, tab.tabId);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    onTabActivate(tab.url, tabId);
  }
});
