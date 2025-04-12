const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.transcribeAudio = (audioPath) => {
  return new Promise((resolve, reject) => {
    const pyScript = path.join(__dirname, 'transcribe.py');

    exec(`python3 ${pyScript} "${audioPath}"`, (error, stdout, stderr) => {
      if (error) return reject(stderr || error);
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        reject('Failed to parse Python output');
      }
    });
  });
};
