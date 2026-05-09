const { startRecording, stopRecording } = require('../src/recorder');
const { transcribe } = require('../src/transcriber');

const SECONDS = 5;

async function run() {
  console.log(`Recording for ${SECONDS} seconds — speak now...`);
  await startRecording();

  await new Promise((r) => setTimeout(r, SECONDS * 1000));

  console.log('Stopping...');
  const file = await stopRecording();

  console.log('Transcribing...');
  const text = await transcribe(file);

  console.log('\nResult:', text || '(nothing detected)');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
