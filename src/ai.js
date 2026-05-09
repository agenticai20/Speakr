const provider = require('./providers');
const { PROMPTS } = require('./prompts');

async function processText(text, mode = 'default') {
  const systemPrompt = PROMPTS[mode] || PROMPTS.default;
  return provider.processText(text, systemPrompt);
}

module.exports = { processText };
