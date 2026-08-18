#!/usr/bin/env node
/**
 * k-design-next — Token-Build
 *
 * Liest die DTCG-Tokenquellen aus tokens/ und erzeugt daraus
 *   dist/tokens/kd-tokens.css   CSS Custom Properties (Themes + Skins)
 *   dist/tokens/kd-tokens.scss  SCSS-Variablen + Map
 *   dist/tokens/kd-tokens.js    ES-Modul (var()-Referenzen)
 *   dist/tokens/kd-tokens.json  aufgelöste Rohwerte, für Doku und Design-Tools
 *
 * Bewusst ohne Abhängigkeiten: der Build muss in jeder Bundes-Umgebung
 * ohne npm-Registry-Zugriff laufen.
 */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = 'kd';
const ALIAS = /\{([a-zA-Z0-9_.-]+)\}/g;

const read = f => JSON.parse(readFileSync(join(ROOT, 'tokens', f), 'utf8'));

/** Flacht einen DTCG-Baum zu [{path, value, type, description}] ab. */
function flatten(node, path = [], out = []) {
	for (const [key, val] of Object.entries(node)) {
		if (key.startsWith('$')) continue;
		if (val && typeof val === 'object' && '$value' in val) {
			out.push({
				path: [...path, key],
				id: [...path, key].join('.'),
				value: String(val.$value),
				type: val.$type ?? 'other',
				description: val.$description ?? ''
			});
		} else if (val && typeof val === 'object') {
			flatten(val, [...path, key], out);
		}
	}
	return out;
}

const cssVar = (tier, id) => `--${PREFIX}-${tier}-${id.replace(/\./g, '-')}`;

const ref = flatten(read('ref.json'));
const sysLight = flatten(read('sys.light.json'));
const sysDark = flatten(read('sys.dark.json'));
const cmp = flatten(read('cmp.json'));
const skins = read('skins.json');

/** Pfad -> CSS-Variable. sys gewinnt vor ref, damit cmp-Aliase semantisch auflösen. */
const index = new Map();
for (const t of ref) index.set(t.id, cssVar('ref', t.id));
for (const t of sysLight) index.set(t.id, cssVar('sys', t.id));
for (const t of cmp) index.set(t.id, cssVar('cmp', t.id));

const unresolved = [];

/** Ersetzt {alias} durch var(--kd-…) und erhält damit die Kaskade (Theme/Skin). */
function toCssValue(token) {
	return token.value.replace(ALIAS, (match, id) => {
		const v = index.get(id);
		if (!v) {
			unresolved.push(`${token.id} -> {${id}}`);
			return match;
		}
		return `var(${v})`;
	});
}

/** Löst Aliase rekursiv bis zum Rohwert auf (für die JSON-/Doku-Ausgabe). */
function toRawValue(value, lookup, seen = new Set()) {
	return value.replace(ALIAS, (match, id) => {
		if (seen.has(id)) return match;
		const target = lookup.get(id);
		if (!target) return match;
		return toRawValue(target, lookup, new Set([...seen, id]));
	});
}

const declarations = list =>
	list.map(t => `\t${cssVar(t.tier, t.id)}: ${toCssValue(t)};`).join('\n');

const tag = (tier, list) => list.map(t => ({...t, tier}));

const refDecls = tag('ref', ref);
const sysLightDecls = tag('sys', sysLight);
const sysDarkDecls = tag('sys', sysDark);
const cmpDecls = tag('cmp', cmp);

/* ---------------------------------------------------------------- CSS --- */

const banner = `/**
 * k-design-next — Design Tokens
 * Generiert aus tokens/*.json. Nicht von Hand bearbeiten.
 *
 * Schichten
 *   --${PREFIX}-ref-*   Referenz  · Rohwerte, kontextfrei
 *   --${PREFIX}-sys-*   System    · semantische Rollen, Theme-abhängig
 *   --${PREFIX}-cmp-*   Komponente· Stellschrauben je Bauteil
 *
 * Themes: [data-${PREFIX}-theme="light" | "dark"] + prefers-color-scheme
 * Skins : .${PREFIX}-skin-intranet, .${PREFIX}-skin-freebrand
 */`;

const skinBlocks = Object.entries(skins)
	.filter(([k]) => !k.startsWith('$'))
	.map(([name, def]) => {
		const list = tag('ref', flatten(def));
		const selector = def.$selector ?? `.${PREFIX}-skin-${name}`;
		return `/* Skin: ${name}${def.$description ? ` — ${def.$description}` : ''} */\n${selector} {\n${declarations(list)}\n}`;
	})
	.join('\n\n');

const css = `${banner}

:root {
	color-scheme: light dark;

	/* ---- Tier 1 · Referenz ---------------------------------------- */
${declarations(refDecls)}

	/* ---- Tier 2 · System (light) ---------------------------------- */
${declarations(sysLightDecls)}

	/* ---- Tier 3 · Komponente -------------------------------------- */
${declarations(cmpDecls)}
}

/* ---- Tier 2 · System (dark) — explizite Wahl ---------------------- */
[data-${PREFIX}-theme='dark'] {
${declarations(sysDarkDecls)}
}

/* ---- Tier 2 · System (dark) — Systemeinstellung ------------------- */
@media (prefers-color-scheme: dark) {
	:root:not([data-${PREFIX}-theme='light']) {
${declarations(sysDarkDecls)}
	}
}

${skinBlocks}
`;

/* --------------------------------------------------------------- SCSS --- */

const scssLines = [...refDecls, ...sysLightDecls, ...cmpDecls].map(
	t => `$${PREFIX}-${t.tier}-${t.id.replace(/\./g, '-')}: var(${cssVar(t.tier, t.id)});`
);
const scss = `${banner}\n\n${scssLines.join('\n')}\n\n$${PREFIX}-tokens: (\n${[
	...refDecls,
	...sysLightDecls,
	...cmpDecls
]
	.map(t => `\t'${t.tier}.${t.id}': var(${cssVar(t.tier, t.id)})`)
	.join(',\n')}\n);\n`;

/* ----------------------------------------------------------------- JS --- */

const jsEntries = [...refDecls, ...sysLightDecls, ...cmpDecls]
	.map(t => `\t'${t.tier}.${t.id}': 'var(${cssVar(t.tier, t.id)})'`)
	.join(',\n');
const js = `${banner}\n\nexport const tokens = Object.freeze({\n${jsEntries}\n});\n\nexport const token = id => {\n\tconst value = tokens[id];\n\tif (!value) throw new Error(\`Unbekanntes Token: \${id}\`);\n\treturn value;\n};\n\nexport default tokens;\n`;

/* --------------------------------------------------------------- JSON --- */

const rawLookup = new Map();
for (const t of [...ref, ...sysLight, ...cmp]) rawLookup.set(t.id, t.value);

const asJson = (tier, list) =>
	list.map(t => ({
		id: `${tier}.${t.id}`,
		cssVariable: cssVar(tier, t.id),
		type: t.type,
		value: t.value,
		resolved: toRawValue(t.value, rawLookup),
		description: t.description
	}));

const json = {
	name: 'k-design-next',
	prefix: PREFIX,
	generated: 'siehe git log',
	tiers: {
		ref: asJson('ref', ref),
		sys: asJson('sys', sysLight),
		sysDark: asJson('sys', sysDark),
		cmp: asJson('cmp', cmp)
	}
};

/* ------------------------------------------------------------- schreib --- */

const outDir = join(ROOT, 'dist', 'tokens');
mkdirSync(outDir, {recursive: true});
writeFileSync(join(outDir, 'kd-tokens.css'), css);
writeFileSync(join(outDir, 'kd-tokens.scss'), scss);
writeFileSync(join(outDir, 'kd-tokens.js'), js);
writeFileSync(join(outDir, 'kd-tokens.json'), `${JSON.stringify(json, null, 2)}\n`);

if (unresolved.length) {
	console.error('Nicht auflösbare Aliase:\n  ' + unresolved.join('\n  '));
	process.exit(1);
}

const total = ref.length + sysLight.length + sysDark.length + cmp.length;
console.log(
	`Tokens gebaut: ${total} (ref ${ref.length} · sys ${sysLight.length} + dark ${sysDark.length} · cmp ${cmp.length}) -> dist/tokens/`
);
