# Analyse der Ausgangssysteme

Grundlage dieses Design Systems sind zwei bestehende, offiziell gepflegte
Systeme des Bundes und die dahinterstehenden Vorgaben der Bundeskanzlei.
Beide wurden im Quellcode gelesen, nicht nur in der Dokumentation.

| | swiss/designsystem | Oblique |
|---|---|---|
| Träger | Bundeskanzlei, umgesetzt von Liip | BIT / FOITT |
| Stand der Analyse | v1.0.5 | Monorepo `projects/*` |
| Zielgruppe | öffentliche admin.ch-Auftritte | Angular-Fachanwendungen |
| Technik | Nuxt/Vue, Tailwind 3, PostCSS | Angular, SCSS, Style Dictionary |
| Tokens | eine Ebene CSS-Variablen (`--color-*`) über Tailwind | drei Ebenen (`--ob-s-`, `--ob-s3-`, `--ob-h-`) |
| Themes | drei Skins, kein Dunkelmodus | Hell/Dunkel über `inversity_normal` / `inversity_flipped` |
| Zustände | Hover/Focus punktuell je Komponente | vollständige Matrix je Komponente |
| Bewegung | einzelne `transition`-Angaben | kaum ausformuliert |
| Startbereich | `.hero` — Titel, Lead, Bild | kein Seitentyp „Startseite" |

---

## 1 · swiss/designsystem

### Was es richtig macht

Das System ist die verbindliche Referenz für den öffentlichen Auftritt und
sitzt sehr nah an den CD-Bund-Vorgaben.

- **Farbskalen** in zehn Stufen: Primary auf Bundesrot `#d8232a` (Stufe 600)
  kalibriert, Secondary als Blaugrau von `#f0f4f7` bis `#131b22`.
- **Rollenverteilung**, die man leicht falsch macht und die hier stimmt:
  Rot ist Link- und Akzentfarbe, gefüllte Buttons sind blaugrau
  (`.btn--filled` auf `secondary-500`). Rot als Buttonfläche kommt nicht vor.
- **Skinmechanik über CSS-Variablen**: `tailwind.config.js` bindet die
  Farbnamen nicht an Hexwerte, sondern an `var(--color-primary-600)`. Die
  Skins `default`, `intranet`, `freebrand` überschreiben nur diese Variablen
  auf einer Body-Klasse. Das ist die eleganteste Stelle des Systems.
- **Container und Raster** mit ungewöhnlich weiten Breakpoints
  (`2xl` = 1544 px, `3xl` = 1920 px) und Maximalbreiten 1544/1676 px.
- **Wappenschild** als exakte SVG-Pfade in `Logo.vue`, in reinem `#ff0000` —
  ausdrücklich nicht in der UI-Farbe `#d8232a`.
- **Rund 80 Komponenten**, bis hin zu Fachbausteinen wie dem Warenkorb für
  Publikationsbestellungen und Einstiegen für Leichte Sprache und
  Gebärdensprache.

### Wo es an Grenzen stösst

- **Nur eine Tokenebene.** `--color-primary-600` ist gleichzeitig Rohwert und
  Rolle. Eine Komponente, die „Linkfarbe" meint, schreibt „Primary 600". Ein
  Dunkelmodus liesse sich deshalb nicht einführen, ohne alle Komponenten
  anzufassen — und es gibt entsprechend keinen.
- **Tailwind als Voraussetzung.** Die Komponenten bestehen aus
  `@apply`-Ketten. Wer weder Tailwind noch Vue einsetzt, kann das CSS zwar
  einbinden, aber nicht sinnvoll erweitern. Das ausgelieferte `dist/main.css`
  ist eine Blackbox.
- **Zustände sind nicht systematisch.** `hover:` steht dort, wo es gebraucht
  wurde. `pressed` und `selected` fehlen als Begriffe; `:focus` wird in
  `.btn` mit `focus:outline-none` sogar entfernt und nur teilweise ersetzt.
- **Fixe Textgrössen je Breakpoint.** `.text--3xl` springt an vier
  Breakpoints. Zwischen den Stufen bleibt die Schrift stehen.
- **Der Hero ist kein Startbereich.** `css/sections/hero.postcss` definiert
  Abstände, Titel, Lead und Bildfläche — mehr nicht. Kein Hintergrundkonzept,
  keine Aktionszeile, kein Zustand.

---

## 2 · Oblique

### Was es richtig macht

Oblique ist technisch das modernere System, auch wenn es optisch weniger
sichtbar ist, weil es Fachanwendungen bedient.

- **Drei Tokenebenen**, erzeugt über Style Dictionary:
  `--ob-s-*` (System/Rohwerte) → `--ob-s3-*` (semantische Rollen) →
  `--ob-h-*` (Komponenten-Hooks). Eine Komponente greift nur auf die dritte
  Ebene zu.
- **Zustandsmatrix statt Einzelfälle.** Jede Rolle existiert für
  `enabled`, `hover`, `pressed`, `focus`, `disabled`, `selected`, `visited` —
  und das jeweils für Vorder-, Hintergrund- und Randfarbe.
- **Hell und Dunkel als Achse, nicht als Sonderfall.** Die Endung
  `inversity_normal` / `inversity_flipped` zieht sich durch alle Tokens.
- **Fokusring als eigenes Token** (`--ob-s3-color-interaction-focus_ring`,
  violett `#8b5cf6`). Bemerkenswert: dasselbe Violett taucht im
  swiss/designsystem als `ring-purple-500` auf — beide Systeme sind sich hier
  einig, ohne es zu dokumentieren.
- **Markenrot getrennt vom UI-Rot**: `--ob-s3-color-brand: #ff0000` ist das
  Wappenrot und wird nirgends als Flächenfarbe verwendet.

### Wo es an Grenzen stösst

- **Angular-gebunden.** Ausserhalb von Angular ist praktisch nichts nutzbar.
- **Tokennamen sind kaum lesbar.** Ein realer Name aus der generierten Datei:
  `--ob-h-button-color-bg-primary-inversity_flipped-pressed`. Die generierte
  `tokens.css` hat 2634 Zeilen. Autovervollständigung ist Voraussetzung, nicht
  Komfort.
- **Kein öffentlicher Seitenaufbau.** Header, Footer und Service-Navigation
  zielen auf das ePortal, nicht auf einen Webauftritt mit Startseite.
- **Bewegung ist kein Thema.** Es gibt Zustände, aber keine Aussage darüber,
  wie ein Zustandswechsel aussieht.

---

## 3 · Die gemeinsame Lücke

Beide Systeme beschreiben **Zustände**, keines beschreibt **Übergänge**.

Damit fehlt genau das, was moderne Auftritte heute leisten:
ein Startbereich, der Aufmerksamkeit trägt, und eine Interaktion, die
Rückmeldung gibt, ohne sich in den Vordergrund zu spielen. In beiden
Systemen entsteht das heute pro Projekt neu — und damit jedes Mal anders.

Dazu kommt eine praktische Lücke: keines der beiden Systeme lässt sich ohne
sein Framework verwenden. Für Prototypen, Mockups, statische Seiten und
Ausschreibungsunterlagen gibt es damit keinen bundeskonformen Startpunkt.

---

## 4 · Entscheidungen in k-design-next

| Frage | Entscheidung | Begründung |
|---|---|---|
| Tokenarchitektur | drei Ebenen wie Oblique | ohne semantische Ebene kein Dunkelmodus |
| Tokennamen | `--kd-sys-color-fg-default` statt `inversity_flipped` | Lesbarkeit; die Theme-Achse steckt im Selektor, nicht im Namen |
| Farbwerte | wertgleich zum swiss/designsystem | verbindliche Referenz, keine eigene Interpretation |
| Buttonfarben | gefüllt blaugrau, Rot nur Akzent | CD-Bund-Vorgabe |
| Skins | wie im swiss/designsystem, aber nur auf `brand.*` | ein Skin ändert zehn Aliase, nicht 100 Regeln |
| Dunkelmodus | neu, über `[data-kd-theme]` + `prefers-color-scheme` | im Original nicht vorhanden |
| „inverse" im Dunkelmodus | bleibt dunkel | das dunkle Band ist ein Gestaltungsmerkmal des CD Bund, keine Kontrastumkehr |
| Typografie | fluide `clamp()`-Skala | gleiche Endwerte, aber ohne Sprünge zwischen den Breakpoints |
| Quelltechnik | reines CSS, kein Präprozessor | einsetzbar in jedem Stack; Build läuft ohne Registry-Zugriff |
| Bewegung | eigene Schicht mit neun benannten Primitiven | in beiden Ausgangssystemen nicht ausformuliert |
| Fokusring | Violett, wie in beiden Systemen | folgt der stillschweigenden Konvention |
| Prüfung | Kontrast maschinell im Build | eine Zusicherung, die niemand prüft, ist keine |

### Wertgleichheit im Detail

Die folgenden Werte sind aus dem `swiss/designsystem` unverändert übernommen:

- Primary 50–900 und Secondary 50–900 (aus `css/skins/default.postcss`)
- Textgrauskala 50–900 und die Statusfarben
- Breakpoints 480 / 640 / 768 / 1024 / 1280 / 1544 / 1920 px
- Containerpadding je Breakpoint, Maximalbreiten 1544 / 1676 px
- Radienskala 0 / 1 / 2 / 3 / 5 / 6 / 8 / 10 / 12 / 15 / 24 px
- Schattenstufen (`shadow.sm` bis `shadow.3xl`)
- Freebrand-Grün und die Intranet-Blaustufen
- Wappenpfade und `#ff0000`

Neu hinzugekommen sind: Bewegungsdauern und -kurven, Ebenenindizes,
die semantische Ebene insgesamt, das dunkle Theme und die Komponentenebene.

### Was bewusst nicht übernommen wurde

- **Tailwind und die `@apply`-Ketten** — sie machen das System vom Framework
  abhängig, ohne gestalterisch etwas beizutragen.
- **Die Fachkomponenten des Bundes** (Warenkorb, Publikationsbestellung,
  Glossar, A–Z-Index). Sie gehören ins Fachsystem, nicht in die Grundlage.
- **`focus:outline-none` ohne Ersatz.** Der Fokusstil ist hier zentral
  definiert und wird nirgends entfernt.
- **Die Breakpoint-Treppe der Textgrössen** — ersetzt durch `clamp()`.

---

## 5 · Migrationspfade

**Aus dem swiss/designsystem heraus.** Die Farbwerte sind identisch, die
Klassennamen nicht. Ein Projekt kann k-design-next zunächst nur für
Startseite und Interaktionsebene einsetzen und den Rest belassen; Konflikte
entstehen nicht, weil alle Klassen mit `kd-` beginnen und alle Variablen mit
`--kd-`.

**Nach Oblique hinein.** Die semantische Ebene lässt sich abbilden, weil
beide Seiten dieselben Rollen kennen:

```css
:root {
	--ob-s3-color-neutral-fg-contrast_highest-inversity_normal: var(--kd-sys-color-fg-strong);
	--ob-s3-color-interaction-state-fg-enabled-inversity_normal: var(--kd-sys-color-link-default);
	--ob-s3-color-interaction-focus_ring-inversity_normal: var(--kd-sys-color-focus-ring);
}
```

Umgekehrt genauso: wer in einer Angular-Anwendung bei Oblique bleibt, kann
`--kd-sys-*` auf die vorhandenen `--ob-s3-*` zeigen lassen und die
Komponenten dieses Systems weiterverwenden.

**Als Ausgangspunkt für Neues.** Ohne Framework: `dist/kd.css` einbinden,
`js/kd.js` optional dazu, `demo/index.html` als Vorlage nehmen.

---

## 6 · Offene Punkte

Ehrlich benannt, damit sie nicht als erledigt gelten:

- **Noto Sans wird nicht mitgeliefert.** Das System erwartet die Schrift
  lokal oder über Google Fonts. Für Bundesumgebungen ohne externen Zugriff
  müssen die WOFF2-Dateien ins Projekt gelegt werden.
- **Keine Komponentenbibliothek für ein Framework.** Es gibt CSS und
  HTML-Muster, keine Vue-, React- oder Angular-Pakete.
- **Kein Storybook.** Die Referenz ist `demo/index.html`.
- **Die Fachkomponenten des Bundes fehlen** (siehe oben) und müssen bei
  Bedarf aus dem `swiss/designsystem` übernommen werden.
- **Automatisierte Prüfung deckt Kontrast und Struktur ab, keine
  Tastaturbedienung.** Diese ist manuell zu prüfen; die Checkliste steht in
  [BARRIEREFREIHEIT.md](BARRIEREFREIHEIT.md).
- **Rechtlicher Rahmen.** Wappen und Wortmarke unterliegen dem
  Wappenschutzgesetz. Dieses Repository ist kein amtliches Angebot.
