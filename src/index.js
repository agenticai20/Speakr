const ora = require('ora');
const { setupHotkey, cleanup } = require('./hotkey');
const { startRecording, stopRecording, isRecording } = require('./recorder');
const { transcribe } = require('./transcriber');
const { preProcess } = require('./preprocessor');
const { processText } = require('./ai');
const { typeText } = require('./typer');

// Gemini returns these artifacts for silent/empty audio
const SILENCE_RE = /^(\d{1,2}:\d{2}|\[silence\]|\[no speech\]|\[inaudible\]|silence)$/i;

function isSilence(text) {
  return !text || text.trim().length < 2 || SILENCE_RE.test(text.trim());
}

function printBanner() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║        Speakr — Voice to Text Pro        ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Hotkey : RightOpt + RightShift — toggle ║');
  console.log('║  Model  : Gemini Flash                   ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Modes:                                  ║');
  console.log('║    "email"    — professional email       ║');
  console.log('║    "message"  — casual team chat         ║');
  console.log('║    "note"     — bullet-point notes       ║');
  console.log('║    (default)  — grammar & spelling       ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
}

let recSpinner = null;

async function onPress() {
  try {
    await startRecording();
    recSpinner = ora({ text: 'Recording... speak now', prefixText: '●' }).start();
  } catch (err) {
    console.error('Failed to start recording:', err.message);
  }
}

async function onRelease() {
  if (!isRecording()) return;

  if (recSpinner) {
    recSpinner.succeed('Recording stopped');
    recSpinner = null;
  }

  let audioFile;
  try {
    audioFile = await stopRecording();
  } catch (err) {
    console.error('Stop recording failed:', err.message);
    return;
  }

  const transSpinner = ora('Transcribing speech...').start();
  let rawText;
  try {
    rawText = await transcribe(audioFile);
    transSpinner.succeed('Transcription done');
  } catch (err) {
    transSpinner.fail('Transcription failed: ' + err.message);
    return;
  }

  if (isSilence(rawText)) {
    console.log('  No speech detected — aborting.\n');
    showReadyPrompt();
    return;
  }

  console.log(`[raw] "${rawText}"`);

  const { text, mode } = preProcess(rawText);
  console.log(`[processed] "${text}" [mode: ${mode}]`);
  console.log('');

  const aiSpinner = ora('Improving with Gemini...').start();
  let corrected;
  try {
    corrected = await processText(text, mode);
    aiSpinner.succeed('Response ready — typing now...');
  } catch (err) {
    aiSpinner.fail('Gemini failed: ' + err.message);
    return;
  }

  const preview = corrected.length > 100 ? corrected.slice(0, 97) + '...' : corrected;
  console.log('');
  console.log(`  Result: "${preview}"`);
  console.log('');

  try {
    await typeText(corrected);
    ora('').succeed('Done!\n');
  } catch (err) {
    console.error('Paste failed:', err.message);
    console.log('Text is in your clipboard — paste manually with Cmd+V.\n');
  }

  showReadyPrompt();
}

function showReadyPrompt() {
  console.log('');
  ora({ prefixText: '○' }).stopAndPersist({
    symbol: '○',
    text: 'Ready — hold RightOpt + press RightShift to record',
  });
  console.log('');
}

function main() {
  printBanner();
  showReadyPrompt();

  setupHotkey(
    () => onPress().catch((err) => console.error('Unexpected error:', err.message)),
    () => onRelease().catch((err) => console.error('Unexpected error:', err.message)),
  );

  process.on('SIGINT', () => {
    if (recSpinner) recSpinner.stop();
    console.log('\nBye.');
    cleanup();
    process.exit(0);
  });
}

main();
