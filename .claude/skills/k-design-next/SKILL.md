---
name: k-design-next
description: Baut Seiten, Startbereiche und Komponenten mit dem Design System k-design-next (github.com/swissgap/k-design-next) — dreischichtige kd-Tokens, Bund-konforme kd-Klassen, geschichteter Hero, neun Mouseover-Primitive. IMMER verwenden, sobald im Projekt dist/kd.css, tokens/ref.json oder eine kd--Klasse vorkommt, oder der Nutzer k-design-next, kd-Tokens, --kd-sys-, --kd-cmp- oder das «neue Design System» erwähnt. Ebenso bei Landing Page, Startseite, Hero, Kachel-Übersicht, Formular, Navigation, Footer, Mockup oder Komponente im Kontext dieses Repos — auch ohne Nennung des Systemnamens. Deckt Farb- und Bewegungstokens, Themes hell/dunkel, Skins default/intranet/freebrand, Hover-Effekte, CD-Bund-Pflichten (Wappen, Wortmarke, Sprachwechsler, Rot nur als Akzent) und WCAG 2.2 AA ab. NICHT für Projekte mit swiss/designsystem (Vue/Tailwind) oder Oblique (Angular) — dort gelten deren Klassen.
---

# k-design-next

Design System auf Basis der Vorgaben der Bundeskanzlei. Farbwelt, Typografie und
Formensprache stammen aus dem `swiss/designsystem`, die Tokenarchitektur aus
Oblique; dazu kommen ein geschichteter Startbereich und eine Interaktionsebene,
die beide Ausgangssysteme offen lassen.

Reines CSS, keine Abhängigkeiten, kein Präprozessor. Alle Klassen beginnen mit
`kd-`, alle Variablen mit `--kd-`.

## Wann dieser Skill gilt — und wann nicht

| Projektlage | Zuständig |
|---|---|
| Repo enthält `dist/kd.css`, `tokens/ref.json` oder `kd-`-Klassen | **dieser Skill** |
| Neues Mockup, Prototyp oder Seite ohne festgelegten Stack | **dieser Skill** |
| Nuxt/Vue-Projekt mit Tailwind und `swiss/designsystem` | Skill `swiss-webdesign` |
| Angular-Anwendung mit `@oblique/oblique` | Skill `swiss-admin-oblique-ui` |
| PowerPoint, Print, CD-Bund-Dokumente | Skill für CD-Bund-Präsentationen |

Die Systeme nicht mischen. `kd-`-Klassen in einem Oblique-Projekt oder
`ob-`-Komponenten in einer kd-Seite erzeugen zwei konkurrierende Kaskaden.

## Einbinden

```html
<link rel="stylesheet" href="dist/kd.css" />
<script src="js/kd.js" defer></script>
<link
	href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap"
	rel="stylesheet"
/>
```

`dist/kd.css` entsteht aus `npm run build` und liegt nicht im Repository — vor
dem ersten Öffnen einer Seite einmal bauen. Der Build braucht weder eine
Registry noch installierte Pakete, nur Node ≥ 20.

Das Skript ist reine Progressive Enhancement. Ohne es bleibt jede Seite
vollständig bedienbar; es liefert nur Zeigerposition, Neigung, Einblendungen,
Zähler, Aufklappzustände, Reiter, Sprungnavigation und die Theme-Wahl.

## Die sieben Regeln

Diese Punkte tragen die Identität des Systems. Wer sie verletzt, baut zwar
etwas, das funktioniert, aber nicht mehr nach Bund aussieht — und im Fall der
Barrierefreiheit auch etwas, das rechtlich nicht abgenommen wird.

1. **Rot ist Akzent, keine Fläche.** `#d8232a` gilt für Links, aktive Zustände
   und Akzentkanten. Die gefüllte Primäraktion ist blaugrau
   (`.kd-btn--filled`, `#46596b`). Ein roter Button ist ein CD-Verstoss.
2. **Das Wappen ist ein Schild, kein Quadrat, und immer `#ff0000`.** Die
   Pfaddaten stehen in `references/seitengeruest.md` und werden von dort
   kopiert, nie nachgezeichnet. Das UI-Rot gilt nie für das Wappen.
3. **Der Sprachwechsler sitzt in der dunklen Top-Bar**, nicht im weissen
   Header. Vorgesehen sind DE/FR/IT/RM/EN, jede mit eigenem `lang`-Attribut,
   die aktive Sprache mit `aria-current="true"`.
4. **Komponenten referenzieren nie `--kd-ref-*`.** Rohwerte gehören in Tier 1,
   Komponenten greifen auf `--kd-sys-*` oder `--kd-cmp-*` zu. Nur dadurch
   wirken Theme- und Skinwechsel, ohne dass eine Komponente angefasst wird.
   Hartkodierte Hexfarben lässt `npm run check` durchfallen.
5. **Kein `:hover` ohne Tastatur-Gegenstück.** Zu jedem Zeigereffekt gehört
   `:focus-visible` oder `:focus-within`. Ein Zustand, der nur mit der Maus
   erreichbar ist, ist eine Informationslücke.
6. **Der Fokusstil wird nie entfernt.** Er ist zentral in `src/base/a11y.css`
   definiert. `outline: none` steht ausschliesslich in
   `:focus:not(:focus-visible)`.
7. **Zustände über ARIA, nicht über Zustandsklassen.** `[aria-current]`,
   `[aria-selected]`, `[aria-expanded]`, `[aria-pressed]`, `[aria-invalid]`
   sind die Styling-Haken. Was sichtbar ist, ist damit zwangsläufig auch
   angesagt.

## Arbeitsweise

Zuerst prüfen, ob das Projekt das System schon einbindet (`dist/kd.css`,
`src/index.css`, `tokens/`). Falls ja, dessen Konventionen folgen und nur
ergänzen.

| Aufgabe | Zuerst lesen |
|---|---|
| Ganze Seite, Kopf, Navigation, Footer | `references/seitengeruest.md` |
| Einzelne Komponente, Klassennamen nachschlagen | `references/klassen.md` |
| Farben, Abstände, Theme, Skin, eigene Tokens | `references/tokens.md` |
| Hover-Effekt aussuchen oder abschwächen | Tabelle unten, dann `references/klassen.md` |

Für eine vollständige neue Seite ist `assets/seite.html` die Vorlage: sie
enthält das komplette Bundes-Chrome inklusive Wappen-SVG, Hero, Sektion und
Footer und ist sofort lauffähig.

Nach jeder Änderung am Repository selbst:

```bash
npm run build && npm run check
```

Die Prüfung deckt Tokenauflösung, hartkodierte Farben, zehn CD-Bund-Pflichtpunkte
und 34 Farbpaare gegen WCAG 2.2 AA in beiden Themes ab. Sie bricht ab, statt zu
warnen — ein rotes Ergebnis ist ein echter Fund, kein Formalismus.

## Seitengerüst in Kurzform

```
kd-skip-link           Zum Inhalt springen, erstes fokussierbares Element
kd-topbar              dunkel, links Behörden, rechts Sprachwechsler
  kd-topbar__drawer    aufklappbare Behördenliste
kd-header              weiss, Wappen + vierzeilige Wortmarke + Amtsname, Suche
kd-mainnav             horizontale Navigation, Indikator wächst aus der Mitte
kd-mobilenav           Vollbildvariante, über data-kd-toggle geschaltet
kd-breadcrumb          Brotkrumen
main
  kd-hero              Startbereich, fünf Ebenen
  kd-section           Inhaltsbänder, wechselnd hell / --subtle / --inverse
kd-footer              dunkel, 3 Spalten ab lg, 4 ab xl, plus Rechtszeile
kd-back-to-top         erscheint nach 75 % Viewporthöhe
```

Innerhalb jeder Sektion sorgt `.kd-container` für Gutter und Maximalbreite
(1544 px ab 2xl, 1676 px ab 3xl). Vertikaler Rhythmus kommt von `.kd-section`,
nicht von Einzelmargins.

## Die neun Mouseover-Primitive

Sie sind der Grund, warum das System eigenständig wirkt. Jedes ist eine Klasse,
läuft nur in `@media (hover: hover) and (pointer: fine)` und weicht bei
`prefers-reduced-motion: reduce` auf reine Zustandswechsel zurück.

| Klasse | Wirkung | Typischer Ort |
|---|---|---|
| `.kd-lift` | hebt an, Schatten wechselt | Karten, Kacheln, Panels |
| `.kd-spotlight` | Lichtschein folgt dem Zeiger | Karten, Hero, Panels |
| `.kd-edge` | Akzentlinie fährt von links ein | Karten, Listen |
| `.kd-underline` | Unterstreichung wächst auf | Links, Navigation |
| `.kd-zoom` | Bild wächst, Rahmen bleibt | Medienflächen |
| `.kd-arrow` | Pfeil wandert in Leserichtung | Aktionslinks, Buttons |
| `.kd-tilt` | Neigung um wenige Grad | hervorgehobene Kacheln |
| `.kd-reveal` | blendet beim Scrollen ein, einmalig | Sektionen, Rasterelemente |
| `.kd-state` | flächige Rückmeldung | Menüs, Ergebnislisten |

`.kd-spotlight` und der Hero brauchen zusätzlich `data-kd-pointer` am Element —
das Skript schreibt dort `--kd-pointer-x` und `--kd-pointer-y` hinein, der
Effekt selbst steckt vollständig im CSS.

`.kd-card--interactive` bündelt Anheben, Schatten, Lichtschein, Akzentkante,
Bildzoom und Titelfärbung bereits — dort keine weiteren Primitive stapeln.

Der Hero nimmt auf Ebene 4 auch **wechselnde Hintergrundbilder** auf
(`.kd-hero__media--slides` mit `data-kd-slideshow`). Dazu gehört zwingend
`.kd-hero__slides-controls` mit Pausenschalter — WCAG 2.2.2 verlangt eine
Möglichkeit, automatische Bewegung über fünf Sekunden anzuhalten. Markup und
Bildmasse stehen in `references/seitengeruest.md`.

Bewegung insgesamt zurücknehmen, ohne Komponenten anzufassen:

```css
:root {
	--kd-sys-motion-transition-duration: 120ms;
	--kd-sys-motion-lift-distance: 0px;
	--kd-cmp-card-spotlight-opacity: 0;
}
```

## Theme und Skin

Zwei unabhängige Achsen, frei kombinierbar.

```html
<html data-kd-theme="dark">        <!-- oder "light", oder gar nichts -->
<body class="kd-skin-intranet">    <!-- oder kd-skin-freebrand -->
```

Ohne `data-kd-theme` entscheidet `prefers-color-scheme`. Ein Skin überschreibt
ausschliesslich die zwanzig `brand.*`-Aliase in Tier 1; die semantische Schicht
bleibt unberührt.

Eine Besonderheit, die absichtlich so ist: `color.bg.inverse` bleibt im dunklen
Theme **dunkel**. Das dunkle blaugraue Band von Top-Bar, Hero und Footer ist ein
Gestaltungsmerkmal des CD Bund, keine Kontrastumkehr. Ein Footer, der im
Dunkelmodus weiss wird, wäre technisch konsequent und gestalterisch falsch.

## Häufige Fehler

- **Roter gefüllter Button.** Gefüllt ist blaugrau; Rot bleibt Linkfarbe.
- **Wappen als rotes Quadrat oder in `#d8232a`.** Schildform, `#ff0000`.
- **Sprachwechsler im weissen Header.** Er gehört in die Top-Bar.
- **`var(--kd-ref-…)` in einer Komponente.** Semantische Rolle statt Rohwert
  suchen; fehlt sie, in `tokens/sys.light.json` ergänzen.
- **Eigene Hover-Regel statt Primitiv.** Erst in der Tabelle oben nachsehen —
  meist gibt es die gewünschte Wirkung schon, tokengebunden und mit
  Tastaturpfad.
- **Hover ohne `@media (hover: hover)`.** Auf Touchgeräten bleibt der Zustand
  sonst nach der Berührung hängen.
- **`.kd-reveal` ohne Skript.** Ohne JavaScript greift `.kd-no-js .kd-reveal`
  nur, wenn `kd-no-js` am `<html>` steht und das Skript sie wieder entfernt.
  Beim Einbetten in fremde Seitenrümpfe daran denken.
- **Grosse Radien, Verläufe, Glaseffekte.** Das System hält 2–3 px Radius und
  zweischichtige, sehr dezente Schatten.
- **Mehr als ein `h1`** oder Überschriften, die Ebenen überspringen.

## Selbstprüfung vor der Übergabe

- [ ] Genau ein `h1`, logische Überschriftenfolge, `lang` gesetzt
- [ ] Skip-Link als erstes fokussierbares Element, `main` mit `id`
- [ ] Wappen `#ff0000`, vierzeilige Wortmarke, Amtsname
- [ ] Sprachwechsler in der Top-Bar, aktive Sprache `aria-current="true"`
- [ ] Gefüllte Aktionen blaugrau, Rot nur als Akzent und Linkfarbe
- [ ] Jeder Hover hat einen Fokus-Pfad, Fokusring sichtbar
- [ ] Keine hartkodierten Farben, keine `--kd-ref-*` in Komponenten
- [ ] Mit Tastatur allein bedienbar, ESC schliesst Aufklappbereiche
- [ ] `npm run check` grün (falls im Repository gearbeitet wurde)
