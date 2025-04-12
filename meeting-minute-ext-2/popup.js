let mediaRecorder;
let audioChunks = [];

document.getElementById("startBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // chrome.runtime.sendMessage({ action: "injectContentScript", tabId: tab.id });
    chrome.runtime.sendMessage({ action: "start-recording", tabId: tab.id });
    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
    /*    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("::: tab.url", tab.url)
        if (!tab.url.includes("meet.google.com")) {
          alert("❌ Please switch to a Google Meet tab to start recording.");
          return;
        }
    
        chrome.tabCapture.capture({ audio: true, video: false }, function (stream) {
          if (!stream) {
            console.error("❌ tabCapture error:", chrome.runtime.lastError);
            alert("Error capturing audio: " + chrome.runtime.lastError.message);
            return;
          }
    
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
    
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunks.push(e.data);
            }
          };
    
          mediaRecorder.onstop = async () => {
            const blob = new Blob(audioChunks, { type: "audio/webm" });
            const formData = new FormData();
            formData.append("audio", blob, "meeting-audio.webm");
    
            try {
              const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
              });
              const data = await response.json();
              console.log("✅ Upload success:", data);
            } catch (err) {
              console.error("❌ Upload failed:", err);
            }
          };
    
          mediaRecorder.start();
          document.getElementById("status").textContent = "🎤 Recording started";
          console.log("✅ Recording started...");
        });*/
  } catch (error) {
    console.error("❌ Error starting tab capture:", error);
  }
});

document.getElementById("stopBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(":: stop", tab)
  chrome.runtime.sendMessage({ action: "stop-recording", tabId: tab.id });
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
});