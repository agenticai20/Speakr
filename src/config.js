require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

module.exports = {
  activeProvider: process.env.AI_PROVIDER || 'groq',

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    maxTokens: 1500,
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash-lite',
    temperature: 0.1,
    maxTokens: 1500,
  },

  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-haiku-4-5-20251001',
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
