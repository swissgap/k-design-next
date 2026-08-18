# Seitengerüst

Vollständiges Bundes-Chrome zum Kopieren. Reihenfolge und Inhalte sind durch das
CD Bund vorgegeben — die Top-Bar steht über dem weissen Header, der
Sprachwechsler sitzt in der Top-Bar, das Wappen ist ein Schild.

Wer eine ganze Seite baut, nimmt besser gleich `assets/seite.html`; diese Datei
ist zum Nachschlagen einzelner Bausteine.

## Inhalt

1. [Dokumentrahmen](#1-dokumentrahmen)
2. [Wappenschild](#2-wappenschild)
3. [Top-Bar mit Sprachwechsler](#3-top-bar-mit-sprachwechsler)
4. [Header mit Logo und Suche](#4-header-mit-logo-und-suche)
5. [Navigation](#5-navigation)
6. [Brotkrumen](#6-brotkrumen)
7. [Hero](#7-hero)
8. [Sektionen](#8-sektionen)
9. [Footer](#9-footer)
10. [Zurück nach oben](#10-zurück-nach-oben)

---

## 1 Dokumentrahmen

```html
<!doctype html>
<html lang="de" class="kd-no-js">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Seitentitel — Amtsname</title>
		<link
			href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap"
			rel="stylesheet"
		/>
		<link rel="stylesheet" href="dist/kd.css" />
	</head>
	<body>
		<a class="kd-skip-link" href="#inhalt">Direkt zum Inhalt</a>
		<!-- Top-Bar, Header, Navigation -->
		<main id="inhalt"><!-- Hero und Sektionen --></main>
		<!-- Footer -->
		<script src="js/kd.js" defer></script>
	</body>
</html>
```

`kd-no-js` am `<html>` ist kein Schmuck: es hält `.kd-reveal` sichtbar, solange
das Skript nicht geladen ist. `js/kd.js` entfernt die Klasse beim Start.

## 2 Wappenschild

Die Pfaddaten stammen aus dem offiziellen Logo und werden unverändert kopiert.
Reines Rot `#ff0000` — das UI-Rot `#d8232a` gilt hier nie.

```html
<svg class="kd-logo__shield" viewBox="0 0 40 44" role="img" aria-label="Schweizerische Eidgenossenschaft">
	<path
		d="m38.5778 3.2s-7.2-3.2-19.3-3.2c-12.00002 0-19.2000222 3.2-19.2000222 3.2s-.6999998 14.1 2.1000022 22.1c4.8 14 17.20002 18 17.20002 18s12.3-3.9 17.2-18c2.6-8 2-22.1 2-22.1z"
		fill="#ff0000"
	/>
	<path
		d="m32.0779 15.4v7.8h-9v9.1h-7.7v-9.1h-8.99997v-7.8h8.99997v-9.09995h7.7v9.09995z"
		fill="#ffffff"
	/>
</svg>
```

Als Favicon dieselbe Form, nicht ein rotes Quadrat:

```html
<link
	rel="icon"
	href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 44'%3E%3Cpath d='m38.5778 3.2s-7.2-3.2-19.3-3.2c-12.00002 0-19.2000222 3.2-19.2000222 3.2s-.6999998 14.1 2.1000022 22.1c4.8 14 17.20002 18 17.20002 18s12.3-3.9 17.2-18c2.6-8 2-22.1 2-22.1z' fill='%23ff0000'/%3E%3Cpath d='m32.0779 15.4v7.8h-9v9.1h-7.7v-9.1h-8.99997v-7.8h8.99997v-9.09995h7.7v9.09995z' fill='%23fff'/%3E%3C/svg%3E"
/>
```

## 3 Top-Bar mit Sprachwechsler

```html
<div class="kd-topbar">
	<div class="kd-container">
		<div class="kd-topbar__inner">
			<button class="kd-topbar__authorities" type="button" data-kd-toggle="behoerden">
				Alle Schweizer Bundesbehörden
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
			</button>

			<div class="kd-topbar__meta">
				<button class="kd-topbar__authorities" type="button" data-kd-theme-toggle aria-pressed="false">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
					</svg>
					<span data-kd-theme-label>Dunkel</span>
				</button>

				<nav aria-label="Sprachwahl">
					<ul class="kd-lang">
						<li><a class="kd-lang__link" href="/de/" aria-current="true" lang="de">de</a></li>
						<li><a class="kd-lang__link" href="/fr/" lang="fr">fr</a></li>
						<li><a class="kd-lang__link" href="/it/" lang="it">it</a></li>
						<li><a class="kd-lang__link" href="/rm/" lang="rm">rm</a></li>
						<li><a class="kd-lang__link" href="/en/" lang="en">en</a></li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>

<div class="kd-topbar__drawer" id="behoerden" hidden>
	<div class="kd-container">
		<div class="kd-topbar__drawer-inner">
			<div>
				<p class="kd-caption">Wo befinde ich mich?</p>
				<p><strong>Schweizerische Eidgenossenschaft</strong> › Amtsname</p>
			</div>
			<!-- weitere Spalten mit Behördenlisten -->
		</div>
	</div>
</div>
```

Der Theme-Umschalter ist optional. Der Sprachwechsler ist es nicht.

## 4 Header mit Logo und Suche

```html
<header class="kd-header">
	<div class="kd-container">
		<div class="kd-header__inner">
			<a class="kd-logo" href="/">
				<!-- Wappenschild-SVG von oben -->
				<span class="kd-logo__text">
					<span class="kd-logo__wordmark">
						Schweizerische Eidgenossenschaft<br />
						Confédération suisse<br />
						Confederazione Svizzera<br />
						Confederaziun svizra
					</span>
					<span class="kd-logo__office">Bundeskanzlei BK</span>
				</span>
			</a>

			<div class="kd-header__actions">
				<div class="kd-search kd-hide-below-lg" style="min-inline-size: 18rem">
					<svg class="kd-search__icon" viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="11" cy="11" r="7" />
						<path d="m20 20-3.5-3.5" />
					</svg>
					<label class="kd-sr-only" for="suche">Suchbegriff</label>
					<input class="kd-input" id="suche" type="search" placeholder="Suchen" />
				</div>

				<button class="kd-burger" type="button" data-kd-toggle="mobilnav" aria-label="Menü">
					<span class="kd-burger__box">
						<span class="kd-burger__bar"></span>
						<span class="kd-burger__bar"></span>
						<span class="kd-burger__bar"></span>
					</span>
				</button>
			</div>
		</div>
	</div>
</header>
```

Die vierzeilige Wortmarke ist Pflicht, der Amtsname darunter ebenfalls.

## 5 Navigation

```html
<nav class="kd-mainnav" aria-label="Hauptnavigation">
	<div class="kd-container">
		<ul class="kd-mainnav__list">
			<li><a class="kd-mainnav__link" href="/thema" aria-current="page">Thema</a></li>
			<li><a class="kd-mainnav__link" href="/dienstleistungen">Dienstleistungen</a></li>
		</ul>
	</div>
</nav>

<nav class="kd-mobilenav" id="mobilnav" aria-label="Hauptnavigation, mobil" hidden>
	<div class="kd-container">
		<ul class="kd-mobilenav__list">
			<li><a class="kd-mobilenav__link" href="/thema" aria-current="page">Thema</a></li>
		</ul>
	</div>
</nav>
```

`aria-current="page"` färbt den Eintrag und lässt den Indikator dauerhaft
stehen — die Regel hängt am Attribut, nicht an einer Zustandsklasse.

## 6 Brotkrumen

```html
<nav class="kd-breadcrumb" aria-label="Brotkrumen">
	<div class="kd-container">
		<ol class="kd-breadcrumb__list">
			<li class="kd-breadcrumb__item"><a href="/">Startseite</a></li>
			<li class="kd-breadcrumb__item"><a href="/thema">Thema</a></li>
			<li class="kd-breadcrumb__item" aria-current="page">Unterseite</li>
		</ol>
	</div>
</nav>
```

## 7 Hero

Fünf Ebenen: Kreuzraster, Lichtschein am Zeiger, driftende Felder, optionales
Bild, Inhalt. Die drei Hintergrundebenen sind `aria-hidden` und tragen keine
Information.

```html
<section class="kd-hero" data-kd-pointer aria-labelledby="hero-titel">
	<div class="kd-hero__drift" aria-hidden="true"></div>
	<div class="kd-hero__canvas" aria-hidden="true"></div>
	<div class="kd-hero__glow" aria-hidden="true"></div>

	<div class="kd-container kd-hero__inner">
		<div class="kd-hero__content">
			<span class="kd-hero__eyebrow">Auszeichnung</span>

			<h1 class="kd-hero__title" id="hero-titel">
				Titel mit einem <span class="kd-hero__accent">Akzent</span> darin.
			</h1>

			<p class="kd-hero__lead">Ein bis drei Sätze Lead.</p>

			<div class="kd-hero__actions">
				<a class="kd-btn kd-btn--negative-filled kd-btn--lg" href="#ziel">
					Primäraktion
					<svg class="kd-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</a>
				<a class="kd-btn kd-btn--negative kd-btn--lg" href="#zweitziel">Sekundäraktion</a>
			</div>

			<dl class="kd-hero__facts">
				<div class="kd-hero__fact">
					<dt class="kd-hero__fact-label">Beschriftung</dt>
					<dd class="kd-hero__fact-value" data-kd-count="436">436</dd>
				</div>
			</dl>
		</div>
	</div>

	<a class="kd-hero__cue" href="#erste-sektion">
		Weiter
		<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
	</a>
</section>
```

Im `dl` steht `dt` vor `dd`; die Klasse `.kd-hero__fact` dreht die Reihenfolge
visuell um, damit der Wert oben erscheint und das Markup trotzdem gültig bleibt.
`data-kd-count` zählt hoch — der Endwert steht zusätzlich im Text, damit ohne
JavaScript nichts fehlt.

**Varianten**

| Klasse | Verwendung |
|---|---|
| `.kd-hero--split` | Text links, Medienfläche `.kd-hero__figure` rechts |
| `.kd-hero--compact` | Unterseiten, ohne Kennzahlen |
| `.kd-hero--light` | heller Grund für Fachanwendungen; setzt nur Tokens um |

Bild statt Farbfläche:

```html
<div class="kd-hero__media" aria-hidden="true">
	<img src="bild.jpg" alt="" />
</div>
```

**Bildmasse:** volle Fensterbreite, 480 bis rund 950 px hoch. Ausgangsdatei
2560 × 1200 px, dazu eine 1280er Fassung im `srcset`.

**Wechselnde Bilder** (Slideshow):

```html
<div class="kd-hero__media kd-hero__media--slides kd-hero__media--drift"
     data-kd-slideshow="7000" aria-hidden="true">
	<div class="kd-hero__slide is-active"><img src="hero-1.avif" alt="" /></div>
	<div class="kd-hero__slide"><img src="hero-2.avif" alt="" loading="lazy" /></div>
	<div class="kd-hero__slide"><img src="hero-3.avif" alt="" loading="lazy" /></div>
</div>

<div class="kd-hero__slides-controls" hidden>
	<button class="kd-hero__slides-toggle" type="button" aria-pressed="false" aria-label="Bildwechsel anhalten">
		<svg class="kd-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
		<svg class="kd-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>
	</button>
	<ul class="kd-hero__slides-dots">
		<li><button class="kd-hero__slides-dot" type="button" aria-current="true" aria-label="Bild 1 anzeigen"></button></li>
		<li><button class="kd-hero__slides-dot" type="button" aria-label="Bild 2 anzeigen"></button></li>
		<li><button class="kd-hero__slides-dot" type="button" aria-label="Bild 3 anzeigen"></button></li>
	</ul>
</div>
```

Die Bedienung ist **nicht optional**: WCAG 2.2.2 verlangt eine Möglichkeit,
automatische Bewegung über fünf Sekunden anzuhalten. Das Skript blendet den
Block ein, sobald es ihn findet.

Über dem Bild liegt ein dreistufiger Schleier — links deckend für den Text,
rechts durchlässig. Das **Motiv gehört in die rechte Bildhälfte**. Für helle
Bilder verschiebt man `--kd-cmp-hero-veil-start/-mid/-end`.

## 8 Sektionen

```html
<section class="kd-section" id="erste-sektion" aria-labelledby="s1">
	<div class="kd-container">
		<div class="kd-section__head kd-reveal">
			<div class="kd-section__headline">
				<span class="kd-overline">Auszeichnung</span>
				<h2 class="kd-section__title" id="s1">Sektionstitel</h2>
				<p class="kd-section__lead">Ein erklärender Satz.</p>
			</div>
			<a class="kd-link-action" href="/mehr">
				Alle ansehen
				<svg class="kd-link-action__icon" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M5 12h14M13 6l6 6-6 6" />
				</svg>
			</a>
		</div>

		<div class="kd-grid kd-grid--3"><!-- Karten --></div>
	</div>
</section>
```

Bänder wechseln über Modifier: ohne Zusatz hell, `--subtle` ruhig grau,
`--sunken` etwas tiefer, `--inverse` dunkel. `--inverse` setzt die semantischen
Rollen lokal um, damit alle Kindkomponenten ohne eigene Modifier stimmen.

## 9 Footer

```html
<footer class="kd-footer">
	<div class="kd-container">
		<div class="kd-footer__main">
			<div>
				<div class="kd-footer__brand">
					<!-- Wappenschild -->
					<span>
						<span class="kd-logo__wordmark">Schweizerische Eidgenossenschaft<br />…</span>
						<span class="kd-logo__office">Amtsname</span>
					</span>
				</div>
				<p class="kd-footer__text kd-small">Kurzbeschreibung der Einheit.</p>
			</div>

			<div>
				<p class="kd-footer__title">Spaltentitel</p>
				<ul class="kd-footer__list">
					<li><a class="kd-footer__link" href="/a">Eintrag</a></li>
				</ul>
			</div>
		</div>
	</div>

	<div class="kd-footer__legal">
		<div class="kd-container">
			<div class="kd-footer__legal-inner">
				<ul class="kd-footer__legal-list">
					<li><a href="/impressum">Impressum</a></li>
					<li><a href="/rechtliches">Rechtliche Grundlagen</a></li>
					<li><a href="/datenschutz">Datenschutz</a></li>
					<li><a href="/barrierefreiheit">Barrierefreiheit</a></li>
				</ul>
				<p>© Schweizerische Eidgenossenschaft</p>
			</div>
		</div>
	</div>
</footer>
```

Die Rechtszeile ist Pflicht: Impressum, Rechtliche Grundlagen, Datenschutz,
Barrierefreiheit.

## 10 Zurück nach oben

```html
<button class="kd-back-to-top" type="button" data-kd-back-to-top aria-label="Zurück zum Seitenanfang">
	<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
</button>
```

Erscheint ab 75 % Viewporthöhe und gibt den Fokus beim Klick an den Skip-Link
zurück, damit die Tastaturposition zum sichtbaren Bereich passt.
