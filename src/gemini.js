const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

if (!config.gemini.apiKey) {
  console.error('GEMINI_API_KEY is not set. Add it to .env or export it in your shell.');
  console.error('Get a free key at https://aistudio.google.com');
  process.exit(1);
}

module.exports = new GoogleGenerativeAI(config.gemini.apiKey);
