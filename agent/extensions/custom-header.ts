import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const logo = ["█████████", "███   ███", "██████  ███", "██      ███"];

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    if (ctx.hasUI) {
      ctx.ui.setHeader((_tui, theme) => {
        return {
          render(): string[] {
            return [
              ...logo.map((line) => theme.fg("accent", line)),
              "",
              theme.fg("accent", "  hi, let's build something"),
              theme.fg("muted", "  type /hotkeys for shortcuts"),
              "",
            ];
          },
          invalidate() {},
        };
      });
    }
  });
}
