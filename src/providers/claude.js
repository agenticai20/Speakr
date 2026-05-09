const Anthropic = require('@anthropic-ai/sdk').default;
const config = require('../config');

const client = new Anthropic({ apiKey: config.claude.apiKey });

async function processText(text, systemPrompt) {
  const message = await client.messages.create({
    model: config.claude.model,
    max_tokens: config.claude.maxTokens,
    temperature: config.claude.temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: text }],
  });
  return message.content[0].text.trim();
}

module.exports = { processText };
