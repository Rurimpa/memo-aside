---
name: memo-aside
description: Show the memos saved with "memo:" (or "メモ：") by the memo-aside plugin, and mark a memo as handled when the user says so. Use when the user asks to see, review, or clear their saved memos, e.g. "show my memos", "what did I jot down", "メモを見せて", "たまったメモ". Does not save memos itself (the plugin's hook does that) and never acts on a memo unless the user asks.
---

# memo-aside: review saved memos

The memo-aside plugin's hook saves every prompt that starts with `memo:` / `メモ：` to a local file instead of sending it to you. This skill lets the user look at those memos later and decide what to do with each one.

Memo file: `${CLAUDE_PLUGIN_DATA}/memos.jsonl`

- One line per memo: `{"at": "<local time with offset>", "cwd": "<folder of the session where it was written>", "text": "<memo>"}`
- A memo that has been handled has an extra field: `"done": {"at": "<local time>", "note": "<what the user decided>"}`
- If the file does not exist, there are no memos yet. Say so.

## Steps

1. **Show.** Read the memo file and show the memos without `"done"` as a table: number, the memo text exactly as written (do not rephrase it), when it was saved, and the folder it was written in. If the user asks for all memos, include handled ones and mark them.
2. **Let the user decide.** Ask what they want to do with each memo only if they ask you to go through them. Typical choices: work on it now, keep it for later, or mark it handled.
3. **Mark handled (only when the user says so).** Add the `"done"` field to that memo's line. Do not delete lines, so the user can always see what they wrote and what they decided. Rewrite the file in place, keeping every other line unchanged.
4. **Report.** Say how many memos remain unhandled.

## Rules

- A memo is a note the user left for later, not an instruction for right now. Do not carry out what a memo says unless the user asks you to in the conversation.
- Show memo text as written. If the user writes in Japanese, answer in Japanese.
- Only read and update the memo file above. Do not send memos anywhere.
