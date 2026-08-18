#!/usr/bin/env node
/**
 * Kontrastprüfung nach WCAG 2.2.
 *
 * Prüft die tragenden Farbpaare beider Themes gegen die Schwellen
 *   4.5:1  Fliesstext (1.4.3, Level AA)
 *   3.0:1  Grossschrift und Bedienelementgrenzen (1.4.11)
 *
 * Die Werte kommen aus dist/tokens/kd-tokens.json, nicht aus einer
 * Handliste — die Prüfung veraltet damit nicht.
 *
 * Aufruf: node scripts/contrast.mjs [--markdown]
 */
import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(ROOT, 'dist', 'tokens', 'kd-tokens.json'), 'utf8'));

// Die JSON-Ausgabe stellt jeder Kennung die Schicht voran; hier interessiert
// nur der Pfad innerhalb der Schicht.
const strip = id => id.replace(/^(ref|sys|cmp)\./, '');

const byId = new Map();
for (const tier of ['ref', 'sys', 'cmp']) {
	for (const token of data.tiers[tier]) byId.set(strip(token.id), token.resolved);
}
const darkById = new Map(data.tiers.sysDark.map(token => [strip(token.id), token.resolved]));

function value(id, dark) {
	const found = dark && darkById.has(id) ? darkById.get(id) : byId.get(id);
	if (!found) throw new Error(`Unbekanntes Token in der Kontrastliste: ${id}`);
	return found;
}

function parse(color) {
	const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hex) {
		const raw = hex[1].length === 3 ? hex[1].replace(/./g, c => c + c) : hex[1];
		return [0, 2, 4].map(i => parseInt(raw.slice(i, i + 2), 16));
	}
	const rgb = color.trim().match(/^rgba?\(([^)]+)\)$/i);
	if (rgb) {
		const parts = rgb[1].split(',').map(p => parseFloat(p));
		return [parts[0], parts[1], parts[2], parts[3] ?? 1];
	}
	return null;
}

/** Halbtransparente Farbe über einem bekannten Grund zusammenrechnen. */
function flatten(color, backdrop) {
	const front = parse(color);
	const back = parse(backdrop);
	if (!front || !back) return null;
	const alpha = front[3] ?? 1;
	if (alpha === 1) return front.slice(0, 3);
	return [0, 1, 2].map(i => front[i] * alpha + back[i] * (1 - alpha));
}

function luminance([r, g, b]) {
	const channel = v => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(foreground, background) {
	const a = luminance(foreground);
	const b = luminance(background);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** [Beschriftung, Vordergrund-Token, Hintergrund-Token, Schwelle] */
const PAIRS = [
	['Fliesstext auf Seitenhintergrund', 'color.fg.default', 'color.bg.canvas', 4.5],
	['Sekundärtext auf Seitenhintergrund', 'color.fg.muted', 'color.bg.canvas', 4.5],
	['Metatext auf Seitenhintergrund', 'color.fg.subtle', 'color.bg.canvas', 4.5],
	['Fliesstext auf ruhiger Fläche', 'color.fg.default', 'color.bg.subtle', 4.5],
	['Link auf Seitenhintergrund', 'color.link.default', 'color.bg.canvas', 4.5],
	['Link auf ruhiger Fläche', 'color.link.default', 'color.bg.subtle', 4.5],
	['Beschriftung gefüllter Button', 'color.action.primary-fg', 'color.action.primary-bg', 4.5],
	['Rand sekundärer Button', 'color.action.secondary-border', 'color.bg.canvas', 3],
	['Text auf dunklem Band', 'color.fg.inverse', 'color.bg.inverse', 4.5],
	['Fokusring auf Seitenhintergrund', 'color.focus.ring', 'color.bg.canvas', 3],
	['Fokusring auf dunklem Band', 'color.focus.ring', 'color.bg.inverse', 3],
	['Feldrand auf Seitenhintergrund', 'color.border.interactive', 'color.bg.canvas', 3],
	['Fehlertext auf Seitenhintergrund', 'color.status.danger-accent', 'color.bg.canvas', 4.5],
	['Hinweistext im Infobanner', 'color.status.info-fg', 'color.status.info-bg', 4.5],
	['Hinweistext im Erfolgsbanner', 'color.status.success-fg', 'color.status.success-bg', 4.5],
	['Hinweistext im Warnbanner', 'color.status.warning-fg', 'color.status.warning-bg', 4.5],
	['Hinweistext im Fehlerbanner', 'color.status.danger-fg', 'color.status.danger-bg', 4.5]
];

const results = [];
for (const dark of [false, true]) {
	const canvas = value('color.bg.canvas', dark);
	for (const [label, fgId, bgId, threshold] of PAIRS) {
		const bg = flatten(value(bgId, dark), canvas);
		const fg = flatten(value(fgId, dark), value(bgId, dark).includes('rgba') ? canvas : value(bgId, dark));
		if (!fg || !bg) continue;
		const contrast = ratio(fg, bg);
		results.push({
			theme: dark ? 'dark' : 'light',
			label,
			pair: `${fgId} / ${bgId}`,
			contrast: Math.round(contrast * 100) / 100,
			threshold,
			pass: contrast + 0.005 >= threshold
		});
	}
}

if (process.argv.includes('--markdown')) {
	console.log('| Theme | Paar | Kontrast | Schwelle | Ergebnis |');
	console.log('|---|---|---:|---:|---|');
	for (const r of results) {
		console.log(
			`| ${r.theme} | ${r.label} | ${r.contrast.toFixed(2)}:1 | ${r.threshold}:1 | ${r.pass ? 'erfüllt' : 'VERFEHLT'} |`
		);
	}
} else {
	for (const r of results) {
		const mark = r.pass ? 'ok  ' : 'FEHL';
		console.log(`  ${mark} [${r.theme}] ${r.label}: ${r.contrast.toFixed(2)}:1 (min ${r.threshold}:1)`);
	}
}

const failed = results.filter(r => !r.pass);
if (failed.length) {
	console.error(`\n${failed.length} Farbpaar(e) unter der Schwelle.`);
	process.exit(1);
}
