const { GlobalKeyboardListener } = require('node-global-key-listener');

// Combo: hold Right Option + press Right Shift to toggle recording
const DEBOUNCE_MS = 400;

let listener = null;

function setupHotkey(onPress, onRelease) {
  let recording = false;
  let lastFired = 0;
  let rightAltDown = false;

  listener = new GlobalKeyboardListener();

  listener.addListener((event) => {
    if (event.name === 'RIGHT ALT') {
      rightAltDown = event.state === 'DOWN';
      return;
    }

    if (event.name !== 'RIGHT SHIFT' || event.state !== 'DOWN') return;
    if (!rightAltDown) return;

    const now = Date.now();
    if (now - lastFired < DEBOUNCE_MS) return;
    lastFired = now;

    if (!recording) {
      recording = true;
      onPress();
    } else {
      recording = false;
      onRelease();
    }
  });
}

function cleanup() {
  if (listener) listener.kill();
}

module.exports = { setupHotkey, cleanup };
