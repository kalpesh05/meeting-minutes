const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require("fs");

require('dotenv').config();

const { transcribeAudio } = require('./whisper');
const { summarizeText } = require('./summarizer');

const app = express();
app.use(cors());
app.use(express.json());


// Ensure upload folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
console.log(":: uploadDir", uploadDir)

// Use disk storage (not memory!)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `meeting-${Date.now()}.webm`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    console.log("📦 req.file:", req.file, !req.file || !req.file.originalname);

    if (!req.file || !req.file.filename) {
      console.log("📦 req.file:", req.file, req.file, req.file.filename);

      return res.status(400).json({ error: "No file or filename missing" });
    }

    // Manually build full path
    const filePath = path.join(uploadDir, req.file.filename);
    console.log("✅ File saved to:", filePath);
    // res.json({
    //   success: true,
    //   filename: req.file.filename,
    //   path: filePath
    // });
    // const filePath = path.join(__dirname, req.file.path);
    const transcript = await transcribeAudio(filePath);
    const summary = await summarizeText(transcript);
console.log(":: ======================================>", { transcript, summary })
    res.json({ transcript, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

