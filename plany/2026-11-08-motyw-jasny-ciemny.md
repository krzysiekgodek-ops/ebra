# Plan: motyw jasny/ciemny na ebra.pl

**Data:** 2026-11-08 · **Autor:** Cowork · **Apka:** strona · **Kod w:** apps\EBRA\strona
**Deploy:** tak (zgoda Krzyśka 2026-11-08, po obejrzeniu zrzutów; push = wdrożenie, robi Krzysiek)

## Cel
Strona ma dziś tylko motyw ciemny. Dodajemy motyw jasny (ciepły „papier") i przełącznik w nagłówku; wybór jest zapamiętywany, a przy pierwszej wizycie wynika z ustawień systemu. Ciemny motyw ma wyglądać dokładnie jak dziś.

## Zakres
- Dopisanie bloku CSS motywu na końcu `style.css` oraz zamiana kilku sztywnych kolorów na zmienne.
- Przełącznik (księżyc/słońce) w nagłówku `index.html`, obsługa w `script.js`, skrypt w <head> zapobiegający błyskowi złego motywu.
- Podstrony prawne (`polityka_cookies.html`, `polityka_prywatnosci.html`, `regulamin.html`, `regulamin_rodo.html`) ładują `style.css`: dodać tam skrypt z <head>, a przycisk tylko jeśli mają nagłówek jak strona główna.
- NIE ruszać: treści, układu, obrazów (`img/`), sekcji Abonament (poza kolorami przez zmienne), `.github/workflows/deploy.yml`, `.gitignore`, `README.md`.

## Zgodność z ustaleniami wspólnymi
Bez wpływu na plany/limity, upload, admina, reklamy i reguły Firestore. Paleta jasnego motywu zaprojektowana i sprawdzona na kopii strony (zrzuty desktop/telefon/modal przesłane Krzyśkowi 2026-11-08), kontrast tekstu co najmniej 4,5:1 (WCAG AA), reguła 60-30-10: krem = tło, beże i ciemne banery = pasma, złoto = akcent.

## Pliki do zmiany
- `style.css` – blok CSS (niżej) na końcu; w `body` zamiast `background:#0f0e0c; color:#e8e3d8` użyć `var(--bg)` / `var(--text1)`; `::-webkit-scrollbar-thumb` → `var(--scroll-thumb)`; `.site-header` background → `var(--header-bg)`.
- `index.html` – w <head> przed `style.css`: `<meta name="color-scheme" content="dark light">` i skrypt wyboru motywu; w nagłówku przycisk `#themeToggle` przed `.menu-toggle`; owinąć `.theme-toggle` i `.menu-toggle` w `<div class="header-actions">` (flex, `align-items:center`, `gap:.4rem`), przy tym `.theme-toggle { margin-left:0 }`.
- `script.js` – (a) ok. linii 43–45: zamiast `header.style.background = ...` użyć `header.classList.add('scrolled')` / `remove('scrolled')`; (b) menu mobilne ok. linii 161: `background:rgba(15,14,12,0.98)` → `var(--header-bg-solid)`, `border-bottom ... rgba(255,255,255,0.07)` → `var(--border)`; sprawdzić też ok. linii 138 (`rgba(255,255,255,0.07)`); (c) obsługa przełącznika (niżej); cząsteczki hero zostają bez zmian.
- 4 podstrony prawne – skrypt z <head>; sprawdzić ich lokalne `<style>` pod kątem sztywnych kolorów (poprawić zmiennymi, jeśli nieczytelne w jasnym).

### Skrypt w <head> (przed `style.css`)
```html
<meta name="color-scheme" content="dark light">
<script>
(function () {
  var t = null;
  try { t = localStorage.getItem('ebra-theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    t = (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
})();
</script>
```

### Przycisk w nagłówku
```html
<button class="theme-toggle" id="themeToggle" type="button" aria-label="Przełącz motyw jasny/ciemny" title="Motyw">
  <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
  <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
</button>
```

### Obsługa w `script.js`
```js
(function () {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var root = document.documentElement;
  function apply(t) {
    root.setAttribute('data-theme', t);
    btn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    m.content = t === 'light' ? '#faf6ec' : '#0f0e0c';
  }
  apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem('ebra-theme', next); } catch (e) {}
  });
})();
```

### Blok CSS (wkleić na koniec `style.css` bez zmian)
```css
/* ============================================
   MOTYW JASNY / CIEMNY
   Domyślne tokeny (:root) = ciemny. Jasny: [data-theme="light"].
   ============================================ */
:root {
    color-scheme: dark;
    --header-bg:        rgba(15,14,12,0.92);
    --header-bg-solid:  rgba(15,14,12,0.98);
    --btn-gold-a:       var(--gold-d);
    --btn-gold-b:       var(--gold);
    --btn-gold-text:    #1a1000;
    --shadow-card:      rgba(0,0,0,0.4);
    --overlay:          rgba(10,8,5,0.85);
    --scroll-thumb:     #3a3630;
    --mouse-line:       rgba(255,255,255,0.2);
}

[data-theme="light"] {
    color-scheme: light;
    --bg:       #faf6ec;
    --bg2:      #f3ebd8;
    --bg3:      #fffdf7;
    --gold:     #7d5e08;
    --gold-l:   #8a6706;
    --gold-d:   #8a6a10;
    --cream:    #f2e9d0;
    --text1:    #1d1810;
    --text2:    #5a5243;
    --text3:    #6f6757;
    --border:   rgba(70,50,15,0.15);

    --header-bg:        rgba(250,246,236,0.92);
    --header-bg-solid:  rgba(250,246,236,0.98);
    --btn-gold-a:       #d9b13a;
    --btn-gold-b:       #c9a227;
    --shadow-card:      rgba(70,50,15,0.16);
    --overlay:          rgba(40,30,10,0.55);
    --scroll-thumb:     #cbbf9f;
    --mouse-line:       rgba(0,0,0,0.28);
}

body { background: var(--bg); color: var(--text1); transition: background-color .3s, color .3s; }
::-webkit-scrollbar-thumb { background: var(--scroll-thumb); }

.site-header { background: var(--header-bg); }
.site-header.scrolled { background: var(--header-bg-solid); }

.btn-primary, .plan-btn, .plan-badge {
    background: linear-gradient(135deg, var(--btn-gold-a), var(--btn-gold-b));
    color: var(--btn-gold-text);
}
.plan-btn-ghost { background: transparent; color: var(--text1); }

.scroll-mouse { border-color: var(--mouse-line); }
.instr-card:hover, .plan-card:hover, .mini-card:hover { box-shadow: 0 15px 35px var(--shadow-card); }
.modal { background: var(--overlay); }
.modal-content { box-shadow: 0 30px 60px var(--shadow-card); }

[data-theme="light"] .hero::before {
    background:
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,162,39,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 50% 50% at 15% 60%, rgba(192,57,43,0.07) 0%, transparent 45%),
        radial-gradient(ellipse 50% 50% at 85% 60%, rgba(39,130,176,0.07) 0%, transparent 45%);
}
[data-theme="light"] .hero::after { opacity: 0.04; }

[data-theme="light"] .hero-badge,
[data-theme="light"] .instr-icon-wrap,
[data-theme="light"] .modal-badge-pwa { background: rgba(138,103,6,0.10); border-color: rgba(138,103,6,0.28); }
[data-theme="light"] .feat-check { background: rgba(138,103,6,0.12); border-color: rgba(138,103,6,0.32); }
[data-theme="light"] .plan-card-featured {
    background: linear-gradient(160deg, rgba(201,162,39,0.16), var(--bg3) 60%);
    border-color: rgba(138,103,6,0.5);
    box-shadow: 0 10px 40px rgba(201,162,39,0.18);
}
[data-theme="light"] .plan-btn-ghost { border-color: rgba(138,103,6,0.45); }
[data-theme="light"] .plan-card,
[data-theme="light"] .instr-card { background: var(--bg3); }
[data-theme="light"] .mini-card { background: var(--bg3); }

[data-theme="light"] .instr-card.banner-style { background: var(--bg3) !important; }
[data-theme="light"] .instr-card.banner-style .banner-bg { opacity: 0.5; }
[data-theme="light"] .instr-card.banner-style .banner-overlay {
    background: linear-gradient(105deg, rgba(255,253,247,0.97) 0%, rgba(255,253,247,0.88) 45%, rgba(255,253,247,0.35) 100%) !important;
    opacity: 1 !important;
}

.theme-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; margin-left: 1rem;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent; color: var(--text2);
    cursor: pointer; transition: all var(--tr);
}
.theme-toggle:hover { color: var(--gold); border-color: var(--gold); transform: rotate(18deg); }
.theme-toggle:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.theme-toggle svg { width: 20px; height: 20px; }
.theme-toggle .icon-sun { display: none; }
[data-theme="light"] .theme-toggle .icon-sun { display: block; }
[data-theme="light"] .theme-toggle .icon-moon { display: none; }
```

## Kroki
1. Zrób zrzut strony głównej w ciemnym motywie (desktop 1366 px) jako punkt odniesienia.
2. Wprowadź zmiany z sekcji „Pliki do zmiany”. Bloku CSS nie modyfikuj; gdy zauważysz kolejny sztywny ciemny kolor psujący jasny motyw, popraw go zmienną i opisz w FYI.
3. Uruchom podgląd i zrób zrzuty: jasny i ciemny, desktop 1366 px i telefon 390 px, oraz otwarte okno „Kalkulator na telefonie” w obu motywach.

## Testy i kryteria odbioru
- Ciemny motyw bez różnic względem zrzutu odniesienia.
- Przełącznik działa, wybór przetrwa odświeżenie, brak błysku złego motywu przy ładowaniu; ikona: księżyc w ciemnym, słońce w jasnym.
- Przełącznik dostępny z klawiatury (Tab, widoczny focus); na telefonie stoi obok hamburgera, a menu po rozwinięciu ma poprawne tło w obu motywach.
- Karta „Kalkulator na telefonie” (inline-owy ciemny gradient) czytelna w jasnym motywie; sekcja Abonament czytelna w obu.
- Podstrony prawne respektują wybrany motyw i są czytelne.
- Pokaż Krzyśkowi zrzuty przed commitem.

## Po wykonaniu
Code: commit (razem z planem) tylko plików z planu (`style.css`, `script.js`, `index.html`, 4 podstrony prawne, ten plan); `git add` jawnie, bez `-A`. Wpis FYI + zamknięcie REQUEST w `apps\EBRA\inbox.md`, `HANDOVER.md` apki (jeśli istnieje). Bez deployu; push robi Krzysiek.
