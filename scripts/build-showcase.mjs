#!/usr/bin/env node
/**
 * Erzeugt aus demo/index.html eine einzelne, in sich geschlossene Datei
 * (dist/showcase.html): CSS und JavaScript werden eingebettet, externe
 * Verweise bleiben nur für Google Fonts bestehen.
 *
 * Zweck: Weitergabe und Vorschau ohne Server oder Build.
 */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const html = readFileSync(join(ROOT, 'demo', 'index.html'), 'utf8');
const css = readFileSync(join(ROOT, 'dist', 'kd.css'), 'utf8');
const js = readFileSync(join(ROOT, 'js', 'kd.js'), 'utf8');

/**
 * Ein Inhalt, der wörtlich </script> oder </style> enthält (etwa in einem
 * Kommentar), würde das umschliessende Element vorzeitig schliessen.
 * Deshalb wird der schliessende Schrägstrich maskiert.
 */
const safe = text => text.replace(/<\/(script|style)/gi, '<\\/$1');

let out = html.replace(
	/<link rel="stylesheet" href="\.\.\/dist\/kd\.css"\s*\/?>/,
	() => `<style>\n${safe(css)}\n</style>`
);

out = out.replace(
	/<script src="\.\.\/js\/kd\.js" defer><\/script>/,
	() => `<script>\n${safe(js)}\n</script>`
);

if (out.includes('../dist/kd.css') || out.includes('../js/kd.js')) {
	console.error('Einbettung fehlgeschlagen: Verweise auf lokale Dateien sind geblieben.');
	process.exit(1);
}

// Genau ein style- und ein script-Element duerfen geschlossen werden.
const closings = tag => (out.match(new RegExp(`</${tag}>`, 'gi')) ?? []).length;
if (closings('style') !== 1 || closings('script') !== 1) {
	console.error(
		`Einbettung fehlgeschlagen: ${closings('style')} </style> und ${closings('script')} </script> gefunden, erwartet je 1.`
	);
	process.exit(1);
}

mkdirSync(join(ROOT, 'dist'), {recursive: true});
writeFileSync(join(ROOT, 'dist', 'showcase.html'), out);

/**
 * Zweite Ausgabe fuer Umgebungen, die den Seitenrumpf selbst stellen und das
 * Theme ueber ein eigenes Attribut am Wurzelelement setzen (data-theme).
 * Erzeugt dist/showcase.fragment.html: nur Titel, Stil, Inhalt und Skript.
 */
const fragment = out
	// Theme des Hosts an die eigene Theme-Achse anschliessen.
	.replace(/\[data-kd-theme='dark'\]/g, "[data-kd-theme='dark'], :root[data-theme='dark']")
	.replace(
		/:root:not\(\[data-kd-theme='light'\]\)/g,
		":root:not([data-kd-theme='light']):not([data-theme='light'])"
	);

const between = (text, open, close) => {
	const start = text.indexOf(open);
	const end = text.indexOf(close, start);
	if (start < 0 || end < 0) throw new Error(`Abschnitt nicht gefunden: ${open}`);
	return text.slice(start, end + close.length);
};

const bodyStart = fragment.indexOf('>', fragment.indexOf('<body')) + 1;
const bodyEnd = fragment.indexOf('</body>');
const body = fragment.slice(bodyStart, bodyEnd).trim();

const fragmentOut = [
	'<title>k-design-next</title>',
	'<link rel="preconnect" href="https://fonts.googleapis.com">',
	'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
	'<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Mono:wght@400&display=swap" rel="stylesheet">',
	between(fragment, '<style>', '</style>'),
	// Ohne Skript bleibt sonst alles verborgen, was beim Scrollen einblenden soll.
	'<script>document.documentElement.classList.add(\'kd-no-js\');</script>',
	`<div lang="de">\n${body}\n</div>`
].join('\n');

writeFileSync(join(ROOT, 'dist', 'showcase.fragment.html'), `${fragmentOut}\n`);

console.log(
	`Showcase gebaut: dist/showcase.html (${(out.length / 1024).toFixed(1)} kB) · dist/showcase.fragment.html (${(fragmentOut.length / 1024).toFixed(1)} kB)`
);
