# Architektur

## Warum drei Schichten

Ein Farbwert kann drei ganz verschiedene Dinge bedeuten:

- `#d8232a` — ein Rot
- „die Farbe, in der Links erscheinen"
- „die Farbe des Rands eines sekundären Buttons"

Systeme mit nur einer Ebene führen alle drei Bedeutungen unter demselben
Namen. Das funktioniert, bis sich eine davon ändern soll. Genau daran
scheitert im `swiss/designsystem` der Dunkelmodus: `--color-primary-600` ist
dort gleichzeitig Rohwert und Rolle.

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
`scripts/check.mjs` erzwingt die schwächere Variante davon — keine
hartkodierten Hexfarben ausserhalb der Tokenschicht.

---

## Namensschema

```
--kd-<schicht>-<gruppe>-<pfad>

--kd-ref-palette-red-600
--kd-sys-color-link-default
--kd-cmp-button-min-height
```

Bewusst **nicht** im Namen: das Theme. Ein Token heisst
`--kd-sys-color-fg-default` und nicht `…-inversity_normal`. Die
Theme-Achse steckt im Selektor:

```css
:root                          { --kd-sys-color-fg-default: #1f2937; }
[data-kd-theme='dark']         { --kd-sys-color-fg-default: #f3f4f6; }
```

Damit bleibt der Name kurz genug, um ihn zu tippen. Oblique geht den anderen
Weg und bezahlt es mit Namen wie
`--ob-h-button-color-bg-primary-inversity_flipped-pressed`.

---

## Zwei unabhängige Achsen

**Theme** (hell/dunkel) wirkt auf `<html>`:

```html
<html data-kd-theme="dark">   <!-- oder "light", oder gar nichts -->
```

Ohne Attribut entscheidet `prefers-color-scheme`. Die generierte CSS-Datei
enthält beide Wege:

```css
[data-kd-theme='dark'] { … }
@media (prefers-color-scheme: dark) {
	:root:not([data-kd-theme='light']) { … }
}
```

**Skin** (Farbwelt) wirkt auf `<body>`:

```html
<body class="kd-skin-intranet">    <!-- Rot wird Blau -->
<body class="kd-skin-freebrand">   <!-- Rot wird Grün -->
```

Ein Skin überschreibt **ausschliesslich** `brand.primary.*` und
`brand.secondary.*` in Tier 1 — zwanzig Aliase, sonst nichts. Die gesamte
semantische Schicht bleibt unberührt. Das ist die Mechanik des
`swiss/designsystem`, nur formalisiert.

Beide Achsen sind frei kombinierbar: Intranet-Skin im Dunkelmodus
funktioniert, ohne dass dafür etwas definiert werden müsste.

### Ein Sonderfall, der bewusst so ist

Im Dunkelmodus bleibt `color.bg.inverse` **dunkel**. Das ist keine
Nachlässigkeit: das dunkle blaugraue Band von Top-Bar, Hero und Footer ist
ein Gestaltungsmerkmal des CD Bund und keine Kontrastumkehr. Ein Footer, der
im Dunkelmodus weiss wird, wäre technisch konsequent und gestalterisch
falsch.

---

## Neue Tokens hinzufügen

1. Rohwert nach `tokens/ref.json`, falls er noch nicht existiert.
2. Rolle nach `tokens/sys.light.json` — und die Gegenrolle nach
   `sys.dark.json`, sofern sie sich unterscheidet.
3. Stellschraube nach `tokens/cmp.json`, wenn eine Komponente sie braucht.
4. `npm run build` — CSS, SCSS, JS, JSON und `docs/TOKENS.md` entstehen neu.
5. `npm run check` — der Build bricht ab bei unauflösbaren Aliasen oder
   verletzten Kontrastschwellen.

Aliase werden als `{pfad.zum.token}` geschrieben und im Build zu
`var(--kd-…)` aufgelöst — nicht zum Rohwert. Nur dadurch bleibt die Kaskade
erhalten und Theme- und Skinwechsel wirken zur Laufzeit.

---

## Neue Komponente hinzufügen

```
src/components/meine-komponente.css   # BEM: .kd-block, .kd-block__element, .kd-block--modifier
```

Danach die Datei in `src/index.css` eintragen. Der Bundler löst relative
`@import`-Zeilen rekursiv auf; die Reihenfolge in `index.css` ist die
Kaskadenreihenfolge.

Konventionen:

- Alle Klassen beginnen mit `kd-`.
- Farben, Abstände, Radien, Dauern kommen aus Tokens.
- Hover-Regeln stehen in `@media (hover: hover) and (pointer: fine)`.
- Zu jedem `:hover` gehört ein `:focus-visible` oder `:focus-within`.
- Zustände werden über ARIA-Attribute gestylt (`[aria-current]`,
  `[aria-selected='true']`, `[aria-expanded='true']`), nicht über
  Zustandsklassen. Der Zustand ist dann für alle da, nicht nur visuell.
- Logische Eigenschaften (`inline-size`, `padding-inline`,
  `border-block-end`) statt physischer.

---

## Der Build

Vier Schritte, keine Abhängigkeiten:

| Schritt | Skript | Ergebnis |
|---|---|---|
| Tokens | `build-tokens.mjs` | `dist/tokens/kd-tokens.{css,scss,js,json}` |
| CSS | `build-css.mjs` | `dist/kd.css`, `dist/kd.min.css` |
| Showcase | `build-showcase.mjs` | `dist/showcase.html` (in sich geschlossen) |
| Doku | `build-docs.mjs` | `docs/TOKENS.md` |

Die Abhängigkeitsfreiheit ist kein Selbstzweck: in abgeschotteten
Bundesumgebungen ist ein Build, der eine npm-Registry braucht, ein Risiko.
`node scripts/build-tokens.mjs` läuft auf jeder Node-20-Installation.

---

## Prüfungen

`scripts/check.mjs`

1. Jede `var(--kd-…)`-Verwendung ohne Fallback muss definiert sein.
   Verwendungen mit Fallback gelten als bewusst offene Stellschraube.
2. Keine hartkodierten Hexfarben in `src/` (ausgenommen Icons als Data-URI).
3. Balancierte Klammern im Bundle.
4. Die Demo-Seite erfüllt zehn CD-Bund-Pflichtpunkte.

`scripts/contrast.mjs`

Rechnet 34 Farbpaare aus `dist/tokens/kd-tokens.json` nach — in beiden
Themes, gegen 4.5:1 für Text und 3:1 für Bedienelementgrenzen. Die Liste
steht im Skript, die Werte kommen aus den Tokens; die Prüfung kann deshalb
nicht veralten. Ergebnisse: [TOKENS.md](TOKENS.md#kontrastnachweis).
