const FILLER_RE = /\b(um+|uh+|hmm+|ah+|er+|like,?\s+(?=\w)|you\s+know,?\s*|sort\s+of,?\s*|kind\s+of,?\s*|basically,?\s*|literally,?\s*|i\s+mean,?\s*)\b/gi;

const MODE_TRIGGERS = [
  { mode: 'email',   regex: /^\s*email\s*(mode)?[.,!]?\s*/i },
  { mode: 'message', regex: /^\s*(message|slack|teams|chat)\s*(mode)?[.,!]?\s*/i },
  { mode: 'note',    regex: /^\s*note[s]?\s*(mode)?[.,!]?\s*/i },
];

// Voice-command tokens that must survive LLM round-trips
const TOKEN_RE = /\{\{(NEW_LINE|NEW_PARAGRAPH|ENTER|TAB)\}\}/gi;

function preProcess(rawText) {
  let text = rawText.trim();
  let mode = 'default';

  for (const trigger of MODE_TRIGGERS) {
    if (trigger.regex.test(text)) {
      mode = trigger.mode;
      text = text.replace(trigger.regex, '').trim();
      break;
    }
  }

  // Stash tokens so filler removal can't corrupt them
  const stash = [];
  text = text.replace(TOKEN_RE, (match) => {
    stash.push(match);
    return `__TOK${stash.length - 1}__`;
  });

  text = text.replace(FILLER_RE, ' ').replace(/\s{2,}/g, ' ').trim();

  stash.forEach((token, i) => {
    text = text.replace(`__TOK${i}__`, token);
  });

  return { text, mode };
}

module.exports = { preProcess };
