#!/usr/bin/env node
/**
 * Erzeugt docs/TOKENS.md aus dist/tokens/kd-tokens.json.
 * Die Tokenreferenz wird damit nie von Hand nachgeführt und kann
 * folglich auch nicht veralten.
 */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(ROOT, 'dist', 'tokens', 'kd-tokens.json'), 'utf8'));

const escape = text => String(text).replace(/\|/g, '\\|');

/** Gruppiert Tokens nach dem ersten Pfadsegment innerhalb der Schicht. */
function group(list) {
	const groups = new Map();
	for (const token of list) {
		const path = token.id.replace(/^(ref|sys|cmp)\./, '');
		const key = path.split('.')[0];
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push({...token, path});
	}
	return groups;
}

function table(tokens, {withResolved = true} = {}) {
	const head = withResolved
		? '| Token | CSS-Variable | Wert | Aufgelöst |\n|---|---|---|---|'
		: '| Token | CSS-Variable | Wert |\n|---|---|---|';
	const rows = tokens.map(token => {
		const base = `| \`${token.path}\` | \`${token.cssVariable}\` | \`${escape(token.value)}\` |`;
		return withResolved ? `${base} \`${escape(token.resolved)}\` |` : base;
	});
	return [head, ...rows].join('\n');
}

function section(title, intro, list, options) {
	const parts = [`## ${title}`, '', intro, ''];
	for (const [key, tokens] of group(list)) {
		parts.push(`### ${key}`, '', table(tokens, options), '');
	}
	return parts.join('\n');
}

let contrast = '';
try {
	contrast = execFileSync(process.execPath, [join(ROOT, 'scripts', 'contrast.mjs'), '--markdown'], {
		encoding: 'utf8'
	}).trim();
} catch (error) {
	contrast = '_Kontrastprüfung fehlgeschlagen — siehe `npm run check`._';
}

const total =
	data.tiers.ref.length + data.tiers.sys.length + data.tiers.sysDark.length + data.tiers.cmp.length;

const markdown = `# Tokenreferenz

> Generiert aus \`tokens/*.json\` durch \`npm run docs:tokens\`. Nicht von Hand bearbeiten.

${total} Tokens in drei Schichten. Die Spalte **Wert** zeigt, was in der Quelle steht
(oft ein Verweis auf eine tiefere Schicht), **Aufgelöst** den daraus folgenden Rohwert
im Standard-Skin und hellen Theme.

Regel: Komponenten referenzieren ausschliesslich Tier 2 oder Tier 3.
Ein \`var(--kd-ref-…)\` in einer Komponente ist ein Fehler, kein Kürzel.

---

${section('Tier 1 · Referenz', 'Rohwerte ohne Kontext. `brand.*` ist die Umschaltstelle für Skins: ein Skin überschreibt diese Aliase und sonst nichts.', data.tiers.ref)}

---

${section('Tier 2 · System', 'Semantische Rollen. Diese Schicht — und nur sie — kennt Hell und Dunkel.', data.tiers.sys)}

### Überschreibungen im dunklen Theme

Wirksam unter \`[data-kd-theme="dark"]\` sowie über \`prefers-color-scheme: dark\`,
sofern nicht ausdrücklich \`data-kd-theme="light"\` gesetzt ist.

${table(
	data.tiers.sysDark.map(token => ({...token, path: token.id.replace(/^sys\./, '')})),
	{withResolved: true}
)}

---

${section('Tier 3 · Komponente', 'Stellschrauben je Bauteil. Wer ein Bauteil anpassen muss, ändert hier.', data.tiers.cmp)}

---

## Kontrastnachweis

Automatisch geprüft mit \`node scripts/contrast.mjs\`; der Build bricht ab, wenn ein
Paar unter die Schwelle fällt.

${contrast}
`;

mkdirSync(join(ROOT, 'docs'), {recursive: true});
writeFileSync(join(ROOT, 'docs', 'TOKENS.md'), markdown);
console.log(`Tokenreferenz geschrieben: docs/TOKENS.md (${total} Tokens)`);
