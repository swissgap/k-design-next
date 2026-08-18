# k-design-next

[![CI](https://github.com/swissgap/k-design-next/actions/workflows/ci.yml/badge.svg)](https://github.com/swissgap/k-design-next/actions/workflows/ci.yml)

Design System auf Basis der Vorgaben der Bundeskanzlei.

Es übernimmt Farbwelt, Typografie und Formensprache aus dem
[Design System der Schweizerischen Eidgenossenschaft](https://github.com/swiss/designsystem),
die dreischichtige Tokenarchitektur aus [Oblique](https://github.com/oblique-bit/oblique) —
und ergänzt beides um das, was in keinem der zwei Systeme ausformuliert ist:
einen zeitgemässen Startbereich und eine durchgehend definierte Interaktionsebene.

```
Bundeskanzlei / CD Bund   →   was gilt (Farben, Wappen, Sprachen, Barrierefreiheit)
swiss/designsystem        →   wie es öffentlich aussieht (Skalen, Komponenten, Skins)
Oblique                   →   wie Tokens strukturiert werden (ref → sys → cmp, Zustände)
k-design-next             →   beides zusammen, plus Hero und Mouseover-Ebene
```

Die vollständige Gegenüberstellung steht in [docs/ANALYSE.md](docs/ANALYSE.md).

---

## Schnellstart

Keine Abhängigkeiten, keine Installation. Node ≥ 20 genügt für den Build.

```bash
git clone <repo> && cd k-design-next
npm run build      # Tokens, CSS, Showcase, Tokenreferenz
npm run check      # Selbstprüfung inklusive Kontrastnachweis
npm run dev        # http://localhost:4173
```

`dist/` und `docs/TOKENS.md` sind Build-Ergebnisse und liegen nicht im
Repository. `npm run build` erzeugt sie in wenigen Sekunden und braucht dafür
weder eine Registry noch installierte Pakete — nur Node. Vor dem ersten Öffnen
von `demo/index.html` muss der Build einmal gelaufen sein.

Einbinden in eine beliebige Seite:

```html
<link rel="stylesheet" href="dist/kd.css" />
<script src="js/kd.js" defer></script>
```

Noto Sans muss vorhanden sein — lokal ausgeliefert oder über Google Fonts:

```html
<link
	href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap"
	rel="stylesheet"
/>
```

Ohne `kd.js` bleibt jede Seite vollständig bedienbar; das Skript ergänzt nur
Zeigereffekte, Einblendungen, Aufklappzustände und die Theme-Wahl.

---

## Aufbau

```
tokens/          Quelle der Wahrheit — DTCG-JSON, drei Schichten
  ref.json         Tier 1 · Rohwerte, Skin-Aliase
  sys.light.json   Tier 2 · semantische Rollen, helles Theme
  sys.dark.json    Tier 2 · Überschreibungen für das dunkle Theme
  skins.json       Skin-Overrides (intranet, freebrand)
  cmp.json         Tier 3 · Stellschrauben je Komponente

src/             CSS-Quellen, im Browser direkt lauffähig
  base/            Reset, Typografie, Barrierefreiheit, Hilfsklassen
  layout/          Container, Grid, Sektionen
  motion/          Interaktions- und Bewegungsebene
  components/      Button, Link, Card, Formular, Rückmeldungen, Aufklappen, Farbfelder
  patterns/        Top-Bar/Header/Logo, Navigation, Hero, Footer

js/kd.js         Verhaltensebene, reine Progressive Enhancement
demo/index.html  Referenzseite mit allen Bausteinen
dist/            Erzeugt: kd.css, kd.min.css, showcase.html, tokens/*
docs/            Analyse, Architektur, Interaktion, Barrierefreiheit, Tokenreferenz
scripts/         Build und Prüfungen, ohne externe Pakete
```

---

## Die drei Tokenschichten

| Schicht | Präfix | Enthält | Beispiel |
|---|---|---|---|
| Tier 1 · Referenz | `--kd-ref-*` | Rohwerte ohne Kontext | `--kd-ref-palette-red-600: #d8232a` |
| Tier 2 · System | `--kd-sys-*` | Rollen, Theme-abhängig | `--kd-sys-color-link-default` |
| Tier 3 · Komponente | `--kd-cmp-*` | Stellschrauben je Bauteil | `--kd-cmp-button-min-height` |

Eine Komponente referenziert **nie** Tier 1. Dadurch wirkt jeder Theme- und
Skinwechsel überall, ohne dass eine Komponente angefasst wird.

```html
<body class="kd-skin-intranet">          <!-- Skin: Rot wird Blau -->
<html data-kd-theme="dark">              <!-- Theme: hell / dunkel -->
```

Ohne `data-kd-theme` entscheidet `prefers-color-scheme`.
Vollständige Liste: [docs/TOKENS.md](docs/TOKENS.md) (generiert).

---

## Was aus dem CD Bund verbindlich übernommen ist

- **Bundesrot `#d8232a`** als Link- und Akzentfarbe. Gefüllte Buttons sind
  blaugrau (`#46596b`) — Rot als grossflächige Buttonfarbe wäre ein Verstoss.
- **Wappenschild in `#ff0000`** mit den Originalpfaden, nicht nachgezeichnet,
  kein rotes Quadrat. Das UI-Rot gilt nie für das Wappen.
- **Vierzeilige Wortmarke** und Amtsname neben dem Schild.
- **Dunkle Top-Bar** mit „Alle Schweizer Bundesbehörden" links und dem
  **Sprachwechsler DE FR IT RM EN** rechts — nicht im weissen Header.
- **Noto Sans**, kleine Radien (2–3 px), zurückhaltende Schatten.
- **Dunkler Footer**, drei Spalten ab 1024 px, vier ab 1280 px, mit Rechtszeile.
- **Drei Skins**: `default` (rot), `intranet` (blau), `freebrand` (grün).
- **WCAG 2.2 AA** als Mindestmass, maschinell nachgewiesen.

---

## Prüfungen

```bash
npm run check
```

1. Jede benutzte Custom Property ohne Fallback muss definiert sein.
2. Keine hartkodierten Hexfarben ausserhalb der Tokenschicht.
3. Balancierte Struktur des Bundles.
4. Die Demo-Seite erfüllt zehn CD-Bund-Pflichtpunkte (Wappenfarbe, Wortmarke,
   Sprachwechsler in der Top-Bar, genau ein `h1`, Skip-Link, `lang`, …).
5. 34 Farbpaare in beiden Themes gegen die WCAG-Schwellen 4.5:1 bzw. 3:1.

Der Build bricht ab, sobald eine dieser Prüfungen fehlschlägt.

Dieselben Prüfungen laufen in der CI (`.github/workflows/ci.yml`) bei jedem
Push auf `main` und bei jedem Pull Request, gegen Node 20 und 22. Der Lauf
belegt zusätzlich, dass das Projekt ohne `npm install` baut, und legt die
gebaute Showcase-Seite als Artefakt ab — so lassen sich gestalterische
Änderungen am Pull Request ansehen, ohne lokal zu bauen.

---

## Browser

Moderne Evergreen-Browser. Verwendet werden CSS Custom Properties,
`clamp()`, Container Queries, `:focus-visible`, logische Eigenschaften und
`color-mix()`. Kein Präprozessor, kein Bundler, kein Polyfill.

---

## Verhältnis zu den bestehenden Systemen

Dieses System **ersetzt** weder `swiss/designsystem` noch Oblique.

- Öffentliche admin.ch-Auftritte bleiben beim `swiss/designsystem`; von hier
  lassen sich Hero, Interaktionsebene und Tokenpipeline übernehmen.
- Angular-Fachanwendungen bleiben bei Oblique; die Tokens lassen sich auf
  `--ob-*` abbilden, weil beide Seiten dieselben Rollen kennen.
- Für alles ohne Framework ist k-design-next direkt einsetzbar.

Details und Migrationspfade: [docs/ANALYSE.md](docs/ANALYSE.md).

---

## Lizenz

MIT. Wappen, Wortmarke und die Bezeichnung der Bundesverwaltung sind davon
ausgenommen — ihre Verwendung richtet sich nach dem CD Bund und dem
Wappenschutzgesetz. Dieses Repository ist eine beispielhafte Umsetzung und
kein amtliches Angebot der Bundeskanzlei.
