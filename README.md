# Kis Mentő Iskola

Elsősegély-tanuló webalkalmazás alsó tagozatosoknak. Az első oldalon rajzokkal,
lépésről lépésre mutatja be a technikákat, a kvíz oldalon pedig kikérdezi őket.

Technikák: újraélesztés, szívmasszázs, nyaksérülés, csonttörés, vágás/vérzés.

## Futtatás

Nincs build és nincs függőség: elég duplán kattintani az `index.html`-re.

A JS fájlok szándékosan **nem** ES modulok (a böngésző azokat `file://`-ról nem tölti be),
hanem sima scriptek, amelyek a közös `KM` névtérbe regisztrálnak
(`(function (KM) { … })(globalThis.KM = globalThis.KM || {})`). Ezért a HTML-ben
a `<script defer>` sorrend számít: előbb az adat, aztán a core, a ui, végül az oldal scriptje.

Ha mégis szerverről futtatnád: `npm start` (npx serve .) vagy `python -m http.server`.

Tesztek (Node 20+):

```sh
npm test
```

## Felépítés

```
index.html, kviz.html     két vékony HTML-váz, a tartalmat a JS rajzolja ki
css/style.css             design tokenek (:root) + komponensek
js/data/techniques.js     tananyag: technikák és lépéseik
js/data/questions.js      kvízkérdések technikánként
js/core/quiz.js           kvízlogika DOM nélkül (keverés, ellenőrzés, pontozás)
js/core/storage.js        localStorage hibatűrő wrapper (legjobb eredmény)
js/ui/dom.js              el() – kis elemkészítő segéd
js/ui/layout.js           közös fejléc, lábléc, Aranyszabály doboz
js/ui/learn-page.js       Tanulok oldal
js/ui/quiz-page.js        Kvíz oldal + kérdéstípusok rendererei
img/<technika-id>/*.svg   illusztrációk; img/common/ a több helyen használt rajzok
tests/                    node --test: logika + adatintegritás (load.js tölti be a scripteket)
```

## Tartalom bővítése

**Új technika**
1. Új objektum a `js/data/techniques.js` `techniques` tömbjébe (`id`, cím, ikon, szín, lépések).
2. Rajzok az `img/<id>/` mappába; a lépés `image` mezője `"<id>/<fájlnév>"` (kiterjesztés nélkül).
3. Kérdések a `js/data/questions.js`-ben, az `<id>` kulcs alá.

**Új kérdés**: új elem a megfelelő technika listájába. A típusok leírása a fájl tetején van.
A választási lehetőségek sorrendjét a kvíz megkeveri.

Futtasd a `npm test`-et: jelzi, ha hiányzik egy kép, rossz a helyes válasz indexe,
vagy egy technikához nincs kérdés.

**Új kérdéstípus**: egy renderer függvény a `js/ui/quiz-page.js` `renderers` objektumába,
a típus neve a `QUESTION_TYPES` listába (`js/core/quiz.js`), és ha kell, ellenőrzés az `isCorrect`-be.

## Szakmai megjegyzés

A tartalom a laikus elsősegély ajánlásait követi (112, 30:2, 100–120 nyomás/perc,
nyaksérültet nem mozgatunk). Az oldal tanulásra való, nem helyettesíti az elsősegély-tanfolyamot.
