#!/usr/bin/env node
/**
 * Bündelt src/index.css zu dist/kd.css, indem relative @import-Zeilen
 * rekursiv eingesetzt werden. Kein Bundler, keine Abhängigkeiten —
 * die Quelldateien bleiben im Browser direkt lauffähig.
 */
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMPORT = /^@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;\s*$/;

const seen = new Set();

function inline(file) {
	const abs = resolve(file);
	if (seen.has(abs)) return `/* bereits eingebunden: ${abs.replace(ROOT, '.')} */\n`;
	if (!existsSync(abs)) throw new Error(`Import nicht gefunden: ${abs}`);
	seen.add(abs);

	const rel = abs.replace(`${ROOT}/`, '');
	const body = readFileSync(abs, 'utf8')
		.split('\n')
		.map(line => {
			const match = line.trim().match(IMPORT);
			if (!match) return line;
			const target = match[1];
			if (/^(https?:)?\/\//.test(target)) return line; // externe Imports bleiben stehen
			return inline(join(dirname(abs), target));
		})
		.join('\n');

	return `/* ===== ${rel} ===== */\n${body}\n`;
}

/** Konservative Minifizierung: Kommentare weg, Weissraum kollabiert, Strings bleiben unangetastet. */
function minify(css) {
	const strings = [];
	const masked = css.replace(/(["'])(?:[^"'\\]|\\.)*?\1/g, match => {
		strings.push(match);
		return `__KDSTR${strings.length - 1}__`;
	});
	const squeezed = masked
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\s+/g, ' ')
		.replace(/\s*([{};,>])\s*/g, '$1')
		.replace(/;}/g, '}')
		.trim();
	return squeezed.replace(/__KDSTR(\d+)__/g, (_, i) => strings[Number(i)]);
}

const bundle = inline(join(ROOT, 'src', 'index.css'));
mkdirSync(join(ROOT, 'dist'), {recursive: true});
writeFileSync(join(ROOT, 'dist', 'kd.css'), bundle);
const min = minify(bundle);
writeFileSync(join(ROOT, 'dist', 'kd.min.css'), `${min}\n`);

const kb = n => `${(n / 1024).toFixed(1)} kB`;
console.log(
	`CSS gebündelt: ${seen.size} Dateien -> dist/kd.css (${kb(bundle.length)}) · dist/kd.min.css (${kb(min.length)})`
);
