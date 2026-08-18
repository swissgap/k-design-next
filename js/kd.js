/**
 * k-design-next — Verhaltensebene
 *
 * Reine Progressive Enhancement: ohne dieses Skript bleibt jede Seite
 * vollständig bedienbar. Das Skript fügt nur hinzu, was ohne JavaScript
 * nicht darstellbar ist — Zeigerposition, Einblendungen beim Scrollen,
 * Aufklappzustände und die Theme-Wahl.
 *
 * Keine Abhängigkeiten, kein Build. Einbinden mit
 *   <script src="js/kd.js" defer></script>
 *
 * Alle Verhalten werden über data-Attribute angemeldet, nie über Klassen —
 * so bleiben Styling und Verhalten getrennt.
 */
(function () {
	'use strict';

	var root = document.documentElement;
	var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
	var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

	root.classList.remove('kd-no-js');
	root.classList.add('kd-js');

	/** rAF-gedrosselter Aufruf — pro Frame höchstens eine Ausführung. */
	function throttle(fn) {
		var ticking = false;
		var lastArgs;
		return function () {
			lastArgs = arguments;
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(function () {
				ticking = false;
				fn.apply(null, lastArgs);
			});
		};
	}

	function all(selector, scope) {
		return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
	}

	/* ---------------------------------------------------------------- 1 ---
	   Zeigerposition
	   Setzt --kd-pointer-x/-y auf dem Element. Der Effekt selbst steckt
	   vollständig im CSS; hier fliessen nur Koordinaten.
	   ---------------------------------------------------------------------- */

	function initPointer() {
		if (!finePointer.matches) return;

		all('[data-kd-pointer]').forEach(function (element) {
			var update = throttle(function (event) {
				var rect = element.getBoundingClientRect();
				element.style.setProperty('--kd-pointer-x', (event.clientX - rect.left) + 'px');
				element.style.setProperty('--kd-pointer-y', (event.clientY - rect.top) + 'px');
			});

			element.addEventListener('pointermove', update, {passive: true});
			element.addEventListener('pointerenter', function () {
				element.classList.add('is-pointing');
			});
			element.addEventListener('pointerleave', function () {
				element.classList.remove('is-pointing');
				element.style.removeProperty('--kd-pointer-x');
				element.style.removeProperty('--kd-pointer-y');
			});
		});
	}

	/* ---------------------------------------------------------------- 2 ---
	   Neigung
	   Höchstens ein paar Grad — genug als Rückmeldung, zu wenig, um vom
	   Inhalt abzulenken.
	   ---------------------------------------------------------------------- */

	function initTilt() {
		if (!finePointer.matches || reduced.matches) return;

		all('[data-kd-tilt]').forEach(function (element) {
			var max = parseFloat(element.getAttribute('data-kd-tilt')) || 5;

			var update = throttle(function (event) {
				var rect = element.getBoundingClientRect();
				var px = (event.clientX - rect.left) / rect.width - 0.5;
				var py = (event.clientY - rect.top) / rect.height - 0.5;
				element.style.setProperty('--kd-tilt-y', (px * max).toFixed(2) + 'deg');
				element.style.setProperty('--kd-tilt-x', (-py * max).toFixed(2) + 'deg');
			});

			element.addEventListener('pointermove', update, {passive: true});
			element.addEventListener('pointerleave', function () {
				element.style.setProperty('--kd-tilt-x', '0deg');
				element.style.setProperty('--kd-tilt-y', '0deg');
			});
		});
	}

	/* ---------------------------------------------------------------- 3 ---
	   Einblenden beim Scrollen
	   Einmalig, danach wird beobachtet aufgehört. Bei Bewegungsreduktion
	   werden alle Elemente sofort sichtbar geschaltet.
	   ---------------------------------------------------------------------- */

	function initReveal() {
		var targets = all('.kd-reveal');
		if (!targets.length) return;

		if (reduced.matches || !('IntersectionObserver' in window)) {
			targets.forEach(function (element) {
				element.classList.add('is-revealed');
			});
			return;
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					entry.target.classList.add('is-revealed');
					observer.unobserve(entry.target);
				});
			},
			{rootMargin: '0px 0px -12% 0px', threshold: 0.12}
		);

		targets.forEach(function (element) {
			observer.observe(element);
		});
	}

	/* ---------------------------------------------------------------- 4 ---
	   Zahlen hochzählen
	   data-kd-count="1284" — der Endwert steht im Attribut, der sichtbare
	   Text ist der Startwert. Ohne JS bleibt der Endwert im Markup stehen.
	   ---------------------------------------------------------------------- */

	function initCounters() {
		var counters = all('[data-kd-count]');
		if (!counters.length) return;

		if (reduced.matches || !('IntersectionObserver' in window)) return;

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					animate(entry.target);
					observer.unobserve(entry.target);
				});
			},
			{threshold: 0.6}
		);

		counters.forEach(function (element) {
			observer.observe(element);
		});

		function animate(element) {
			var target = parseFloat(element.getAttribute('data-kd-count'));
			if (isNaN(target)) return;
			var suffix = element.getAttribute('data-kd-count-suffix') || '';
			var duration = 1100;
			var start = performance.now();

			function step(now) {
				var progress = Math.min((now - start) / duration, 1);
				var eased = 1 - Math.pow(1 - progress, 3);
				var value = Math.round(target * eased);
				element.textContent = value.toLocaleString('de-CH') + suffix;
				if (progress < 1) requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		}
	}

	/* --------------------------------------------------------------- 4b ---
	   Wechselnde Hintergrundbilder im Hero

	   data-kd-slideshow am Medien-Container, optional mit Standzeit in
	   Millisekunden. Sichtbar ist immer genau eine Folie; das Aussehen des
	   Wechsels steckt vollständig im CSS.

	   WCAG 2.2.2 verlangt, dass sich automatische Bewegung anhalten lässt.
	   Die Bedienung wird deshalb hier erzeugt, wenn sie im Markup fehlt —
	   eine Slideshow ohne Pausenschalter soll gar nicht erst entstehen können.
	   Bei prefers-reduced-motion läuft nichts von selbst; die Punkte bleiben,
	   damit man trotzdem blättern kann.
	   ---------------------------------------------------------------------- */

	function initSlideshow() {
		all('[data-kd-slideshow]').forEach(function (media) {
			var slides = all('.kd-hero__slide', media);
			if (slides.length < 2) {
				if (slides.length === 1) slides[0].classList.add('is-active');
				return;
			}

			var interval = parseInt(media.getAttribute('data-kd-slideshow'), 10) || 7000;
			var hero = media.closest('.kd-hero') || media.parentNode;
			var controls = hero.querySelector('.kd-hero__slides-controls');
			var timer = null;
			var index = Math.max(
				0,
				slides.findIndex(function (slide) {
					return slide.classList.contains('is-active');
				})
			);

			function show(next) {
				index = (next + slides.length) % slides.length;
				slides.forEach(function (slide, position) {
					slide.classList.toggle('is-active', position === index);
				});
				if (!controls) return;
				all('.kd-hero__slides-dot', controls).forEach(function (dot, position) {
					if (position === index) dot.setAttribute('aria-current', 'true');
					else dot.removeAttribute('aria-current');
				});
			}

			function stop() {
				if (timer === null) return;
				clearInterval(timer);
				timer = null;
			}

			function start() {
				if (timer !== null || reduced.matches) return;
				timer = setInterval(function () {
					show(index + 1);
				}, interval);
			}

			function setRunning(running) {
				if (running) start();
				else stop();
				if (!controls) return;
				var toggle = controls.querySelector('.kd-hero__slides-toggle');
				if (!toggle) return;
				// aria-pressed beschreibt den Schalter „angehalten", nicht den Lauf.
				toggle.setAttribute('aria-pressed', String(!running));
				toggle.setAttribute('aria-label', running ? 'Bildwechsel anhalten' : 'Bildwechsel fortsetzen');
			}

			if (controls) {
				var toggle = controls.querySelector('.kd-hero__slides-toggle');
				if (toggle) {
					toggle.addEventListener('click', function () {
						setRunning(timer === null);
					});
				}
				all('.kd-hero__slides-dot', controls).forEach(function (dot, position) {
					dot.addEventListener('click', function () {
						show(position);
						setRunning(false); // eine bewusste Wahl beendet den Automatiklauf
					});
				});
				controls.hidden = false;
			}

			// Im Hintergrundtab weiterzublenden kostet Strom und bringt nichts.
			document.addEventListener('visibilitychange', function () {
				if (document.hidden) stop();
				else if (controls) {
					var toggle = controls.querySelector('.kd-hero__slides-toggle');
					if (!toggle || toggle.getAttribute('aria-pressed') !== 'true') start();
				} else {
					start();
				}
			});

			show(index);
			setRunning(!reduced.matches);
		});
	}

	/* ---------------------------------------------------------------- 5 ---
	   Aufklappen
	   data-kd-toggle="ziel-id" schaltet hidden und aria-expanded gemeinsam.
	   ---------------------------------------------------------------------- */

	function initToggles() {
		all('[data-kd-toggle]').forEach(function (trigger) {
			var target = document.getElementById(trigger.getAttribute('data-kd-toggle'));
			if (!target) return;

			trigger.setAttribute('aria-controls', target.id);
			trigger.setAttribute('aria-expanded', String(!target.hidden));

			trigger.addEventListener('click', function () {
				var open = trigger.getAttribute('aria-expanded') === 'true';
				trigger.setAttribute('aria-expanded', String(!open));
				target.hidden = open;
			});
		});

		document.addEventListener('keydown', function (event) {
			if (event.key !== 'Escape') return;
			all('[data-kd-toggle][aria-expanded="true"]').forEach(function (trigger) {
				var target = document.getElementById(trigger.getAttribute('data-kd-toggle'));
				if (!target) return;
				trigger.setAttribute('aria-expanded', 'false');
				target.hidden = true;
				trigger.focus();
			});
		});
	}

	/* ---------------------------------------------------------------- 6 ---
	   Reiter
	   Pfeiltasten, Pos1/Ende nach WAI-ARIA Authoring Practices.
	   ---------------------------------------------------------------------- */

	function initTabs() {
		all('[role="tablist"]').forEach(function (list) {
			var tabs = all('[role="tab"]', list);
			if (!tabs.length) return;

			function select(tab) {
				tabs.forEach(function (item) {
					var selected = item === tab;
					item.setAttribute('aria-selected', String(selected));
					item.tabIndex = selected ? 0 : -1;
					var panel = document.getElementById(item.getAttribute('aria-controls'));
					if (panel) panel.hidden = !selected;
				});
			}

			tabs.forEach(function (tab, index) {
				tab.addEventListener('click', function () {
					select(tab);
				});

				tab.addEventListener('keydown', function (event) {
					var next = null;
					if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
					else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
					else if (event.key === 'Home') next = tabs[0];
					else if (event.key === 'End') next = tabs[tabs.length - 1];
					if (!next) return;
					event.preventDefault();
					select(next);
					next.focus();
				});
			});

			var active = tabs.filter(function (tab) {
				return tab.getAttribute('aria-selected') === 'true';
			})[0];
			select(active || tabs[0]);
		});
	}

	/* ---------------------------------------------------------------- 7 ---
	   Zurück nach oben
	   ---------------------------------------------------------------------- */

	function initBackToTop() {
		var button = document.querySelector('[data-kd-back-to-top]');
		if (!button) return;

		var update = throttle(function () {
			button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.75);
		});

		window.addEventListener('scroll', update, {passive: true});
		update();

		button.addEventListener('click', function () {
			window.scrollTo({top: 0, behavior: reduced.matches ? 'auto' : 'smooth'});
			var skip = document.querySelector('.kd-skip-link');
			if (skip) skip.focus();
		});
	}

	/* ---------------------------------------------------------------- 8 ---
	   Sprungnavigation mit Zustandsanzeige
	   ---------------------------------------------------------------------- */

	function initScrollSpy() {
		var nav = document.querySelector('[data-kd-scrollspy]');
		if (!nav || !('IntersectionObserver' in window)) return;

		var links = all('a[href^="#"]', nav);
		var sections = links
			.map(function (link) {
				return document.getElementById(link.getAttribute('href').slice(1));
			})
			.filter(Boolean);
		if (!sections.length) return;

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					links.forEach(function (link) {
						var active = link.getAttribute('href') === '#' + entry.target.id;
						if (active) link.setAttribute('aria-current', 'true');
						else link.removeAttribute('aria-current');
					});
				});
			},
			{rootMargin: '-25% 0px -65% 0px'}
		);

		sections.forEach(function (section) {
			observer.observe(section);
		});
	}

	/* ---------------------------------------------------------------- 9 ---
	   Theme und Skin
	   Die Wahl wird gespeichert; ohne gespeicherte Wahl entscheidet das
	   Betriebssystem (prefers-color-scheme).
	   ---------------------------------------------------------------------- */

	var STORAGE_THEME = 'kd-theme';
	var STORAGE_SKIN = 'kd-skin';

	function store(key, value) {
		try {
			if (value === null) window.localStorage.removeItem(key);
			else window.localStorage.setItem(key, value);
		} catch (error) {
			/* Privater Modus: Wahl gilt nur für diese Sitzung. */
		}
	}

	function stored(key) {
		try {
			return window.localStorage.getItem(key);
		} catch (error) {
			return null;
		}
	}

	function applyTheme(theme) {
		if (theme) root.setAttribute('data-kd-theme', theme);
		else root.removeAttribute('data-kd-theme');

		var dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
		all('[data-kd-theme-toggle]').forEach(function (button) {
			button.setAttribute('aria-pressed', String(dark));
			var label = button.querySelector('[data-kd-theme-label]');
			if (label) label.textContent = dark ? 'Hell' : 'Dunkel';
		});
	}

	function applySkin(skin) {
		['intranet', 'freebrand'].forEach(function (name) {
			document.body.classList.toggle('kd-skin-' + name, skin === name);
		});
		all('[data-kd-skin]').forEach(function (button) {
			button.setAttribute('aria-pressed', String(button.getAttribute('data-kd-skin') === (skin || 'default')));
		});
	}

	/** true, wenn gerade dunkel dargestellt wird — egal ob gesetzt oder vom System. */
	function isDark() {
		var current = root.getAttribute('data-kd-theme');
		if (current) return current === 'dark';
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function currentSkin() {
		if (document.body.classList.contains('kd-skin-intranet')) return 'intranet';
		if (document.body.classList.contains('kd-skin-freebrand')) return 'freebrand';
		return 'default';
	}

	function initTheme() {
		// Eine gespeicherte Wahl gewinnt; sonst bleibt stehen, was im Markup steht.
		applyTheme(stored(STORAGE_THEME) || root.getAttribute('data-kd-theme'));
		applySkin(stored(STORAGE_SKIN) || currentSkin());

		all('[data-kd-theme-toggle]').forEach(function (button) {
			button.addEventListener('click', function () {
				var next = isDark() ? 'light' : 'dark';
				store(STORAGE_THEME, next);
				applyTheme(next);
			});
		});

		all('[data-kd-skin]').forEach(function (button) {
			button.addEventListener('click', function () {
				var skin = button.getAttribute('data-kd-skin');
				store(STORAGE_SKIN, skin === 'default' ? null : skin);
				applySkin(skin);
			});
		});
	}

	/* --------------------------------------------------------------------- */

	function init() {
		initPointer();
		initTilt();
		initReveal();
		initCounters();
		initSlideshow();
		initToggles();
		initTabs();
		initBackToTop();
		initScrollSpy();
		initTheme();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	window.KDesign = {init: init, applyTheme: applyTheme, applySkin: applySkin};
})();
