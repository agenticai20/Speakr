const Groq = require('groq-sdk');
const config = require('../config');

const client = new Groq({ apiKey: config.groq.apiKey });

async function processText(text, systemPrompt) {
  const completion = await client.chat.completions.create({
    model: config.groq.model,
    temperature: config.groq.temperature,
    max_tokens: config.groq.maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  });
  return completion.choices[0].message.content.trim();
}

module.exports = { processText };
