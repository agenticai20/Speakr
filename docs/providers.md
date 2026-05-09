# Speakr — AI Provider Guide

## How to Switch Provider
Edit one line in `.env`:
```
AI_PROVIDER=groq      # or: gemini | claude
```
Restart `node src/index.js`. No code changes needed.

---

## Groq (Default ✅)

**Model:** `llama-3.3-70b-versatile`
**Cost:** Free — 14,400 requests/day, no credit card
**Speed:** ~300–600ms
**Get key:** https://console.groq.com → API Keys

```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

**When to use:** Default choice. Best price-to-quality for voice formatting tasks.

---

## Gemini ⚠️

**Model:** `gemini-2.0-flash-lite`
**Cost:** Free tier (when available)
**Speed:** ~400–800ms
**Get key:** https://aistudio.google.com
**Status:** Regionally blocked in some countries (limit=0 on free tier)

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...
```

**When to use:** If Groq is down and you have an unblocked Gemini key.
**Known issue:** All tested keys return 429 with `limit: 0` — this means the free tier is blocked regionally, not that quota is exhausted.

---

## Claude 🔑

**Model:** `claude-haiku-4-5-20251001`
**Cost:** Paid — ~$0.003 per Speakr call (0.8¢/M input, $4/M output tokens)
**Speed:** ~400–700ms
**Get key:** https://console.anthropic.com → API Keys (requires credit card)

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

**When to use:** If you need the highest output quality or Groq is unavailable.
**Note:** Claude Code VS Code/CLI uses OAuth login — that does NOT give you an API key. Keys must be created separately at console.anthropic.com.

---

## Adding a New Provider

1. **Config** — add block in `src/config.js`:
```js
newprovider: {
  apiKey: process.env.NEWPROVIDER_API_KEY,
  model: 'model-name',
  temperature: 0.1,
  maxTokens: 1500,
},
```

2. **Provider file** — create `src/providers/newprovider.js`:
```js
const Client = require('newprovider-sdk');
const config = require('../config');

const client = new Client({ apiKey: config.newprovider.apiKey });

async function processText(text, systemPrompt) {
  // call the API, return corrected text string
}

module.exports = { processText };
```

3. **Register** — add to `PROVIDERS` in `src/providers/index.js`:
```js
const PROVIDERS = {
  groq: () => require('./groq'),
  gemini: () => require('./gemini'),
  claude: () => require('./claude'),
  newprovider: () => require('./newprovider'),   // ← add this
};
```

4. **Environment** — add to `.env` and `.env.example`:
```
NEWPROVIDER_API_KEY=
```

5. **Switch** — set `AI_PROVIDER=newprovider` in `.env`

---

## Provider Comparison

| | Groq | Gemini | Claude |
|---|---|---|---|
| Cost | Free | Free* | Paid |
| Daily limit | 14,400 req | ~1,500 req* | Unlimited ($$) |
| Avg latency | 400ms | 600ms | 500ms |
| Quality | Very good | Good | Excellent |
| Regional issues | None | Yes (some) | None |
| API type | OpenAI-compat | Native SDK | Native SDK |

*Gemini free tier varies by region — may be blocked entirely.
