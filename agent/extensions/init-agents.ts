/**
 * /init — create or refresh AGENTS.md at the repo root.
 * Ponytail-style: cover repo + sub repos in broad strokes, leverage
 * human-facing docs, duplicate nothing
 *
 * Resolves the real git root (not just cwd) and passes the remote URL
 * so the model can name/scope the repo correctly
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const PROMPT = `TASK: create AGENTS.md at the repo root. Overwrite any existing file — this is a full rewrite. Scope: THIS repo + ALL sub repos, broad strokes, everything, nothing deep.

DOC LADDER — stop at the first rung that holds:
1. Already written in human docs (README*, docs/, CONTRIBUTING, wiki)? POINT at it. Never restate it.
2. Obvious from the code (structure, entry points, dirs)? Skip it or one line.
3. Only write what an agent needs and can't get elsewhere: purpose, build/test/run commands, wiring, conventions, gotchas, decisions, repo map.

RULES:
- Human-facing docs are the source of truth. Leverage them freely by reading; DUPLICATE nothing into this file.
- Every repo: name, location, purpose, key commands, notable structure. Submodules: one line each, plus how they relate to the root.
- Terse. Bullets. No prose, no welcome, no boilerplate, no filler.
- Broad strokes: cover the whole thing, deep-dive nothing.
- Short enough that an agent will actually read all of it.`;

export default function (pi: ExtensionAPI) {
  pi.registerCommand("init", {
    description: "Create or refresh AGENTS.md for this repo (+ submodules)",
    handler: async (args, ctx) => {
      // Resolve the real git root + remote identity (fall back to cwd).
      let root = ctx.cwd;
      let remote: string | undefined;
      try {
        const res = await pi.exec(
          "git",
          ["-C", ctx.cwd, "rev-parse", "--show-toplevel"],
          {
            timeout: 3000,
          },
        );

        if (res.code === 0 && res.stdout.trim()) root = res.stdout.trim();
      } catch {
        // not a git repo — keep cwd
      }

      try {
        const res = await pi.exec(
          "git",
          ["-C", root, "config", "--get", "remote.origin.url"],
          {
            timeout: 3000,
          },
        );
        if (res.code === 0 && res.stdout.trim()) remote = res.stdout.trim();
      } catch {
        // no remote — fine, prompt just omits the name
      }

      const target = path.join(root, "AGENTS.md");
      const exists = fs.existsSync(target);

      if (exists) {
        if (!ctx.hasUI) return;

        const edit = await ctx.ui.confirm(
          "Edit AGENTS.md?",
          `${target} already exists.\nRegenerate it (full rewrite)?`,
        );

        if (!edit) {
          ctx.ui.notify("Aborted — AGENTS.md left untouched.", "info");
          return;
        }
      }

      const meta = [
        `Repo identity: ${remote ? remote.replace(/\.git$/, "") : path.basename(root)}`,
        `Repo root: ${root}`,
      ].join("\n");

      const extra = args?.trim();
      const body = extra ? `${PROMPT}\n\nUSER ADDITION: ${extra}` : PROMPT;

      pi.sendUserMessage(`${meta}\n\n${body}`);

      if (ctx.hasUI) {
        ctx.ui.notify(
          exists ? "Refreshing AGENTS.md…" : "Creating AGENTS.md…",
          "info",
        );
      }
    },
  });
}
