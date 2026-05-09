const fs = require('fs');
const genAI = require('./gemini');
const config = require('./config');

async function transcribe(audioFilePath) {
  const model = genAI.getGenerativeModel({ model: config.gemini.model });
  const base64Audio = fs.readFileSync(audioFilePath).toString('base64');

  const result = await model.generateContent([
    { inlineData: { data: base64Audio, mimeType: 'audio/wav' } },
    'Transcribe this audio exactly as spoken. Output only the transcribed text, nothing else.',
  ]);

  return result.response.text().trim();
}

module.exports = { transcribe };
