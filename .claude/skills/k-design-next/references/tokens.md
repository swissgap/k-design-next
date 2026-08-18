# Tokens

438 Tokens in drei Schichten. Quelle sind die DTCG-JSON-Dateien unter `tokens/`;
`npm run build` erzeugt daraus CSS, SCSS, ein ES-Modul und JSON.

Die vollständige, generierte Liste steht nach dem Build in `docs/TOKENS.md`.
Diese Datei erklärt die Struktur und nennt die Tokens, die man im Alltag
tatsächlich anfasst.

## Warum drei Schichten

Ein Farbwert kann drei verschiedene Dinge bedeuten: ein Rot, „die Farbe von
Links", oder „der Rand eines sekundären Buttons". Systeme mit einer Ebene führen
alle drei unter demselben Namen — und scheitern, sobald sich eine davon ändern
soll. Genau daran hat das `swiss/designsystem` keinen Dunkelmodus.

```
tokens/ref.json      Tier 1   palette.red.600 = #d8232a
        ↓
tokens/sys.*.json    Tier 2   color.link.default = {brand.primary.600}
        ↓
tokens/cmp.json      Tier 3   button.radius, card.shadow-hover
        ↓
src/**/*.css                  var(--kd-cmp-…) und var(--kd-sys-…)
```

**Die eine Regel:** eine Komponente referenziert nie `--kd-ref-*`.

## Namensschema

```
--kd-<schicht>-<gruppe>-<pfad>

--kd-ref-palette-red-600
--kd-sys-color-link-default
--kd-cmp-button-min-height
```

Das Theme steckt bewusst nicht im Namen, sondern im Selektor. Dadurch bleiben
die Namen tippbar; Oblique geht den anderen Weg und bezahlt es mit Namen wie
`--ob-h-button-color-bg-primary-inversity_flipped-pressed`.

## Tier 2 — die Rollen, die man braucht

**Flächen**

| Token | Bedeutung |
|---|---|
| `--kd-sys-color-bg-canvas` | Seitenhintergrund |
| `--kd-sys-color-bg-subtle` / `-muted` | ruhige Bänder, gedämpfte Flächen |
| `--kd-sys-color-bg-surface` / `-surface-raised` / `-surface-sunken` | Karten und Panels |
| `--kd-sys-color-bg-inverse` / `-inverse-strong` / `-inverse-subtle` | dunkles Band: Footer, Hero, Top-Bar |
| `--kd-sys-color-bg-accent` / `-accent-subtle` | Bundesrot als Fläche bzw. Hauch |
| `--kd-sys-color-bg-hover` / `-pressed` / `-selected` / `-disabled` | Zustände |
| `--kd-sys-color-bg-scrim` | Overlay hinter Modalen |

**Schrift**

| Token | Bedeutung |
|---|---|
| `--kd-sys-color-fg-default` | Fliesstext |
| `--kd-sys-color-fg-strong` | Überschriften |
| `--kd-sys-color-fg-muted` | Sekundärtext |
| `--kd-sys-color-fg-subtle` | Metadaten — nicht für Fliesstext |
| `--kd-sys-color-fg-inverse` / `-inverse-muted` | auf dunklem Band |
| `--kd-sys-color-fg-accent` / `-accent-strong` | Akzentschrift |
| `--kd-sys-color-fg-on-accent` | Schrift auf Akzentfläche |
| `--kd-sys-color-fg-disabled` | gesperrt |

**Ränder, Links, Aktionen, Status**

| Token | Bedeutung |
|---|---|
| `--kd-sys-color-border-subtle` / `-default` / `-strong` | Trennlinien, Rahmen |
| `--kd-sys-color-border-interactive` | Grenze von Bedienelementen — erfüllt WCAG 1.4.11 mit 3:1 |
| `--kd-sys-color-border-accent` / `-inverse` / `-disabled` | Sonderfälle |
| `--kd-sys-color-link-default` / `-hover` / `-visited` | Links |
| `--kd-sys-color-link-inverse` / `-inverse-hover` | auf dunklem Band |
| `--kd-sys-color-action-primary-bg` / `-bg-hover` / `-bg-pressed` / `-fg` | gefüllte Aktion, blaugrau |
| `--kd-sys-color-action-secondary-fg` / `-border` / `-bg-hover` | Umrissaktion, rot |
| `--kd-sys-color-action-tertiary-fg` / `-fg-hover` | Textaktion |
| `--kd-sys-color-status-{info,success,warning,danger}-{bg,fg,accent}` | Status |
| `--kd-sys-color-focus-ring` | Fokusring, violett |

Für Trennlinien `border-subtle` oder `-default` nehmen, für den Rand eines
Feldes oder Schalters `border-interactive` — die schwächeren Rollen erreichen
die 3:1 nach WCAG 1.4.11 nicht.

**Typografie, Layout, Bewegung**

| Token | Bedeutung |
|---|---|
| `--kd-sys-text-display-size` … `-h5-size`, `-lead-size`, `-body-size`, `-small-size`, `-caption-size`, `-overline-size` | fluide Grössen über `clamp()` |
| `--kd-sys-layout-container-max` / `-container-max-wide` | 1544 px / 1676 px |
| `--kd-sys-layout-measure` | 68 Zeichen Lesebreite |
| `--kd-sys-layout-gutter` / `-gap` / `-section-py` (+ `-lg`) | Abstände |
| `--kd-sys-elevation-flat` … `-modal` | fünf Schattenstufen |
| `--kd-sys-motion-hover-duration` | 120 ms, Farbwechsel |
| `--kd-sys-motion-transition-duration` | 220 ms, Bewegung und Schatten |
| `--kd-sys-motion-reveal-duration` | 600 ms, Einblenden |
| `--kd-sys-motion-transition-easing` / `-hover-easing` / `-reveal-easing` | Kurven |
| `--kd-sys-motion-lift-distance` | −4 px, Hub beim Anheben |
| `--kd-sys-motion-press-scale` | 0.985, Stauchung beim Drücken |
| `--kd-sys-focus-ring-width` / `-ring-offset` | 3 px / 2 px |

## Tier 3 — Stellschrauben je Komponente

Gruppen: `button`, `card`, `hero`, `field`, `topbar`, `header`, `nav`, `footer`,
`badge`, `alert`, `table`.

Häufig angefasst:

| Token | Standard |
|---|---|
| `--kd-cmp-button-min-height` | 2.75 rem (44 px, WCAG 2.5.8) |
| `--kd-cmp-button-icon-shift` | 0.25 rem, Weg des Pfeils |
| `--kd-cmp-card-padding` / `-padding-lg` | 1.5 rem / 2 rem |
| `--kd-cmp-card-spotlight-size` / `-spotlight-opacity` | 22 rem / 0.10 |
| `--kd-cmp-card-accent-bar` | 3 px |
| `--kd-cmp-hero-min-height` | `clamp(30rem, 74svh, 46rem)` |
| `--kd-cmp-hero-grid-size` | 72 px Rasterweite |
| `--kd-cmp-hero-spotlight-size` / `-spotlight-color` | 46 rem, Bundesrot 30 % |
| `--kd-cmp-hero-drift-opacity` | 0.55 |
| `--kd-cmp-nav-indicator-height` | 3 px |

Ein Projekt, das die Bewegung insgesamt zurücknehmen will, ändert drei Werte:

```css
:root {
	--kd-sys-motion-transition-duration: 120ms;
	--kd-sys-motion-lift-distance: 0px;
	--kd-cmp-card-spotlight-opacity: 0;
}
```

## Theme

```html
<html data-kd-theme="dark">   <!-- oder "light", oder gar nichts -->
```

Ohne Attribut entscheidet `prefers-color-scheme`. Die erzeugte CSS-Datei deckt
beide Wege ab:

```css
[data-kd-theme='dark'] { … }
@media (prefers-color-scheme: dark) {
	:root:not([data-kd-theme='light']) { … }
}
```

**Ein Sonderfall, der absichtlich so ist:** `color.bg.inverse` bleibt im dunklen
Theme dunkel. Das dunkle blaugraue Band ist ein Gestaltungsmerkmal des CD Bund,
keine Kontrastumkehr. Ein Footer, der im Dunkelmodus weiss wird, wäre technisch
konsequent und gestalterisch falsch.

## Skin

```html
<body class="kd-skin-intranet">    <!-- Rot wird Blau -->
<body class="kd-skin-freebrand">   <!-- Rot wird Grün -->
```

Ein Skin überschreibt ausschliesslich `brand.primary.*` und `brand.secondary.*`
in Tier 1 — zwanzig Aliase, sonst nichts. Die semantische Schicht bleibt
unberührt, weshalb Theme und Skin frei kombinierbar sind.

## Eigene Tokens ergänzen

1. Rohwert nach `tokens/ref.json`, falls noch nicht vorhanden.
2. Rolle nach `tokens/sys.light.json` — und die Gegenrolle nach `sys.dark.json`,
   sofern sie sich unterscheidet.
3. Stellschraube nach `tokens/cmp.json`, wenn eine Komponente sie braucht.
4. `npm run build`, dann `npm run check`.

Aliase werden als `{pfad.zum.token}` geschrieben und im Build zu `var(--kd-…)`
aufgelöst — nicht zum Rohwert. Nur dadurch bleibt die Kaskade erhalten und
Theme- und Skinwechsel wirken zur Laufzeit.

```json
"border": {
	"interactive": {
		"$value": "{palette.neutral.500}",
		"$type": "color",
		"$description": "Grenze von Bedienelementen — muss WCAG 1.4.11 mit 3:1 erfüllen"
	}
}
```

## Punktuell überschreiben

Für einen einzelnen Bereich reicht es, Tokens lokal zu setzen — Komponenten
müssen dafür nicht angefasst werden:

```html
<section class="kd-section" style="--kd-cmp-card-accent-bar: 5px">…</section>
```

```css
.meine-kampagnenseite {
	--kd-cmp-hero-grid-size: 96px;
	--kd-cmp-hero-spotlight-color: rgba(103, 141, 103, 0.28);
}
```

Das ist der vorgesehene Weg für Sonderfälle. Eine neue Klasse mit eigenen
Hexfarben ist es nicht — `npm run check` lässt hartkodierte Farben in `src/`
durchfallen, und der Kontrastnachweis kennt sie nicht.

## Kontrast

`node scripts/contrast.mjs` rechnet 34 Farbpaare in beiden Themes gegen 4.5:1
(Text) und 3:1 (Bedienelementgrenzen). Die Werte kommen aus den Tokens, nicht
aus einer Handliste — die Prüfung kann deshalb nicht veralten.

Die knappsten Paare, die bei Farbänderungen zuerst kippen:

| Paar | Kontrast |
|---|---|
| Link auf ruhiger Fläche (hell) | 4.53:1 |
| Metatext auf Seitenhintergrund (hell) | 4.83:1 |
| Fokusring auf dunklem Band (hell) | 3.31:1 |
