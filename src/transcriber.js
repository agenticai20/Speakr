const path = require('path');
const { execFile } = require('child_process');

const WHISPER_BIN = path.join(
  __dirname,
  '../node_modules/nodejs-whisper/cpp/whisper.cpp/build/bin/whisper-cli'
);
const WHISPER_MODEL = path.join(
  __dirname,
  '../node_modules/nodejs-whisper/cpp/whisper.cpp/models/ggml-base.en.bin'
);

// Strip whisper timestamp prefix: "[00:00:00.000 --> 00:00:05.000]  text"
const TIMESTAMP_RE = /^\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]\s*/;

function parseTranscript(raw) {
  return raw
    .split('\n')
    .map((line) => line.replace(TIMESTAMP_RE, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

function transcribe(audioFilePath) {
  return new Promise((resolve, reject) => {
    execFile(
      WHISPER_BIN,
      ['-m', WHISPER_MODEL, '-f', audioFilePath, '-nt'],
      { timeout: 30000 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));
        resolve(parseTranscript(stdout));
      }
    );
  });
}

module.exports = { transcribe };
