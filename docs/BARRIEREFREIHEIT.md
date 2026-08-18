# Barrierefreiheit

Zielniveau: **WCAG 2.2 Level AA**, im Kontext von eCH-0059 und dem
Behindertengleichstellungsgesetz. Für Auftritte des Bundes ist das kein
Qualitätsmerkmal, sondern Pflicht.

Was maschinell prüfbar ist, wird im Build geprüft. Was nicht, steht als
Checkliste hier — mit dem ausdrücklichen Hinweis, dass eine bestandene
automatische Prüfung keine Konformitätsaussage ist.

---

## Im Build geprüft

```bash
npm run check
```

| Prüfung | Kriterium |
|---|---|
| 34 Farbpaare in beiden Themes | 1.4.3 (4.5:1), 1.4.11 (3:1) |
| Wappenschild in `#ff0000` | CD Bund |
| Vierzeilige Wortmarke vorhanden | CD Bund |
| Sprachwechsler in der Top-Bar | CD Bund, 3.1.1 |
| `lang`-Attribut gesetzt | 3.1.1 |
| Skip-Link vorhanden | 2.4.1 |
| Genau ein `h1` | 1.3.1 |
| `main` mit `id` als Sprungziel | 2.4.1 |
| `aria-current` in der Navigation | 1.3.1, 2.4.8 |

Vollständige Kontrastwerte: [TOKENS.md](TOKENS.md#kontrastnachweis).

Die knappsten Paare — sie haben Luft, aber nicht viel, und sollten bei
Farbänderungen zuerst nachgerechnet werden:

| Paar | Kontrast | Schwelle |
|---|---:|---:|
| Link auf ruhiger Fläche (hell) | 4.53:1 | 4.5:1 |
| Metatext auf Seitenhintergrund (hell) | 4.83:1 | 4.5:1 |
| Link auf Seitenhintergrund (hell) | 5.01:1 | 4.5:1 |
| Fokusring auf dunklem Band (hell) | 3.31:1 | 3:1 |

---

## Im System verankert

**Ein Fokusstil für alles.** Definiert in `src/base/a11y.css`, dreipixelbreiter
violetter Ring mit Versatz. Er wird nirgends entfernt — `outline: none` steht
ausschliesslich in `:focus:not(:focus-visible)`, also dort, wo der Browser
ohnehin keinen Ring zeigen würde.

**Zielgrössen.** Bedienelemente sind mindestens 44 px hoch
(`--kd-cmp-button-min-height`), Sprach- und Icon-Schalter mindestens 32 px
mit vergrösserter Trefferfläche. Damit ist 2.5.8 (Minimum, 24 px) erfüllt und
2.5.5 (Enhanced, 44 px) für die meisten Elemente ebenfalls.

**Zustände über ARIA, nicht über Klassen.** `[aria-current]`,
`[aria-selected]`, `[aria-expanded]`, `[aria-pressed]` und `[aria-invalid]`
sind die Styling-Haken. Ein Zustand, der sichtbar ist, ist damit
zwangsläufig auch angesagt.

**Farbe ist nie das einzige Merkmal.** Links im Fliesstext sind
unterstrichen, Meldungen tragen ein Icon, der aktive Navigationseintrag
zusätzlich eine Linie, Pflichtfelder einen Stern mit textlicher Erklärung.

**Bewegungsreduktion.** `prefers-reduced-motion: reduce` setzt Dauern auf
0,01 ms, Hubhöhe auf 0 und schaltet Einblendungen sofort sichtbar. Kein
Inhalt geht verloren.

**Erhöhter Kontrast.** `prefers-contrast: more` verstärkt Ränder und hebt
`fg.subtle` auf `fg.muted` an.

**Native Elemente zuerst.** Akkordeon = `details`/`summary`. Reiter =
`button[role="tab"]` mit Pfeiltastensteuerung nach den WAI-ARIA Authoring
Practices. Formularfelder = echte Formularfelder mit `label for`.

**Mehrsprachigkeit.** Der Sprachwechsler steht in der Top-Bar, jede Sprache
trägt ihr eigenes `lang`-Attribut, die aktive Sprache `aria-current="true"`.
DE / FR / IT / RM / EN sind vorgesehen.

---

## Manuell zu prüfen

Diese Punkte kann kein Skript beantworten. Vor einer Abnahme durchgehen:

- [ ] Vollständige Bedienung mit der Tastatur, ohne Mausersatz
- [ ] Sichtbare Fokusreihenfolge entspricht der Leserichtung
- [ ] Keine Fokusfalle; ESC schliesst Aufklappbereiche (im Skript vorgesehen)
- [ ] Screenreader-Durchgang mit NVDA/Windows und VoiceOver/macOS
- [ ] Bilder tragen sinnvolle `alt`-Texte, dekorative `alt=""`
- [ ] Fehlermeldungen sind über `aria-describedby` mit dem Feld verknüpft
- [ ] Seite bleibt bei 200 % Zoom und 320 px Breite bedienbar (1.4.10)
- [ ] Textabstände lassen sich nach 1.4.12 verändern, ohne Inhalt zu verlieren
- [ ] Videos mit Untertiteln und Audiodeskription
- [ ] Leichte Sprache und Gebärdensprache angeboten, wo gefordert
- [ ] Erklärung zur Barrierefreiheit veröffentlicht

---

## Bekannte Grenzen

- Die automatische Prüfung deckt **Kontrast und Struktur** ab, nicht
  Tastaturbedienung, Vorlesereihenfolge oder Verständlichkeit.
- Der Kontrastnachweis rechnet **Tokenpaare**, nicht gerenderte Seiten. Wer
  eigene Farbkombinationen baut, verlässt den geprüften Bereich.
- Halbtransparente Flächen (`bg.hover`, `bg.selected`) werden über dem
  Seitenhintergrund gerechnet. Auf abweichendem Grund ist der Wert ein
  anderer.
- `text-wrap: balance` und `pretty` sind Fortschrittsverbesserungen; in
  älteren Browsern entfällt der Effekt folgenlos.
