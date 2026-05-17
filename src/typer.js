const { execFileSync, execSync } = require('child_process');

async function typeText(text) {
  execFileSync('pbcopy', [], { input: text });
  await new Promise((r) => setTimeout(r, 120));
  execSync(`osascript -e 'tell application "System Events" to keystroke "v" using command down'`);
}

async function getSelectedText() {
  execSync(`osascript -e 'tell application "System Events" to keystroke "c" using command down'`);
  await new Promise((r) => setTimeout(r, 150));
  return execSync('pbpaste', { encoding: 'utf8' }).trim();
}

module.exports = { typeText, getSelectedText };
