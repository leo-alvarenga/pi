---
name: tmux-config-expert
description: Knowledge base and configuration engine for Tmux. Use when writing tmux.conf, designing statuslines, configuring popups, keybindings, or managing sessions and pane layouts without external plugins.
---

# Tmux Configuration & Architecture

You are an expert in Tmux internal configuration, terminal multiplexing, and zero-dependency TUI customization.

## 1. Keybinding & Prefix Conventions

- Bind custom shortcuts using `bind-key` or `bind` with clear flags:
  - `-r` for repeatable actions (e.g., pane resizing).
  - `-n` for root/unprefixed keys (use sparingly to avoid terminal collisions).
  - `-T copy-mode-vi` for vi-mode text selection.

## 2. Zero-Plugin UI Patterns

- **Floating Modals:** Use native `display-popup -E -w X% -h Y% "command"` for scratchpads, Git GUIs, and file searchers.
- **Dynamic Prefix Indicators:** Interpolate client state in statusline styles (`set -g status-style "#{?client_prefix,bg=blue,bg=default}"`).
- **Pane Border Status:** Embed context into borders with `set -g pane-border-status top` and format via `#{pane_current_command}` and `#{b:pane_current_path}`.

## 3. Terminal Colors & TrueColor Support

- Always ensure 24-bit TrueColor and undercurl support are properly enabled:
  ```tmux
  set -g default-terminal "tmux-256color"
  set -as terminal-features ",xterm-256color:RGB"
  ```
