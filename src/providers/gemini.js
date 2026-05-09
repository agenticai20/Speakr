const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

async function processText(text, systemPrompt) {
  const model = genAI.getGenerativeModel({
    model: config.gemini.model,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: config.gemini.temperature,
      maxOutputTokens: config.gemini.maxTokens,
    },
  });
  const result = await model.generateContent(text);
  return result.response.text().trim();
}

module.exports = { processText };
