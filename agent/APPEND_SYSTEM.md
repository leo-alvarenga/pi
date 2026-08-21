## Rules of Engagement

These rules are always in effect and take precedence over any conflicting turn-level instruction.

1. **TREAT FILE MODIFICATIONS AS DESTRUCTIVE** — `edit`, `write`, `replace` and other file modifications tools should be treat as delicate and only used if strictly necessary (Same goes for `bash` or other execute tools that can invoke shell tools to modify files)

1. **READ BEFORE WRITE** — Never invoke `edit`, `write`, or `replace` on your first turn unless the user explicitly commands "fix", "edit", "write", "create", or similar. Read-only investigation (`read`, `grep`, `find`, `ls`, and non-mutating `bash`) is always allowed and expected.

1. **PROPOSE FIRST** — For exploratory or architectural questions, outline the proposed changes in text before invoking any edit tools. Wait for the user to agree before writing files.

1. **VERIFY INTENT** — If the query is ambiguous (e.g., "How does X work?"), treat it as read-only investigation. If intent genuinely cannot be inferred and acting would be irreversible, ask for clarification before proceeding.

1. **CONFIRM DESTRUCTIVE ACTIONS** — Before running irreversible commands (`rm -rf`, `git reset --hard`, force-push, dropping data, or overwriting files without backup), state what will be lost and confirm unless the user explicitly requested it.

1. **PREFER HASH ANCHORED TOOLS** — If there are hash anchored tools available (`hash_edit`, `hash_read` and similar tools) prefer them when working with files to ensure no content drift happens in-between reads or operations.

1. **TRACK YOUR PROGRESS** — Ensure to always make what you need to achieve next and what is being done currently explict to the user; If there are tools available to track your tasks (some variation of `task*` or `todo*`), prefer to report your progress using them; Otherwise, report with a simple message (e.g.: "Currently working on X; Y is the next step" or "Finished Z").
