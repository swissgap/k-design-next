#!/usr/bin/env node
/**
 * Selbstprüfung des Bundles.
 *
 *  1. Jede benutzte Custom Property muss irgendwo definiert sein.
 *  2. Keine harten Hexfarben ausserhalb der Tokenschicht.
 *  3. Klammern balanciert, keine leeren Regeln.
 *  4. Demo-Seite: Pflichtbausteine der CD-Bund-Vorgaben vorhanden.
 */
import {readFileSync, existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const notes = [];

const bundle = readFileSync(join(ROOT, 'dist', 'kd.css'), 'utf8');

/* 1 · Custom Properties ---------------------------------------------------- */

const defined = new Set([...bundle.matchAll(/(--kd-[a-z0-9-]+)\s*:/g)].map(m => m[1]));

// Eine Verwendung ohne Fallback muss aufgelöst werden koennen; mit Fallback
// ist sie eine bewusst offene Stellschraube (z. B. --kd-tilt-x aus dem JS).
const used = new Set();
const withoutFallback = new Set();
for (const match of bundle.matchAll(/var\(\s*(--kd-[a-z0-9-]+)\s*(,?)/g)) {
	used.add(match[1]);
	if (!match[2]) withoutFallback.add(match[1]);
}

const missing = [...withoutFallback].filter(name => !defined.has(name)).sort();
if (missing.length) {
	problems.push(`Nicht definierte Custom Properties (${missing.length}):\n    ${missing.join('\n    ')}`);
} else {
	notes.push(`${used.size} Custom Properties verwendet, alle definiert`);
}

/* 2 · Hartkodierte Farben -------------------------------------------------- */

const cssSources = [...new Set([...bundle.matchAll(/\/\* ===== (src\/[^ ]+) ===== \*\//g)].map(m => m[1]))];
let hardcoded = 0;
for (const rel of cssSources) {
	const file = join(ROOT, rel);
	if (!existsSync(file)) continue;
	const text = readFileSync(file, 'utf8');
	for (const [index, line] of text.split('\n').entries()) {
		if (/^\s*\/?\*/.test(line)) continue;
		if (/data:image\/svg/.test(line)) continue; // Icons als Data-URI brauchen Literale
		const hit = line.match(/#[0-9a-fA-F]{3,8}\b/);
		if (hit) {
			hardcoded += 1;
			problems.push(`Hartkodierte Farbe in ${rel}:${index + 1} -> ${hit[0]}`);
		}
	}
}
if (!hardcoded) notes.push('Keine hartkodierten Hexfarben ausserhalb der Tokenschicht');

/* 3 · Struktur ------------------------------------------------------------- */

const open = (bundle.match(/{/g) ?? []).length;
const close = (bundle.match(/}/g) ?? []).length;
if (open !== close) problems.push(`Unbalancierte Klammern: ${open} auf, ${close} zu`);
else notes.push(`Klammern balanciert (${open})`);

/* 4 · Demo-Seite gegen die CD-Bund-Pflichtpunkte --------------------------- */

const demoPath = join(ROOT, 'demo', 'index.html');
if (existsSync(demoPath)) {
	const html = readFileSync(demoPath, 'utf8');
	const requirements = [
		['lang-Attribut', /<html[^>]+lang="/],
		['Skip-Link', /kd-skip-link/],
		['Wappenschild in #ff0000', /fill="#ff0000"/i],
		['Vierzeilige Wortmarke', /Confederaziun svizra/],
		['Sprachwechsler in der Top-Bar', /kd-topbar[\s\S]{0,4000}?kd-lang/],
		['Genau ein h1', /<h1/],
		['Hauptbereich mit id', /<main[^>]+id="/],
		['Footer mit Rechtszeile', /kd-footer__legal/],
		['aria-current in der Navigation', /aria-current/],
		['Hero vorhanden', /class="[^"]*kd-hero/]
	];
	for (const [label, pattern] of requirements) {
		if (!pattern.test(html)) problems.push(`Demo-Seite: ${label} fehlt`);
	}
	const h1count = (html.match(/<h1[\s>]/g) ?? []).length;
	if (h1count !== 1) problems.push(`Demo-Seite: ${h1count} h1-Elemente, erwartet genau 1`);
	if (!problems.some(p => p.startsWith('Demo-Seite'))) {
		notes.push(`Demo-Seite erfüllt ${requirements.length} CD-Bund-Pflichtpunkte`);
	}
} else {
	notes.push('Demo-Seite nicht gefunden, Prüfung übersprungen');
}

/* Ausgabe ------------------------------------------------------------------ */

for (const note of notes) console.log(`  ok   ${note}`);
if (problems.length) {
	console.error('');
	for (const problem of problems) console.error(`  FEHLER  ${problem}`);
	process.exit(1);
}
console.log('\nPrüfung bestanden.');
