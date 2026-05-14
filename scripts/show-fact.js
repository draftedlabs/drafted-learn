#!/usr/bin/env node
'use strict';
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get terminal width — works even when stdout/stderr are redirected
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

const label = `FACT #${fact.id}: ${fact.category.toUpperCase().replace(/_/g, ' ')}`;
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

const lines = [top, catRow, div, empty, ...rows, empty, ctaRow, bot];

const RESET  = '\x1b[0m';
const CYAN   = '\x1b[96m';
const YELLOW = '\x1b[93m';
const DIM    = '\x1b[2m';

function colorLine(l, i) {
  if (i === 0 || i === lines.length - 1) return CYAN + l + RESET;
  if (i === 1) return YELLOW + l + RESET;
  if (i === 2) return CYAN + l + RESET;
  if (l.includes('joindrafted')) return DIM + l + RESET;
  return l;
}

const tty = fs.createWriteStream('/dev/tty');
tty.write('\n');
lines.forEach((l, i) => tty.write(INDENT + colorLine(l, i) + '\n'));
tty.write('\n\n\n');
tty.end();
