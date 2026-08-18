# Klassenreferenz

267 Klassen, alle mit `kd-`-Präfix, BEM-artig: Block `.kd-card`, Element
`.kd-card__title`, Modifier `.kd-card--interactive`.

## Inhalt

1. [Layout](#1-layout)
2. [Typografie](#2-typografie)
3. [Buttons und Links](#3-buttons-und-links)
4. [Karten](#4-karten)
5. [Formulare](#5-formulare)
6. [Rückmeldungen](#6-rückmeldungen)
7. [Aufklappen, Reiter, Tabellen](#7-aufklappen-reiter-tabellen)
8. [Bewegung](#8-bewegung)
9. [Barrierefreiheit und Hilfsklassen](#9-barrierefreiheit-und-hilfsklassen)
10. [data-Attribute](#10-data-attribute)

Kopf, Navigation, Hero und Footer stehen in `seitengeruest.md`.

---

## 1 Layout

| Klasse | Wirkung |
|---|---|
| `.kd-container` | Gutter je Breakpoint, max. 1544 px ab 2xl, 1676 px ab 3xl |
| `.kd-container--narrow` | max. 62 rem |
| `.kd-container--reading` | max. 48 rem |
| `.kd-container--flush` | ohne seitliches Padding |
| `.kd-bleed` | bricht auf volle Viewportbreite aus |
| `.kd-section` | vertikaler Rhythmus eines Bandes |
| `.kd-section--tight` / `--flush-top` / `--flush-bottom` | Abstände reduzieren |
| `.kd-section--subtle` / `--sunken` / `--inverse` | Bandfarbe |
| `.kd-section--centered` / `--divided` | zentrierter Kopf / Trennlinie oben |
| `.kd-section__head` `__headline` `__title` `__lead` | Sektionskopf |

**Raster**

| Klasse | Wirkung |
|---|---|
| `.kd-grid` | Grid mit responsivem Gap |
| `.kd-grid--auto` | intrinsisch, Spaltenzahl aus `--kd-grid-min` (Standard 18 rem) |
| `.kd-grid--auto-sm` / `--auto-lg` | Mindestbreite 13 rem / 24 rem |
| `.kd-grid--2` `--3` `--4` | feste Spalten ab md bzw. lg |
| `.kd-grid--sidebar` / `--sidebar-end` | 1:2 bzw. 2:1 |
| `.kd-grid--reverse` | dreht die visuelle Reihenfolge ab md |
| `.kd-span-full` `.kd-span-2` `.kd-row-2` | Spannweiten |
| `.kd-ratio` (+ `--square` `--portrait` `--wide`) | Seitenverhältnis für Medien |

`--auto` ist meist die bessere Wahl: die Spaltenzahl ergibt sich aus dem Platz,
ohne Breakpoint-Pflege.

**Stapeln und Gruppieren**

| Klasse | Wirkung |
|---|---|
| `.kd-stack` (+ `--sm` `--lg` `--xl`) | vertikaler Abstand zwischen Geschwistern |
| `.kd-cluster` (+ `--sm` `--lg` `--between`) | horizontale Gruppe mit Umbruch |

```html
<div class="kd-grid kd-grid--auto" style="--kd-grid-min: 20rem">
	<article class="kd-card kd-card--interactive" data-kd-pointer>…</article>
</div>
```

## 2 Typografie

| Klasse | Wirkung |
|---|---|
| `.kd-display` | grösste Stufe, fluid bis 5 rem |
| `.kd-h1` … `.kd-h6` | Grössen ohne Semantik zu ändern |
| `.kd-lead` | Vorspann, gedämpft |
| `.kd-body` `.kd-small` `.kd-caption` | Fliesstext, klein, Bildunterschrift |
| `.kd-overline` | gesperrte Auszeichnungszeile mit Strich davor |
| `.kd-mono` | Noto Sans Mono, 0.9 em |
| `.kd-measure` | begrenzt auf 68 Zeichen |
| `.kd-muted` `.kd-subtle` | Textfarbe dämpfen |
| `.kd-required` | Pflichtfeldstern hinter dem Label |
| `.kd-prose` | Fliesstextrhythmus für redaktionelle Blöcke |

`.kd-prose` setzt Abstände aus der Reihenfolge der Kinder, begrenzt Absätze auf
die Lesebreite und formatiert Listen, Zitate und Inline-Code mit. Für längere
Texte ist das der richtige Container.

## 3 Buttons und Links

| Klasse | Verwendung |
|---|---|
| `.kd-btn` | Basis, immer nötig |
| `.kd-btn--filled` | Primäraktion, blaugrau |
| `.kd-btn--outline` | Sekundäraktion, roter Rand |
| `.kd-btn--ghost` | Tertiär, nur Text |
| `.kd-btn--link` | Textlink mit Pfeil, ohne Rahmen |
| `.kd-btn--negative` / `--negative-filled` | auf dunklem Grund |
| `.kd-btn--sm` / `--lg` | Grössen (36 / 52 px) |
| `.kd-btn--block` | volle Breite |
| `.kd-btn--icon-only` | quadratisch, Text in `.kd-sr-only` |
| `.kd-btn--icon-start` | Icon vor dem Text |
| `.kd-btn__icon` | SVG im Button |
| `.kd-btn-group` | Gruppe mit gemeinsamem Abstand |

```html
<button class="kd-btn kd-btn--filled" type="button">
	Absenden
	<svg class="kd-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M5 12h14M13 6l6 6-6 6" />
	</svg>
</button>
```

Rot als Fläche ist ein CD-Verstoss — `--filled` ist blaugrau, `--outline` trägt
das Rot am Rand.

| Klasse | Verwendung |
|---|---|
| `.kd-link` | Inline-Link, Unterstreichung verdickt beim Hover |
| `.kd-link-action` + `.kd-link-action__icon` | „Mehr erfahren" mit wanderndem Pfeil |
| `.kd-link--negative` | auf dunklem Grund |
| `.kd-link--external` | hängt ein Pfeilsymbol an |
| `.kd-stretched` | macht die ganze Karte klickbar |

`.kd-stretched` gehört an den einen Link, der das Ziel der Karte ist; alle
weiteren Links in derselben Karte wären dann unerreichbar.

## 4 Karten

| Klasse | Wirkung |
|---|---|
| `.kd-card` | Basis |
| `.kd-card--interactive` | Anheben, Schatten, Lichtschein, Akzentkante, Bildzoom |
| `.kd-card--flat` | ohne Rahmen, nur Trennlinie unten |
| `.kd-card--outline` | ohne Schatten, kräftigerer Rand |
| `.kd-card--inverse` | auf dunklem Band |
| `.kd-card--feature` | grösseres Padding und grösserer Titel |
| `.kd-card--horizontal` | Bild seitlich ab 34 rem Containerbreite |
| `__media` `__body` `__eyebrow` `__title` `__text` `__meta` `__footer` `__icon` | Bausteine |

```html
<article class="kd-card kd-card--interactive" data-kd-pointer>
	<div class="kd-card__media"><img src="bild.jpg" alt="" /></div>
	<div class="kd-card__body">
		<span class="kd-card__eyebrow">Kategorie</span>
		<h3 class="kd-card__title"><a class="kd-stretched" href="/ziel">Titel</a></h3>
		<p class="kd-card__text">Beschreibung.</p>
	</div>
	<div class="kd-card__footer">
		<span class="kd-card__meta">12. März 2026</span>
	</div>
</article>
```

`--interactive` bündelt bereits fünf Effekte. Dort keine weiteren Primitive
stapeln — das Ergebnis wirkt sonst unruhig und die Übergänge überlagern sich.
`--horizontal` reagiert auf die Containerbreite, nicht auf den Viewport; eine
Karte im schmalen Seitenbereich bleibt also vertikal.

## 5 Formulare

| Klasse | Wirkung |
|---|---|
| `.kd-field` | Label, Feld, Hinweis, Fehler untereinander |
| `.kd-label` | Beschriftung über dem Feld |
| `.kd-input` `.kd-select` `.kd-textarea` | Felder |
| `.kd-hint` | Hilfetext |
| `.kd-error` | Fehlermeldung mit Icon |
| `.kd-choice` + `.kd-choice__label` | Checkbox / Radio mit Text |
| `.kd-fieldset` | Gruppe mit `legend` |
| `.kd-form-grid` (+ `--2`) | Formularraster |
| `.kd-search` + `.kd-search__icon` | Suchfeld mit vorangestelltem Icon |

```html
<div class="kd-field">
	<label class="kd-label kd-required" for="mail">E-Mail</label>
	<input class="kd-input" id="mail" type="email" aria-invalid="true" aria-describedby="mail-fehler" />
	<p class="kd-error" id="mail-fehler">Bitte eine gültige E-Mail-Adresse eingeben.</p>
</div>
```

Der Fehlertext muss über `aria-describedby` mit dem Feld verknüpft sein — sonst
hört ihn niemand, der das Formular nicht sieht. `aria-invalid="true"` färbt den
Rand; eine Zustandsklasse braucht es nicht.

## 6 Rückmeldungen

| Klasse | Wirkung |
|---|---|
| `.kd-alert` (+ `--info` `--success` `--warning` `--danger`) | Meldung mit Akzentkante |
| `.kd-alert__icon` `__body` `__title` | Bausteine |
| `.kd-badge` (+ `--accent` `--info` `--success` `--warning` `--danger` `--outline`) | Pille |
| `.kd-tag` | filterbares Schlagwort, Zustand über `aria-pressed` |
| `.kd-stat` + `__value` `__label` | Kennzahl |
| `.kd-progress` + `__bar` | Fortschritt, Wert über `--kd-progress-value` |

Statusfarben tragen immer zusätzlich ein Icon oder eine Textmarke. Farbe allein
ist kein zulässiger Informationsträger.

## 7 Aufklappen, Reiter, Tabellen

| Klasse | Wirkung |
|---|---|
| `.kd-accordion` `__item` `__summary` `__marker` `__panel` | Akkordeon auf `details`/`summary` |
| `.kd-tabs` `.kd-tab` `.kd-tabpanel` | Reiter mit Pfeiltastensteuerung |
| `.kd-table-wrap` `.kd-table` (+ `--numeric`) | Tabelle mit horizontalem Scrollen |

```html
<details class="kd-accordion__item">
	<summary class="kd-accordion__summary">
		Frage
		<svg class="kd-accordion__marker" viewBox="0 0 24 24" aria-hidden="true">
			<path d="m6 9 6 6 6-6" />
		</svg>
	</summary>
	<div class="kd-accordion__panel">Antwort.</div>
</details>
```

Reiter brauchen `role="tablist"`, `role="tab"` mit `aria-controls` und
`aria-selected` sowie `role="tabpanel"`; das Skript übernimmt dann Auswahl und
Tastatur. `.kd-table` gehört immer in `.kd-table-wrap`, sonst scrollt auf
schmalen Geräten die ganze Seite seitwärts.

## 8 Bewegung

| Klasse | Wirkung |
|---|---|
| `.kd-lift` | anheben, Schatten wechseln |
| `.kd-spotlight` | Lichtschein an der Zeigerposition (braucht `data-kd-pointer`) |
| `.kd-edge` (+ `--top`) | Akzentlinie fährt ein |
| `.kd-underline` (+ `--reverse`) | Unterstreichung wächst auf bzw. verschwindet |
| `.kd-zoom` + `.kd-zoom__media` | Bild wächst |
| `.kd-arrow` + `.kd-arrow__icon` | Pfeil wandert |
| `.kd-tilt` | Neigung, Stärke über `data-kd-tilt="6"` |
| `.kd-reveal` (+ `.kd-delay-1` … `-5`) | Einblenden beim Scrollen, gestaffelt |
| `.kd-state` | Zustandsfläche für Listeneinträge |

Alle Effekte laufen nur in `@media (hover: hover) and (pointer: fine)` und
weichen bei `prefers-reduced-motion: reduce` auf Farb- und Zustandswechsel
zurück. Wer einen eigenen Effekt schreibt, hält sich an dieselbe Bedingung —
sonst bleibt der Zustand auf Touchgeräten nach der Berührung hängen.

## 9 Barrierefreiheit und Hilfsklassen

| Klasse | Wirkung |
|---|---|
| `.kd-skip-link` | Sprung zum Inhalt, erstes fokussierbares Element |
| `.kd-sr-only` (+ `--focusable`) | nur für Screenreader |
| `.kd-focusable` | Fokusring an einem sonst nicht fokussierbaren Element |
| `.kd-target` | vergrössert die Trefferfläche auf 24 px (WCAG 2.5.8) |
| `.kd-no-print` | im Druck ausblenden |
| `.kd-panel` (+ `--subtle`) | umrandete Fläche |
| `.kd-surface` `.kd-divider` | Flächenfarbe, Trennlinie |
| `.kd-swatches` `.kd-swatch` (+ `--light`) `.kd-swatch-legend` | Farbfelder für Doku |
| `.kd-text-center` `.kd-text-end` `.kd-nowrap` `.kd-truncate` | Textausrichtung |
| `.kd-clamp-2` `.kd-clamp-3` | Text nach 2 bzw. 3 Zeilen abschneiden |
| `.kd-full` `.kd-relative` `.kd-flex-1` | kleine Layouthelfer |
| `.kd-hide-below-md` `.kd-hide-from-md` `.kd-hide-below-lg` `.kd-hide-from-lg` | Sichtbarkeit |
| `.kd-on-accent` `.kd-on-inverse` | Farbrollenpaare für Prototypen |

Die Hilfsklassen sind bewusst wenige. Das System ist komponenten-, nicht
utility-first; wer viele Helfer stapelt, baut vermutlich eine Komponente, die
es geben sollte.

## 10 data-Attribute

Verhalten wird über `data`-Attribute angemeldet, nie über Klassen — dadurch
lässt sich eine Klasse umbenennen, ohne Verhalten zu brechen.

| Attribut | Wirkung |
|---|---|
| `data-kd-pointer` | schreibt `--kd-pointer-x/-y` auf das Element |
| `data-kd-slideshow="7000"` | wechselnde Hero-Hintergrundbilder, Standzeit in Millisekunden |
| `data-kd-tilt="6"` | Neigung, Wert in Grad |
| `data-kd-count="436"` | zählt beim Erscheinen hoch |
| `data-kd-count-suffix="%"` | Zusatz hinter der Zahl |
| `data-kd-toggle="ziel-id"` | schaltet `hidden` und `aria-expanded` gemeinsam |
| `data-kd-scrollspy` | markiert den sichtbaren Abschnitt in `.kd-jumpnav` |
| `data-kd-back-to-top` | Zurück-nach-oben-Schalter |
| `data-kd-theme-toggle` + `data-kd-theme-label` | Theme umschalten, Beschriftung |
| `data-kd-skin="intranet"` | Skin umschalten |
| `data-kd-theme="dark"` am `<html>` | Theme festlegen |
