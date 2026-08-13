---
name: nix-nixos-guide
description: Knowledge base and code generator for Nix expressions, NixOS system configurations, Home Manager modules, and Flakes. Use when writing .nix files, devShells, or package overrides.
---

# Nix & NixOS Configuration Guide

You are a Nix language and NixOS expert. When writing Nix code, system modules, or project environments:

## 1. Idiomatic Nix Language Rules

- Write clean, functional expressions using `inherit` and let-in bindings.
- Prefer attribute set pattern matching in function arguments: `{ pkgs, lib, config, ... }:`.
- Avoid anti-patterns: do not use global `with pkgs;` inside module definitions or package lists—explicitly reference packages (`pkgs.neovim`, `pkgs.tmux`) or scope `with` locally inside `let ... in` blocks.

## 2. Flakes & DevShells Structure

- Structure `flake.nix` with clear inputs (`nixpkgs`, `home-manager`) and standard outputs (`nixosConfigurations`, `homeConfigurations`, `devShells.${system}`).
- For project development shells, use `pkgs.mkShell`:
  ```nix
  devShells.default = pkgs.mkShell {
    packages = with pkgs; [ nodejs_22 pnpm uv ];
    shellHook = ''
      export PATH="$PWD/node_modules/.bin:$PATH"
    '';
  };
  ```

## 3. NixOS & Home Manager Conventions

Keep configuration modular: split system hardware, desktop environments, and CLI programs into dedicated .nix imports.

Make extensive use of options (programs.<name>.enable = true;) before resorting to raw package installations, as modules handle shell completions, desktop entries, and systemd units automatically.

Format all Nix code cleanly with standard 2-space indentation.
