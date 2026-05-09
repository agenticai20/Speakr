const config = require('../config');

const PROVIDERS = {
  groq: () => require('./groq'),
  gemini: () => require('./gemini'),
  claude: () => require('./claude'),
};

const name = config.activeProvider;

if (!PROVIDERS[name]) {
  throw new Error(
    `Unknown AI_PROVIDER "${name}". Valid options: ${Object.keys(PROVIDERS).join(', ')}`
  );
}

module.exports = PROVIDERS[name]();
