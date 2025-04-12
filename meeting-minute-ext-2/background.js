/*chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log("Message received:", msg);
  
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  
    if (!tabs.length) {
      console.warn("⚠️ No active tabs found.");
      return;
    }
  
    const [tab] = tabs;
    console.log("✅ Active tab:", tab);
  
    if (msg.action === "start-recording") {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
        console.log("✅ Content script injected into", tab.url);
      } catch (e) {
        console.error("❌ Injection failed:", e);
      }
    }
  });*/
chrome.runtime.onMessage.addListener(async (msg) => {
    console.log("::: bk", msg)
    if (msg.action === "start-recording") {
        handleTab(msg.tabId, msg.action);
    } else if (msg.action === "stop-recording") {
        handleTab(msg.tabId, msg.action);
    }
});


async function handleTab(tabId, action) {
    // const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    // const tab = tabs[0];
    console.log("Active tab msg:", tabId, action);

    if (!tabId) return;

    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        });
    } catch (e) {
        console.log("Script inject error or already injected:", e.message);
    }

    chrome.tabs.sendMessage(tabId, { action });
}