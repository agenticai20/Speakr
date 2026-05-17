const { GlobalKeyboardListener } = require('node-global-key-listener');

// Combo: hold Right Option + press Right Shift to toggle recording
// Single Key: double-tap Left Control to fix grammar of selected text
const DEBOUNCE_MS = 400;

let listener = null;

function setupHotkey(onPress, onRelease, onFixPress) {
  let recording = false;
  let lastFired = 0;
  let lastFixFired = 0;
  let lastLeftCtrlTime = 0;
  let rightAltDown = false;
  let leftCtrlDown = false;
  let rightShiftDown = false;

  listener = new GlobalKeyboardListener();

  listener.addListener((event) => {
    if (event.name === 'LEFT CTRL') {
      const isDown = event.state === 'DOWN';
      if (isDown && !leftCtrlDown) {
        leftCtrlDown = true;
        const now = Date.now();
        if (now - lastLeftCtrlTime < 350) {
          // Double tap detected
          lastLeftCtrlTime = 0;
          
          if (now - lastFixFired >= DEBOUNCE_MS) {
            lastFixFired = now;
            if (onFixPress) onFixPress();
          }
        } else {
          lastLeftCtrlTime = now;
        }
      } else if (!isDown) {
        leftCtrlDown = false;
      }
      return;
    }

    if (event.name === 'RIGHT ALT') {
      rightAltDown = event.state === 'DOWN';
      return;
    }

    if (!rightAltDown) return;

    if (event.name === 'RIGHT SHIFT') {
      const isDown = event.state === 'DOWN';
      if (isDown && !rightShiftDown) {
        rightShiftDown = true;
        const now = Date.now();
        if (now - lastFired >= DEBOUNCE_MS) {
          lastFired = now;

          if (!recording) {
            recording = true;
            onPress();
          } else {
            recording = false;
            onRelease();
          }
        }
      } else if (!isDown) {
        rightShiftDown = false;
      }
      return;
    }
  });
}

function cleanup() {
  if (listener) listener.kill();
}

module.exports = { setupHotkey, cleanup };
