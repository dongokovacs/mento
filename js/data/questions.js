/**
 * Kvízkérdések technikánként csoportosítva. Az `id` és a `techniqueId`
 * automatikusan kerül rájuk, ezért itt csak a tartalmat kell megírni.
 *
 * Típusok:
 * - choice:    options: string[], answer: helyes index, opcionális image + imageAlt
 * - image:     options: {image, alt}[], answer: helyes index
 * - truefalse: answer: boolean
 * - order:     items: a lépések HELYES sorrendben (a kvíz keveri meg)
 *
 * A választási lehetőségeket a kvíz megkeveri, a sorrendjük itt mindegy.
 */

(function (KM) {
  'use strict';

  /**
   * @typedef {object} Question
   * @property {string} id
   * @property {string} techniqueId
   * @property {'choice'|'image'|'truefalse'|'order'} type
   * @property {string} prompt
   * @property {string} explain                  Visszajelzés válasz után
   * @property {Array<string | {image: string, alt: string}>} [options]
   * @property {number | boolean} [answer]
   * @property {string[]} [items]
   * @property {string} [image]
   * @property {string} [imageAlt]
   */

  const bank = {
    ujraelesztes: [
      {
        type: 'choice',
        prompt: 'Mi az első, amit csinálsz, ha valaki összeesik?',
        options: ['Megnézem, biztonságos-e a hely', 'Elszaladok', 'Vizet öntök rá'],
        answer: 0,
        explain: 'Először mindig nézz körül: ne legyél veszélyben te sem!',
      },
      {
        type: 'choice',
        prompt: 'Melyik számot hívod, ha baj van?',
        options: ['100', '112', '555'],
        answer: 1,
        explain: 'A 112 ingyenes, és bármelyik telefonról hívható.',
      },
      {
        type: 'choice',
        prompt: 'Hányszor nyomod meg a mellkast, mielőtt 2-szer befújsz?',
        options: ['10-szer', '30-szor', '100-szor'],
        answer: 1,
        explain: '30 nyomás, 2 befúvás – és kezded elölről.',
      },
      {
        type: 'truefalse',
        prompt: 'Ha valaki nem válaszol és nem lélegzik rendesen, újra kell éleszteni.',
        answer: true,
        explain: 'Így van! Hívd a 112-t, és kezdd el a szívmasszázst.',
      },
      {
        type: 'order',
        prompt: 'Tedd sorba a lépéseket!',
        items: ['Szólítsd meg, rázd meg a vállát', 'Nézd meg, lélegzik-e', 'Hívd a 112-t', '30 nyomás, 2 befúvás'],
        explain: 'Megszólítás, légzés figyelése, 112, aztán nyomás.',
      },
      {
        type: 'choice',
        prompt: 'Mi ez a zöld doboz?',
        image: 'ujraelesztes/aed',
        imageAlt: 'Zöld doboz szívvel és villámmal',
        options: ['AED – beszélő doboz, ami segít újraéleszteni', 'Elsősegélydoboz ragtapasszal', 'Rádió'],
        answer: 0,
        explain: 'Az AED megmondja, mit csinálj. Csak kapcsold be, és figyelj rá!',
      },
      {
        type: 'truefalse',
        prompt: 'Ha elfáradtál, de még nem jött meg a mentő, nyugodtan abbahagyhatod.',
        answer: false,
        explain: 'Ne hagyd abba! Ha van ott más is, cseréljetek, hogy pihenni tudjatok.',
      },
    ],
    szivmasszazs: [
      {
        type: 'image',
        prompt: 'Hová teszed a kezed szívmasszázsnál?',
        options: [
          { image: 'szivmasszazs/hands', alt: 'Kezek a mellkas közepén' },
          { image: 'szivmasszazs/hands-wrong', alt: 'Kezek a hason' },
        ],
        answer: 0,
        explain: 'A mellkas közepére! A hasat nem szabad nyomni.',
      },
      {
        type: 'image',
        prompt: 'Melyik a jó testtartás?',
        options: [
          { image: 'szivmasszazs/arms', alt: 'Egyenes, nyújtott karok' },
          { image: 'szivmasszazs/arms-wrong', alt: 'Behajlított karok' },
        ],
        answer: 0,
        explain: 'Egyenes karral, felülről nyomj – így kevésbé fáradsz el.',
      },
      {
        type: 'choice',
        prompt: 'Milyen gyorsan nyomd a mellkast?',
        options: ['Másodpercenként kb. 2-szer', 'Percenként egyszer', 'Amilyen lassan csak tudom'],
        answer: 0,
        explain: 'Gyorsan: másodpercenként kétszer, mint egy pörgős dal ritmusa.',
      },
      {
        type: 'choice',
        prompt: 'Hol feküdjön a beteg szívmasszázs közben?',
        options: ['Puha ágyon', 'Kemény talajon, a hátán', 'Ülve egy széken'],
        answer: 1,
        explain: 'Kemény talajon, a hátán – puha ágyon nem lehet jól nyomni.',
      },
      {
        type: 'truefalse',
        prompt: 'Minden nyomás után hagyni kell, hogy a mellkas visszaemelkedjen.',
        answer: true,
        explain: 'Igen! Így tud újra megtelni a szív vérrel.',
      },
      {
        type: 'truefalse',
        prompt: 'Szívmasszázsnál nagyon finoman, alig kell nyomni.',
        answer: false,
        explain: 'Erősen kell nyomni, kb. 5–6 cm mélyre. Ne félj, ezzel segítesz!',
      },
      {
        type: 'order',
        prompt: 'Tedd sorba a lépéseket!',
        items: ['Fektesd a hátára, kemény helyre', 'Tedd a kezed a mellkas közepére', 'Nyújtsd ki a karod', 'Nyomj erősen és gyorsan'],
        explain: 'Fektetés, kéz a helyére, egyenes kar, aztán nyomás.',
      },
    ],
    nyaksereles: [
      {
        type: 'truefalse',
        prompt: 'Ha valaki leesett a fáról és fáj a nyaka, fel kell ültetni.',
        answer: false,
        explain: 'Ne mozgasd! A mozgatás még nagyobb bajt okozhat.',
      },
      {
        type: 'image',
        prompt: 'Melyik a helyes?',
        options: [
          { image: 'nyaksereles/lift-wrong', alt: 'Valaki felemeli a sérült fejét' },
          { image: 'nyaksereles/hold', alt: 'Valaki két kézzel mozdulatlanul tartja a sérült fejét' },
        ],
        answer: 1,
        explain: 'A fejét úgy tartsd, ahogy van – ne emeld fel!',
      },
      {
        type: 'choice',
        prompt: 'Mikor szabad elmozdítani egy nyaksérültet?',
        options: ['Csak ha ott veszélyben van (például tűz)', 'Ha kényelmetlenül fekszik', 'Ha meg akarom nézni a hátát'],
        answer: 0,
        explain: 'Csak akkor, ha ott maradni veszélyesebb lenne.',
      },
      {
        type: 'choice',
        prompt: 'Mit mondasz a sérültnek?',
        options: ['Ne mozogj, jön a segítség!', 'Állj fel gyorsan!', 'Forgasd meg a fejed!'],
        answer: 0,
        explain: 'Nyugtasd meg, és kérd, hogy maradjon mozdulatlan.',
      },
      {
        type: 'order',
        prompt: 'Tedd sorba a lépéseket!',
        items: ['Nézd meg, biztonságos-e a hely', 'Hívd a 112-t', 'Tartsd a fejét úgy, ahogy van', 'Beszélj hozzá, nyugtasd'],
        explain: 'Biztonság, 112, fej megtartása, nyugtatás.',
      },
      {
        type: 'truefalse',
        prompt: 'A sérült fejét úgy tartod, ahogy találtad – nem egyenesíted ki.',
        answer: true,
        explain: 'Pontosan! Ne igazgasd, csak tartsd.',
      },
    ],
    csonttores: [
      {
        type: 'truefalse',
        prompt: 'A törött kezet ki kell egyenesíteni.',
        answer: false,
        explain: 'Soha ne egyenesítsd ki! Hagyd úgy, ahogy van.',
      },
      {
        type: 'choice',
        prompt: 'Mivel támaszthatod ki a törött végtagot?',
        options: ['Párnával, összehajtott ruhával', 'Semmivel, mozgatni kell', 'Egy pattogó labdával'],
        answer: 0,
        explain: 'Puha dolgokkal támaszd alá, hogy ne mozogjon.',
      },
      {
        type: 'choice',
        prompt: 'Hogyan teszed rá a jeget?',
        options: ['Közvetlenül a bőrre', 'Egy ruhába csavarva', 'Sehogy, a jég tilos'],
        answer: 1,
        explain: 'Mindig ruhán keresztül, különben megfagyhat a bőr.',
      },
      {
        type: 'image',
        prompt: 'Melyik a helyes?',
        options: [
          { image: 'csonttores/pull-wrong', alt: 'Valaki húzza a sérült kezét' },
          { image: 'csonttores/sling', alt: 'A sérült kar kendővel fel van kötve' },
        ],
        answer: 1,
        explain: 'A kart fel lehet kötni egy kendővel. Húzni tilos!',
      },
      {
        type: 'choice',
        prompt: 'Melyik lehet a csonttörés jele?',
        options: ['Viszket', 'Nagyon fáj, megdagad, furcsán áll', 'Hideg a keze'],
        answer: 1,
        explain: 'Erős fájdalom, dagadás, kék folt, furcsa alak – ezek a jelek.',
      },
      {
        type: 'order',
        prompt: 'Tedd sorba a lépéseket!',
        items: ['Ne mozgasd, ne egyenesítsd ki', 'Támaszd ki párnával vagy kendővel', 'Hűtsd ruhán keresztül', 'Menjetek orvoshoz egy felnőttel'],
        explain: 'Nem mozgatjuk, kitámasztjuk, hűtjük, aztán orvoshoz megyünk.',
      },
    ],
    vagas: [
      {
        type: 'choice',
        prompt: 'Mivel nyomod a vérző sebet?',
        options: ['Tiszta ruhával vagy gézzel', 'Földdel', 'Egy falevéllel'],
        answer: 0,
        explain: 'Tiszta ruha vagy géz kell, hogy ne kerüljön kosz a sebbe.',
      },
      {
        type: 'image',
        prompt: 'Átázott a ruha. Mit csinálsz?',
        options: [
          { image: 'vagas/remove-wrong', alt: 'Valaki leveszi a véres ruhát a sebről' },
          { image: 'vagas/more', alt: 'Valaki egy új ruhát tesz a régire' },
        ],
        answer: 1,
        explain: 'Tegyél rá még egyet, de az elsőt hagyd rajta!',
      },
      {
        type: 'truefalse',
        prompt: 'A kis karcolást tiszta vízzel kell kimosni.',
        answer: true,
        explain: 'Igen, aztán jöhet rá a sebtapasz.',
      },
      {
        type: 'truefalse',
        prompt: 'Ha nagyon vérzik a seb, elég ráfújni.',
        answer: false,
        explain: 'Nem elég! Erősen nyomni kell, és hívni a 112-t.',
      },
      {
        type: 'choice',
        prompt: 'Mit csinálsz, ha nagyon vérzik és nem áll el?',
        options: ['Leveszem a kötést, és megnézem', 'Nyomom tovább, és hívjuk a 112-t', 'Nem csinálok semmit'],
        answer: 1,
        explain: 'Folyamatosan nyomd, és hívjatok segítséget.',
      },
      {
        type: 'order',
        prompt: 'Tedd sorba a lépéseket!',
        items: ['Húzz kesztyűt', 'Nyomd erősen tiszta ruhával', 'Ha átázik, tegyél rá még egyet', 'Ha nem áll el: 112'],
        explain: 'Kesztyű, nyomás, újabb ruha, és ha kell, mentő.',
      },
    ],
  };

  /** @type {Question[]} */
  const questions = Object.entries(bank).flatMap(([techniqueId, list]) =>
    list.map((question, i) => ({ ...question, id: `${techniqueId}-${i + 1}`, techniqueId })),
  );

  Object.assign(KM, { questions });
})((globalThis.KM = globalThis.KM || {}));
