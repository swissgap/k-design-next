# Interaktion und Bewegung

Mouseover-Effekte sind in diesem System kein Dekor, sondern eine eigene
Schicht mit eigenen Regeln. Der Grund ist banal: Effekte, die pro Komponente
neu erfunden werden, sehen pro Komponente anders aus. Hier gibt es neun
benannte Primitive, aus denen sich jede Komponente bedient.

Quelle: [`src/motion/motion.css`](../src/motion/motion.css).

---

## Die fünf Regeln

1. **Nur bei echtem Zeiger.** Jeder Hover-Effekt steht in
   `@media (hover: hover) and (pointer: fine)`. Auf Touchgeräten bleibt kein
   Zustand hängen, nachdem der Finger die Fläche verlassen hat.
2. **Nur Compositor-Eigenschaften.** Animiert werden `transform`, `opacity`,
   `box-shadow`, `background-size` und Farben — nie Breite, Höhe, Position
   oder Abstände. Kein Layout-Reflow während einer Bewegung.
3. **Jeder Zeigereffekt hat ein Tastatur-Gegenstück.** Wo `:hover` steht,
   steht auch `:focus-within` oder `:focus-visible`. Ein Effekt, der nur mit
   der Maus erreichbar ist, wäre eine Informationslücke.
4. **Bewegungsreduktion nimmt die Bewegung, nicht die Aussage.** Bei
   `prefers-reduced-motion: reduce` werden Dauern auf 0,01 ms gesetzt und
   `--kd-sys-motion-lift-distance` auf `0px`; Farb- und Zustandswechsel
   bleiben vollständig erhalten.
5. **Alle Werte kommen aus Tokens.** Dauer, Kurve, Hubhöhe, Pfeilweg und
   Schattenstufe sind Tokens — kein Effekt enthält eine eigene Zahl.

---

## Die neun Primitive

| Klasse | Wirkung | Eingesetzt in |
|---|---|---|
| `.kd-lift` | hebt die Fläche an und wechselt die Schattenstufe | Karten, Kacheln, Panels |
| `.kd-spotlight` | radialer Lichtschein an der Zeigerposition | Karten, Hero, Panels |
| `.kd-edge` | Akzentlinie fährt von links ein | Karten, Listen |
| `.kd-underline` | Unterstreichung wächst von links auf | Links, Navigation |
| `.kd-zoom` | Bild wächst, Rahmen bleibt stehen | Medienflächen |
| `.kd-arrow` | Pfeilsymbol wandert in Leserichtung | Aktionslinks, Buttons |
| `.kd-tilt` | Neigung um wenige Grad, Werte aus dem Skript | hervorgehobene Kacheln |
| `.kd-reveal` | blendet beim Scrollen ein, einmalig | Sektionen, Rasterelemente |
| `.kd-state` | flächige Rückmeldung für Listeneinträge | Menüs, Ergebnislisten |

### Steuernde Tokens

| Token | Standard | Bedeutung |
|---|---|---|
| `--kd-sys-motion-hover-duration` | 120 ms | Farbwechsel |
| `--kd-sys-motion-transition-duration` | 220 ms | Bewegung und Schatten |
| `--kd-sys-motion-reveal-duration` | 600 ms | Einblenden beim Scrollen |
| `--kd-sys-motion-transition-easing` | `cubic-bezier(0.2, 0, 0, 1)` | Standardkurve |
| `--kd-ref-motion-easing-emphasis` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | leichtes Überschwingen für Icons |
| `--kd-sys-motion-lift-distance` | −4 px | Hub beim Anheben |
| `--kd-sys-motion-press-scale` | 0.985 | Stauchung beim Drücken |
| `--kd-cmp-button-icon-shift` | 0.25 rem | Weg des Pfeilsymbols |
| `--kd-cmp-card-spotlight-size` | 22 rem | Durchmesser des Lichtscheins |

Ein Projekt, das die Bewegung insgesamt zurücknehmen will, setzt drei
Variablen und ist fertig:

```css
:root {
	--kd-sys-motion-transition-duration: 120ms;
	--kd-sys-motion-lift-distance: 0px;
	--kd-cmp-card-spotlight-opacity: 0;
}
```

---

## Zeigerposition

`.kd-spotlight` und der Hero brauchen die Mausposition. Sie kommt aus
`js/kd.js` und wird als zwei Custom Properties auf das Element geschrieben:

```html
<article class="kd-card kd-card--interactive" data-kd-pointer>…</article>
```

```js
element.style.setProperty('--kd-pointer-x', x + 'px');
element.style.setProperty('--kd-pointer-y', y + 'px');
```

Der Effekt selbst steckt vollständig im CSS. Das Skript liefert nur
Koordinaten, gedrosselt auf ein Update pro Frame. Fehlt das Skript, greift
der Standardwert `50%` — der Schein sitzt dann in der Mitte statt am Zeiger,
und sonst ändert sich nichts.

---

## Der Startbereich

`src/patterns/hero.css` legt fünf Ebenen übereinander:

| Ebene | Inhalt | Bewegt sich |
|---|---|---|
| 0 | Grundfläche `secondary-900` | nein |
| 1 | Kreuzraster, ~5 % Deckkraft, zum Rand ausgeblendet | nein |
| 2 | Lichtschein in Bundesrot an der Zeigerposition | folgt der Maus |
| 3 | zwei sehr langsam driftende Farbfelder (34 s) | nur ohne Bewegungsreduktion |
| 4 | optionales Bild mit Schleier | nein |
| 5 | Inhalt: Auszeichnung, Titel, Lead, Aktionen, Kennzahlen | Auftritt gestaffelt |

Der Titel trägt ein hervorgehobenes Wort (`.kd-hero__accent`), unter dem eine
Linie einmalig aufwächst. Die Kennzahlen zählen beim Erscheinen hoch
(`data-kd-count`), behalten aber ohne JavaScript ihren Endwert im Markup.

Varianten: `.kd-hero--split` (Text und Medienfläche nebeneinander),
`.kd-hero--compact` (Unterseiten), `.kd-hero--light` (heller Grund für
Fachanwendungen — setzt nur Tokens um, keine eigenen Regeln).

### Wechselnde Hintergrundbilder

Ebene 4 nimmt statt eines einzelnen Bildes auch mehrere auf. Sichtbar ist immer
genau eine Folie; gewechselt wird per Klasse, das Aussehen des Wechsels steht
im CSS.

```html
<div class="kd-hero__media kd-hero__media--slides kd-hero__media--drift"
     data-kd-slideshow="7000" aria-hidden="true">
	<div class="kd-hero__slide is-active"><img src="hero-1.avif" alt="" /></div>
	<div class="kd-hero__slide"><img src="hero-2.avif" alt="" loading="lazy" /></div>
</div>
```

`data-kd-slideshow` trägt die Standzeit in Millisekunden. `--drift` ergänzt eine
sehr langsame Vergrösserung der sichtbaren Folie.

**Die Bedienung ist keine Zutat.** WCAG 2.2.2 verlangt eine Möglichkeit,
automatische Bewegung anzuhalten, sobald sie länger als fünf Sekunden läuft.
Deshalb gehört `.kd-hero__slides-controls` mit Pausenschalter zur Komponente;
das Skript blendet sie ein, sobald es sie findet. Ein Klick auf einen Punkt
beendet den Automatiklauf — wer bewusst wählt, will nicht weitergeschoben
werden.

Bei `prefers-reduced-motion: reduce` läuft nichts von selbst und es wird nicht
überblendet; die Punkte bleiben bedienbar. Im Hintergrundtab hält der Wechsel
an. Ohne JavaScript bleibt die erste Folie stehen.

**Schleier und Lesbarkeit.** Über dem Bild liegt ein dreistufiger Verlauf:
`--kd-cmp-hero-veil-start` (0.94) auf der Textseite, `-veil-mid` (0.62) in der
Mitte, `-veil-end` (0.24) auf der Bildseite. Das Motiv gehört deshalb in die
**rechte** Bildhälfte. Für helle Bilder verschiebt man die drei Stufen — die
Textfarben bleiben unberührt.

Sobald eine Bildebene vorhanden ist, nimmt das System die driftenden Farbfelder
automatisch auf `--kd-cmp-hero-drift-opacity-photo` (0.18) zurück; zwei
konkurrierende Hintergrundbewegungen wirken sonst unruhig.

**Bildmasse.** Die Fläche ist so breit wie das Fenster und 480 bis rund 950 px
hoch. Als Ausgangsdatei eignen sich 2560 × 1200 px mit einer 1280er Fassung im
`srcset`, in AVIF mit WebP-Rückfall.

---

## Verhalten ohne JavaScript

| Baustein | Ohne Skript |
|---|---|
| Hover, Fokus, aktive Zustände | vollständig, reines CSS |
| Lichtschein | sitzt in der Mitte statt am Zeiger |
| Neigung | keine Neigung |
| Einblenden beim Scrollen | alles sofort sichtbar (`.kd-no-js .kd-reveal`) |
| Kennzahlen | Endwert steht im Markup |
| Akkordeon | `details`/`summary`, voll bedienbar |
| Reiter | erster Reiter sichtbar, Panels über Anker erreichbar |
| Aufklappbereiche | über `hidden` im Markup steuerbar |
| Theme | folgt `prefers-color-scheme` |

Das Skript wird über `data-`-Attribute angemeldet, nie über Klassen. Styling
und Verhalten bleiben dadurch getrennt: eine Klasse kann man umbenennen, ohne
Verhalten zu brechen.
