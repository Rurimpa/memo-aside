#!/usr/bin/env node
// =============================================================
// memo-capture.js  (memo-aside plugin)
//   UserPromptSubmit hook. Runs each time you press Enter, before Claude reads the prompt.
//
// What it does:
//   Only when the prompt starts with "memo:" / "メモ：" (see HEAD below), it appends the
//   prompt to a local file and stops the prompt there (decision: block), so Claude never
//   sees it and the current task is not interrupted.
//   For every other prompt it prints nothing and exits, so the conversation is unchanged.
//
// Where memos go:
//   ${CLAUDE_PLUGIN_DATA}/memos.jsonl  (kept across plugin updates; nothing is sent anywhere)
//   One line = {"at": local time with offset, "cwd": folder of the session, "text": memo}
//
// If the file can't be written, the prompt is still stopped and the memo text is shown
// on screen so it is not lost.
// =============================================================

const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = process.env.CLAUDE_PLUGIN_DATA
  || path.join(os.homedir(), '.claude', 'plugins', 'data', 'memo-aside');
const INBOX = path.join(DATA_DIR, 'memos.jsonl');

// Prompts that start with "memo" / "メモ" / "めも" followed by a colon or semicolon
// (full-width or half-width). Leading spaces are ignored. Case-insensitive for "memo".
// Semicolons are accepted because they sit next to the colon on many keyboards.
const HEAD = /^\s*(memo|メモ|めも)\s*[:：;；]\s*/i;

function localNow() {
  const d = new Date();
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const local = new Date(d.getTime() + off * 60000).toISOString().slice(0, 19);
  return `${local}${sign}${pad(off / 60)}:${pad(off % 60)}`;
}

function reply(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch (e) { process.exit(0); }
  const prompt = (input && typeof input.prompt === 'string') ? input.prompt : '';
  const m = prompt.match(HEAD);
  if (!m) process.exit(0); // not a memo: do nothing

  const text = prompt.slice(m[0].length).trim();
  if (!text) {
    reply('The memo was empty. Write something after "memo:". / メモの中身が空でした。「メモ：」のあとに書いて送ってください。');
    process.exit(0);
  }

  const rec = { at: localNow(), cwd: (input && input.cwd) || '', text };
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(INBOX, JSON.stringify(rec) + '\n', 'utf8');
    reply(`Memo saved (not sent to Claude): ${text} / メモを受け取りました（Claude には渡していません）`);
  } catch (e) {
    reply(`Could not save the memo (${String(e && e.message)}). Here it is so it is not lost: ${text} / メモを保存できませんでした。消えないよう本文をここに出します。`);
  }
  process.exit(0);
});
