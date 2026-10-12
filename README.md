# Memo Aside

Jot down a passing thought while Claude Code is working, without interrupting it.

While you work, you sometimes remember something small you want to do later. Typing it into the current session would pull Claude away from the task at hand. With this plugin, start the prompt with `memo:` and it is saved to a file on your computer instead of being sent to Claude. Later, ask "show my memos" to review them.

## How to use

1. Type a prompt that starts with `memo:` (Japanese `メモ：` / `めも：` also work, with a full-width or half-width colon or semicolon) and press Enter.
   - Example: `memo: check whether the backup script still runs on Fridays`
   - You will see `Memo saved (not sent to Claude)`. Claude does not receive it, so the current task continues untouched.
2. When you have time, ask Claude to review them:
   - "show my memos"
   - "what did I jot down today?"
   - "mark memo 2 as done"

Prompts that do not start with `memo:` are not touched at all.

## What it runs, stores, and sends

- **Runs:** one `UserPromptSubmit` hook (`hooks/memo-capture.js`, Node.js) on each prompt you send. It only reads the prompt text and the session's working folder.
- **Stores:** memos are appended to `memos.jsonl` in the plugin's data folder (`~/.claude/plugins/data/<plugin id>/`). Each line holds the time, the working folder, and the memo text. Nothing else from the conversation is saved.
- **Sends:** nothing. The plugin makes no network requests. The skill only reads and updates that one file.
- Uninstalling the plugin deletes the data folder by default (see `claude plugin uninstall --keep-data` to keep it).

## Known limitations

- **The blocked prompt stays in the input box.** Claude Code puts a blocked prompt back into the input field. Clear it before typing your next prompt (in Claude Code's input box, Ctrl+U clears the line); otherwise the next text is appended to the memo line.
- **Prompts sent while Claude is busy** are queued and passed on later. Whether the hook catches a queued `memo:` prompt has not been tested yet.
- The hook works in Claude Code. In apps that do not run plugin hooks, `memo:` prompts are sent to Claude as usual.
- Requires Node.js (it comes with Claude Code's usual setup on most systems; if `node` is not on your PATH, the hook does nothing).

## 日本語

作業中にふと思い出した「ちょっとやりたいこと」を、Claude の作業を止めずに書き留めるためのプラグインです。

- 「メモ：〇〇」と送ると、その文は Claude に渡らず、お使いの PC の中のファイル（プラグインのデータフォルダの `memos.jsonl`）にたまります。「メモ：」で始まらない文には、何もしません。
- あとで「メモを見せて」と頼むと、たまったメモを一覧で見られます。「2番は済み」と言えば、済みの印が付きます（行は消えません）。
- インターネットへは何も送りません。
- 送った「メモ：」の文は入力欄に残ります。次の文を打つ前に消してください（Claude Code の入力欄では Ctrl+U で消せます）。
- Claude が作業している最中に送った「メモ：」の文を受け取れるかは、まだ試していません。
- 動くのは Claude Code の中だけです。Node.js が要ります（`node` が見つからないときは何もしません）。

## Questions and issues

Issues are welcome, but replies are not guaranteed. The author may answer in their own words, or may not answer at all.

GitHub の issue（質問・不具合の知らせ）は歓迎しますが、返事をお約束はできません。作者が自分の言葉で返事をすることもあれば、返事をしないこともあります。

## Author

Author: Rurimpa

## License

MIT. See `LICENSE`.
