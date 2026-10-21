/**
 * A tananyag egyetlen forrása – a tanulás és a kvíz oldal is innen dolgozik.
 * Új technika: új objektum a `techniques` tömbbe + képek az img/<id>/ mappába
 * + kérdések a questions.js-be. Kódot nem kell módosítani.
 */

(function (KM) {
  'use strict';

  /**
   * @typedef {object} Step
   * @property {string} title
   * @property {string} text
   * @property {string} image  Képhivatkozás, pl. "vagas/press" → img/vagas/press.svg
   */

  /**
   * @typedef {object} Technique
   * @property {string} id      URL-ben és mappanévként is használt azonosító
   * @property {string} title
   * @property {string} icon    Emoji a kártyán
   * @property {string} color   Kiemelő szín (CSS szín)
   * @property {string} intro   Egymondatos bevezető
   * @property {Step[]} steps
   */

  /** @param {string} ref */
  const imagePath = (ref) => `img/${ref}.svg`;

  const goldenRules = [
    { icon: '👀', title: 'Nézz körül!', text: 'Biztonságos a hely? Ne legyen veszélyben te sem!' },
    { icon: '🙋', title: 'Szólj egy felnőttnek!', text: 'Kiabálj segítségért, ne maradj egyedül.' },
    { icon: '📞', title: 'Hívd a 112-t!', text: 'Ingyenes, és bármelyik telefonról hívható.' },
  ];

  /** @type {Technique[]} */
  const techniques = [
    {
      id: 'ujraelesztes',
      title: 'Újraélesztés',
      icon: '❤️',
      color: '#E63946',
      intro: 'Ha valaki összeesik, nem válaszol és nem lélegzik rendesen.',
      steps: [
        {
          title: 'Szólítsd meg!',
          text: 'Hangosan szólj hozzá, és óvatosan rázd meg a vállát: „Jól vagy?”',
          image: 'ujraelesztes/check',
        },
        {
          title: 'Figyeld a légzését!',
          text: 'Hajtsd hátra kicsit a fejét, emeld meg az állát. Nézd, emelkedik-e a mellkasa – számolj 10-ig.',
          image: 'ujraelesztes/breath',
        },
        {
          title: 'Hívd a 112-t!',
          text: 'Ha nem válaszol és nem lélegzik rendesen: hívd a 112-t, és tedd hangosra a telefont. Kérj valakit, hogy hozzon AED-t!',
          image: 'common/call112',
        },
        {
          title: '30 nyomás, 2 befúvás',
          text: 'Nyomd a mellkasát 30-szor, aztán ha tudod, fújj 2-szer a szájába. Ha nem megy a befúvás, csak nyomd tovább!',
          image: 'ujraelesztes/cpr',
        },
        {
          title: 'Ne hagyd abba!',
          text: 'Folytasd, amíg megjön a mentő. Ha megérkezik az AED (a „beszélő doboz”), kapcsold be, és csináld, amit mond!',
          image: 'ujraelesztes/aed',
        },
      ],
    },
    {
      id: 'szivmasszazs',
      title: 'Szívmasszázs',
      icon: '🤲',
      color: '#F77F00',
      intro: 'Így nyomd a mellkast, hogy a szív helyett te pumpáld a vért.',
      steps: [
        {
          title: 'Kemény helyre fektesd',
          text: 'A beteg feküdjön a hátán, a földön. Térdelj le mellé.',
          image: 'szivmasszazs/floor',
        },
        {
          title: 'Kéz a mellkas közepére',
          text: 'Tedd az egyik tenyered a mellkasa közepére, a másikat rá, és kulcsold össze az ujjaidat.',
          image: 'szivmasszazs/hands',
        },
        {
          title: 'Nyújtott karral, felülről',
          text: 'Hajolj fölé, a karod legyen egyenes, mint két oszlop. A tested súlyával nyomj.',
          image: 'szivmasszazs/arms',
        },
        {
          title: 'Erősen és gyorsan',
          text: 'Nyomj kb. 5–6 cm mélyre, másodpercenként kétszer – mintha egy gyors dal ritmusára táncolnál. Számolj hangosan!',
          image: 'szivmasszazs/rhythm',
        },
        {
          title: 'Engedd vissza!',
          text: 'Minden nyomás után hagyd, hogy a mellkas visszaemelkedjen, de a kezed maradjon rajta.',
          image: 'szivmasszazs/release',
        },
      ],
    },
    {
      id: 'nyaksereles',
      title: 'Nyaksérülés',
      icon: '🧍',
      color: '#7B61FF',
      intro: 'Ha valaki nagyot esett, és fáj a nyaka vagy a háta.',
      steps: [
        {
          title: 'Mikor gondolj rá?',
          text: 'Ha valaki leesett (például fáról vagy bicikliről), vagy fejjel a vízbe ugrott, és fáj a nyaka vagy a háta.',
          image: 'nyaksereles/danger',
        },
        {
          title: 'Ne mozgasd!',
          text: 'Ne ültesd fel, ne emeld fel a fejét, ne fordítsd meg. Csak akkor vidd el onnan, ha ott veszélyben van (például tűz).',
          image: 'nyaksereles/dontmove',
        },
        {
          title: 'Hívd a 112-t!',
          text: 'Szólj egy felnőttnek, és hívjátok a mentőt.',
          image: 'common/call112',
        },
        {
          title: 'Tartsd a fejét',
          text: 'Térdelj a feje mögé, és két kézzel, óvatosan tartsd a fejét úgy, ahogy van. Ne egyenesítsd ki!',
          image: 'nyaksereles/hold',
        },
        {
          title: 'Beszélj hozzá',
          text: 'Mondd neki, hogy ne mozogjon, és hogy jön a segítség. Takard be, hogy ne fázzon.',
          image: 'nyaksereles/talk',
        },
      ],
    },
    {
      id: 'csonttores',
      title: 'Csonttörés',
      icon: '🦴',
      color: '#2A9D8F',
      intro: 'Ha valaki elesett, és nagyon fáj a keze vagy a lába.',
      steps: [
        {
          title: 'Honnan tudod?',
          text: 'Nagyon fáj, megdagad, kék lesz, furcsán áll, vagy nem tudja mozgatni.',
          image: 'csonttores/signs',
        },
        {
          title: 'Ne egyenesítsd ki!',
          text: 'Hagyd úgy, ahogy van. Ne húzd, ne nyomkodd!',
          image: 'csonttores/dontstraighten',
        },
        {
          title: 'Támaszd ki',
          text: 'Párnával vagy összehajtott ruhával támaszd alá, hogy ne mozogjon. A kart egy kendővel fel lehet kötni a nyakába.',
          image: 'csonttores/sling',
        },
        {
          title: 'Hűtsd!',
          text: 'Tegyél rá hideg borogatást vagy jeget, de mindig egy ruhán keresztül, ne közvetlenül a bőrre.',
          image: 'csonttores/cold',
        },
        {
          title: 'Irány az orvos!',
          text: 'Szólj egy felnőttnek, aki orvoshoz viszi. Ha nagyon súlyos (például kilátszik a csont), hívjátok a 112-t!',
          image: 'common/ambulance',
        },
      ],
    },
    {
      id: 'vagas',
      title: 'Vágás, vérzés',
      icon: '🩹',
      color: '#E76F51',
      intro: 'Ha valaki megvágta magát, és vérzik.',
      steps: [
        {
          title: 'Védd magad!',
          text: 'Ha van, húzz kesztyűt (vagy tegyél zacskót a kezedre), és ültesd le a sérültet.',
          image: 'vagas/gloves',
        },
        {
          title: 'Nyomd erősen!',
          text: 'Tiszta ruhával vagy gézzel nyomd rá erősen a sebre.',
          image: 'vagas/press',
        },
        {
          title: 'Ne vedd le!',
          text: 'Ha átázik a ruha, tegyél rá még egyet, de az elsőt ne vedd le!',
          image: 'vagas/more',
        },
        {
          title: 'Kis seb',
          text: 'A kis vágást, karcolást mosd ki tiszta vízzel, és tegyél rá sebtapaszt.',
          image: 'vagas/small',
        },
        {
          title: 'Nagy vérzés: 112',
          text: 'Ha sokat vérzik és nem áll el, nyomd tovább folyamatosan, és hívjátok a 112-t!',
          image: 'common/call112',
        },
      ],
    },
  ];

  Object.assign(KM, { imagePath, goldenRules, techniques });
})((globalThis.KM = globalThis.KM || {}));
