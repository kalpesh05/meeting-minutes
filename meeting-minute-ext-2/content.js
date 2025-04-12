// (async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       console.log("Mic access granted, recording…");
  
//       const chunks = [];
//       const mediaRecorder = new MediaRecorder(stream);
  
//       mediaRecorder.ondataavailable = (e) => {
//         chunks.push(e.data);
//       };
  
//       mediaRecorder.onstop = async () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         const formData = new FormData();
//         formData.append("audio", blob, "meeting-audio.webm");
  
//         const res = await fetch("http://localhost:5000/api/upload", {
//           method: "POST",
//           body: formData
//         });
  
//         console.log("Upload response:", await res.text());
//       };
  
//       mediaRecorder.start();
  
//       setTimeout(() => {
//         mediaRecorder.stop();
//       }, 30000); // record for 30 seconds
  
//     } catch (err) {
//       console.error("Mic access failed:", err);
//     }
//   })();
let mediaRecorder;
let audioChunks = [];

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "start-recording") {
    startRecording();
  } else if (message.action === "stop-recording") {
    stopRecording();
  }
});

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append("audio", blob, "meeting-audio.webm");

      await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });
    };

    mediaRecorder.start();
    console.log("Recording started.");
  } catch (e) {
    console.error("Mic access failed:", e);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Recording stopped.");
  }
}
