require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

module.exports = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash-lite',
    temperature: 0.1,
    maxTokens: 1500,
  },
  recording: {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
    tempFile: '/tmp/speakr_recording.wav',
  },
};
