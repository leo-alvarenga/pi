---
name: anti-llm-slop
description: Removes AI writing style and code artifacts. Use when asked to make text or code sound human, remove "AI-sounding" language, or review/rewrite AI-generated content.
---

# Anti-LLM Slop

## 1. Code comments

Write zero comments unless they explain a non-obvious why: a workaround, a perf hack, a business decision. Never write:

- Echoes of the code below (`// Increment counter`, `// Return the result`, `// Function to calculate total`)
- Section headers in small functions (`// Initialize`, `// Process data`, `// Respond`)
- Line-by-line import summaries
- Placeholder or apologetic notes (`// TODO: implement later`, `// Note: replace with your real key`)
- Decorative borders or comment ASCII art

Required comments (a11y, security, why-docs) are not slop — keep them.

## 2. Writing

- Start with the content in sentence 1. No setup sentences ("Certainly!", "Below is a breakdown...", "Let's take a look at...") or concluding summaries ("In summary...", "Overall..."). End at the last factual point or code block.
- Replace florid adjectives with concrete specifics, exact terms, or hard numbers.
- No numbered lists for simple 2-step concepts; tables only for tabular/comparative data.

### Padding detectors

Hard ban, always filler: `delve`, `tapestry`, `testament`, `beacon`, `realm`, `multifaceted`, `game-changer`, `nestled`, `in conclusion`, `it's important to remember`, `in today's fast-paced world`, `it's worth noting`, `let me walk you through`, `overall`.

Context-dependent — delete when padding, keep when the precise term: `leverage`, `robust`, `seamless`, `unlock`, `streamline`, `elevate`, `moreover`, `furthermore`, `vital`, `crucial`, `pivot`, `notably`.

## 3. Reviewing existing content

Given AI-generated text or code:

1. Purge redundant comments and padding phrases (above).
2. Strip intro and conclusion buffers.
3. Replace vagueness with concrete specifics.
4. Keep anything the user asked to keep: walkthroughs, docs, educational notes.