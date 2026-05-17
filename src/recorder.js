const { spawn } = require('child_process');
const config = require('./config');

let proc = null;

function startRecording() {
  return new Promise((resolve, reject) => {
    if (proc) return reject(new Error('Already recording'));

    proc = spawn('rec', [
      '-r', String(config.recording.sampleRate),
      '-c', String(config.recording.channels),
      '-b', String(config.recording.bitDepth),
      '-e', 'signed-integer',
      config.recording.tempFile,
    ]);

    proc.stderr.on('data', () => {});

    proc.on('error', (err) => {
      proc = null;
      if (err.code === 'ENOENT') {
        reject(new Error('sox not found — install with: brew install sox'));
      } else {
        reject(err);
      }
    });

    // Give sox a moment to open the mic before resolving
    setTimeout(resolve, 300);
  });
}

function stopRecording() {
  return new Promise((resolve, reject) => {
    if (!proc) return reject(new Error('Not recording'));

    const currentProc = proc;
    proc = null;

    currentProc.on('close', () => {
      resolve(config.recording.tempFile);
    });

    currentProc.kill('SIGTERM');
  });
}

function isRecording() {
  return proc !== null;
}

module.exports = { startRecording, stopRecording, isRecording };
