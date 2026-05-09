const { execFileSync, execSync } = require('child_process');

async function typeText(text) {
  execFileSync('pbcopy', [], { input: text });
  await new Promise((r) => setTimeout(r, 120));
  execSync(`osascript -e 'tell application "System Events" to keystroke "v" using command down'`);
}

module.exports = { typeText };
