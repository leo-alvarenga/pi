# pi

My personal [pi](https://github.com/earendil-works/pi) coding-agent setup, used at work and for personal projects.

## Requirements

- [pi coding agent](https://github.com/earendil-works/pi)
- Node.js + npm (for the npm package dependencies)

## Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/leo-alvarenga/pi.git
   cd pi
   ```

2. Link (or copy) the config into your pi home directory:

   ```bash
   ln -s "$(pwd)/agent" ~/.pi/agent
   ```

   Alternatively, copy individual files into `~/.pi/agent/`.

3. Install the npm package dependencies:

   ```bash
   cd agent/npm && npm install
   ```

4. Restart pi — packages, extensions, agents, theme, and settings are picked up on startup.

## Layout

| Path                                    | Purpose                                       |
| --------------------------------------- | --------------------------------------------- |
| `agent/settings.json`                   | Global settings + `packages` list             |
| `agent/custom-agents/*.md`              | Custom agents (loaded by pi-agent-manager)    |
| `agent/themes/everforest.json`          | Active theme                                  |
| `agent/themes/kanagawa.json`            | Alternative theme                             |
| `agent/extensions/init-agents.ts`       | Adds the `/init` command (AGENTS.md)          |
| `agent/extensions/pi-rtk-optimizer/`    | Tool-output compaction config                 |
| `agent/pi-zen-frame.json`               | pi-zen-frame (TUI header/frame) config        |
| `agent/npm/package.json`                | npm package dependencies                      |

## Agents

`pi-agent-manager` provides the built-in `plan` (read + web, approve before any write/exec) and `build` (read + write, no web) agents, plus custom agents defined in `agent/custom-agents/`:

| Agent        | Permissions             | Icon | Color                | What it does                              |
| ------------ | ----------------------- | ---- | -------------------- | ----------------------------------------- |
| `codebase`   | `read`                  | ◈    | `customMessageLabel` | Read-only codebase Q&A, no web access     |
| `expert`     | `read`, `web`           | ✦    | `accent`             | General-knowledge Q&A, no commands        |
| `code-audit` | `read`, `web`, `write`  | ▲    | `error`              | Systematic code review, may run tools     |
| `guide`      | `read`, `web`, `ask`    | ▷    | `success`            | Plan-style: approves before any edit/exec |

Switch with `/agents <name>` (or `/agents` for the picker).

## Theme: Everforest (default)

`agent/themes/everforest.json` — a custom theme based on the [Everforest](https://github.com/sainnhe/everforest) palette (warm greens/grays).

`agent/themes/kanagawa.json` — alternative based on [Kanagawa](https://github.com/rebelot/kanagawa.nvim) (dark warm neutrals with blue/teal accents). To switch themes, set `"theme": "kanagawa"` in `~/.pi/agent/settings.json`.

## Extensions & packages

All packages are listed under `packages` in `agent/settings.json`:

- **pi-agent-manager** — `/agents` agent picker, hard tool guard per agent
- **pi-zen-frame** — Vim-style TUI editor wrapped in a frame/header
- **pi-subagents** — subagent workflows
- **pi-web-access** — web search/fetch tools
- **pi-rtk-optimizer** — token-saving compaction of tool output
- **pi-mono-\*** (btw, clear, ask-user-question, context, context-guard, usage) — UI and context helpers
- **extensions/init-agents.ts** — local extension adding `/init`

Other notable settings: `defaultProvider: opencode`, `defaultModel: deepseek-v4-flash-free`, `theme: everforest`, fullscreen TUI.

## License

[MIT](LICENSE)