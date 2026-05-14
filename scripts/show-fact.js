#!/usr/bin/env node
'use strict';
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function terminalWidth() {
  if (process.stdout.columns) return process.stdout.columns;
  if (process.stderr.columns) return process.stderr.columns;
  try { return parseInt(execSync('tput cols 2>/dev/tty', { encoding: 'utf8' }).trim(), 10); } catch {}
  try { return parseInt(execSync('stty size 2>/dev/tty', { encoding: 'utf8' }).trim().split(' ')[1], 10); } catch {}
  return 80;
}

const INDENT = '  ';
const cols  = Math.max(40, Math.min(terminalWidth() - INDENT.length - 2, 120));
const WIDTH = cols;
const inner = WIDTH - 4;

const factsPath = path.join(__dirname, '..', 'data', 'ai-facts.json');
const { facts } = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
const fact = facts[Math.floor(Math.random() * facts.length)];

const label     = `DRAFTED FACT #${fact.id}: ${fact.category.toUpperCase().replace(/_/g, ' ')}`;
const LINK_TEXT = 'joindrafted.com/student';
const LINK      = `\x1b]8;;https://joindrafted.com/student\x1b\\${LINK_TEXT}\x1b]8;;\x1b\\`;
const CTA_TEXT  = `Learn more at ${LINK_TEXT}`;
const cta       = `Learn more at ${LINK}`;

function wrap(str, max) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if (line.length > 0 && (line + w).length > max) {
      lines.push(line.trimEnd());
      line = '';
    }
    line += w + ' ';
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

function pad(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

const textLines = wrap(fact.text, inner);

const top    = `╔${'═'.repeat(WIDTH - 2)}╗`;
const catRow = `║ ${pad(label, WIDTH - 4)} ║`;
const div    = `╠${'═'.repeat(WIDTH - 2)}╣`;
const empty  = `║${' '.repeat(WIDTH - 2)}║`;
const rows   = textLines.map(l => `║ ${pad(l, WIDTH - 4)} ║`);
const ctaRow = `║ ${cta}${' '.repeat(Math.max(0, WIDTH - 4 - CTA_TEXT.length))} ║`;
const bot    = `╚${'═'.repeat(WIDTH - 2)}╝`;

const staticLines = [top, catRow, div, empty, ...rows, empty, ctaRow, bot];

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[92m';
const YELLOW = '\x1b[93m';
const DIM    = '\x1b[2m';
const UP     = (n) => `\x1b[${n}A`;
const COL0   = '\x1b[0G';

function colorLine(l, i, total) {
  if (i === 0 || i === total - 1) return GREEN + l + RESET;
  if (i === 1) return YELLOW + l + RESET;
  if (i === 2) return GREEN + l + RESET;
  if (l.includes('joindrafted')) return DIM + l + RESET;
  return l;
}

const SPINNER_FRAMES = ['|', '/', '-', '\\'];
const SPIN_DURATION  = 2000; // ms
const SPIN_INTERVAL  = 80;   // ms per frame

let tty = null;
let hasTty = false;
try {
  tty = fs.openSync('/dev/tty', 'w');
  hasTty = true;
} catch {
  // /dev/tty unavailable (e.g. Claude Code hook subprocess) — fall back to stderr
}

function write(str) {
  if (hasTty) {
    fs.writeSync(tty, str);
  } else {
    process.stderr.write(str);
  }
}

// Print the box
write('\n');
staticLines.forEach((l, i) => write(INDENT + colorLine(l, i, staticLines.length) + '\n'));

if (!hasTty) {
  // No real tty — can't do cursor tricks, just print a trailing newline and exit
  write('\n');
  process.exit(0);
}

// Spin the spinner inside the category row, right after the label text
const totalLines = staticLines.length;
write(UP(totalLines - 1)); // go back to catRow (line index 1)

let frame = 0;
const spinnerCol = INDENT.length + label.length + 3; // right after "║ <label> "

function drawFrame() {
  write(`${COL0}\x1b[${spinnerCol}G${GREEN}${SPINNER_FRAMES[frame % SPINNER_FRAMES.length]}${RESET}`);
  frame++;
}

drawFrame();

const interval = setInterval(drawFrame, SPIN_INTERVAL);

setTimeout(() => {
  clearInterval(interval);
  write(`${COL0}\x1b[${spinnerCol}G `);
  write(`\x1b[${totalLines - 2}B\n`);
  write('\n\n\n\n\n\n');
  fs.closeSync(tty);
}, SPIN_DURATION);
