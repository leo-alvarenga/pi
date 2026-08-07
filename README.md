# pi-agent

My personal [pi](https://github.com/badlogic/pi-mono) setup used at work and for personal projects.

## Requirements

- [pi coding agent](https://github.com/badlogic/pi-mono)
- Node.js + npm (for the package dependencies)

## Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/leo-alvarenga/pi-agent.git
   cd pi-agent
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

4. Restart pi. The mode extension, theme, and settings are picked up on startup.

## Theme: Kanagawa

`agent/themes/kanagawa.json`: a custom theme based on the [Kanagawa](https://github.com/rebelot/kanagawa.nvim) color palette (dark, warm neutrals with blue/teal accents)

To use it:

```bash
cp agent/themes/kanagawa.json ~/.pi/agent/themes/
```

Then set `"theme": "kanagawa"` in `~/.pi/agent/settings.json`.

## Packages

All packages used in this setup are listed under `packages` key in `agent/settings.json`.

## Modes

Custom agent modes for the [pi-mode-manager](https://github.com/leo-alvarenga/pi-mode-manager) extension, defined in `agent/pi-mode-manager.json`:

| Mode         | Permissions            | Color token          | What it does                          |
| ------------ | ---------------------- | -------------------- | ------------------------------------- |
| `codebase`   | `read`                 | `customMessageLabel` | Read-only codebase Q&A, no web access |
| `expert`     | `read`, `web`          | `accent`             | General knowledge Q&A, no commands    |
| `code-audit` | `read`, `web`, `write` | `error`              | Systematic code review, may run tools |

Switch with `/mode codebase`, `/mode expert`, or `/mode code-audit`.

## License

[MIT](LICENSE)
