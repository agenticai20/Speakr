# Speakr — Claude Code Project Guide

## What is Speakr
A macOS CLI tool: press a hotkey → speak → corrected text is typed into the active window.
Pipeline: **Hotkey → Record (sox) → Transcribe (Whisper local) → Format (AI provider) → Type (osascript)**

## Run it
```bash
node src/index.js
# or
npm start
```

## Hotkey
Hold **Right Option** + press **Right Shift** to start/stop recording.

## Modes (say at start of dictation)
| Say | Mode | Output |
|-----|------|--------|
| "email, ..." | email | Polished professional email with greeting + sign-off |
| "message, ..." | message | Casual Slack/Teams style |
| "note, ..." | note | Bullet points |
| _(anything else)_ | default | Grammar + spelling fix only |

---

## Project Structure

```
Speakr/
├── CLAUDE.md                  ← you are here
├── .claude/
│   └── settings.json          ← Claude Code project permissions
├── docs/
│   └── providers.md           ← provider switching & adding new providers
├── src/
│   ├── index.js               ← orchestrator (hotkey → record → transcribe → AI → type)
│   ├── config.js              ← all provider configs + recording settings
│   ├── ai.js                  ← thin wrapper: loads active provider, calls processText()
│   ├── prompts.js             ← all 4 system prompts (shared across every provider)
│   ├── preprocessor.js        ← filler word removal + mode keyword detection
│   ├── transcriber.js         ← calls whisper-cli binary via execFile (~181ms)
│   ├── recorder.js            ← sox mic recording → /tmp/speakr_recording.wav
│   ├── hotkey.js              ← node-global-key-listener (Right Opt + Right Shift)
│   ├── typer.js               ← pbcopy + osascript Cmd+V to type into active window
│   ├── gemini.js              ← legacy file (unused, kept for reference)
│   └── providers/
│       ├── index.js           ← picks provider from AI_PROVIDER env var
│       ├── groq.js            ← Groq chat completions
│       ├── gemini.js          ← Gemini generateContent
│       └── claude.js          ← Anthropic messages
├── scripts/
│   ├── debug-ngkl.js          ← test hotkey listener in isolation
│   └── test-record.js         ← test mic recording in isolation
├── .env                       ← API keys + AI_PROVIDER (not committed)
├── .env.example               ← template (committed)
└── package.json
```

---

## Switching AI Provider
One line in `.env` — no code changes:
```
AI_PROVIDER=groq      # Groq LLaMA 3.3 70B — default, free
AI_PROVIDER=gemini    # Gemini 2.0 Flash Lite — regionally blocked in some areas
AI_PROVIDER=claude    # Claude Haiku — needs ANTHROPIC_API_KEY + paid account
```

## Provider Status
| Provider | Status | Key env var | Notes |
|----------|--------|-------------|-------|
| Groq | ✅ Active | `GROQ_API_KEY` | Free, 14,400 req/day |
| Gemini | ⚠️ Blocked | `GEMINI_API_KEY` | limit=0 regionally |
| Claude | 🔑 Needs key | `ANTHROPIC_API_KEY` | Paid, ~$0.003/call |

---

## Key Files Explained

### `src/config.js`
Single source of truth for all settings. Add a new provider config block here first.

### `src/prompts.js`
All 4 system prompts live here. Edit prompts here — all providers pick them up automatically.

### `src/providers/index.js`
Reads `config.activeProvider`, requires the matching provider file. Throws a clear error for unknown providers.

### `src/transcriber.js`
Calls `whisper-cli` binary directly via Node's `execFile` (not the nodejs-whisper JS API — that has 14s overhead). Uses `ggml-base.en.bin` model (~181ms per transcription).

### `src/preprocessor.js`
Runs before AI: strips filler words (um, uh, hmm...), detects mode trigger keyword, protects `{{TOKEN}}` placeholders from being mangled.

---

## Adding a New AI Provider
1. Add config block in `src/config.js`
2. Add key to `.env` and `.env.example`
3. Create `src/providers/<name>.js` — export `async function processText(text, systemPrompt)`
4. Register it in `src/providers/index.js` PROVIDERS object
5. Update `docs/providers.md`

## Dependencies

### brew (system)
| Package | Purpose |
|---------|---------|
| `sox` | Audio recording (`rec` command) |
| `cmake` | Compiled whisper.cpp C++ binary during npm install |

### npm
| Package | Purpose |
|---------|---------|
| `nodejs-whisper` | Ships whisper.cpp source + pre-compiled `whisper-cli` binary |
| `node-global-key-listener` | System-wide hotkey (Right Opt + Right Shift) |
| `groq-sdk` | Groq API client |
| `@google/generative-ai` | Gemini API client |
| `@anthropic-ai/sdk` | Claude API client |
| `ora` | Terminal spinners |
| `dotenv` | Loads `.env` |

---

## macOS Permissions Required
- **Accessibility** — for hotkey listener and typing via osascript
  - System Settings → Privacy & Security → Accessibility → add Terminal (or iTerm)
- **Microphone** — granted on first recording attempt

## Common Issues
| Symptom | Fix |
|---------|-----|
| Hotkey not working | Add Terminal to Accessibility in System Settings |
| `sox not found` | `brew install sox` |
| Whisper binary missing | `cd node_modules/nodejs-whisper && npm run build` |
| Gemini 429 limit=0 | Regional block — switch to `AI_PROVIDER=groq` |
| `Unknown AI_PROVIDER` | Check `.env` — valid values: groq, gemini, claude |
