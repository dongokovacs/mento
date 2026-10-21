(function (KM) {
  'use strict';

  const { goldenRules, el } = KM;

  const NAV = [
    { page: 'learn', href: 'index.html', label: '📖 Tanulok' },
    { page: 'quiz', href: 'kviz.html', label: '⭐ Kvíz' },
  ];

  /**
   * Közös fejléc és lábléc minden oldalra.
   * @param {'learn' | 'quiz'} activePage
   */
  function mountLayout(activePage) {
    document.getElementById('site-header').replaceChildren(
      el('a', { class: 'brand', href: 'index.html' }, [
        el('span', { class: 'brand-icon', 'aria-hidden': 'true' }, '✚'),
        'Kis Mentő Iskola',
      ]),
      el(
        'nav',
        { class: 'nav', 'aria-label': 'Fő menü' },
        NAV.map((item) =>
          el(
            'a',
            { class: 'nav-link', href: item.href, 'aria-current': item.page === activePage ? 'page' : null },
            item.label,
          ),
        ),
      ),
    );

    document
      .getElementById('site-footer')
      .replaceChildren(
        el(
          'p',
          {},
          'Ez az oldal tanulásra való, nem helyettesíti az elsősegély-tanfolyamot. Baj esetén hívd a 112-t!',
        ),
      );
  }

  /** Az „Aranyszabály” doboz: minden elsősegély ezzel kezdődik. */
  function goldenRulesBox() {
    return el('section', { class: 'golden', 'aria-labelledby': 'golden-title' }, [
      el('h2', { id: 'golden-title', class: 'golden-title' }, 'Aranyszabály – mindig ezzel kezdd!'),
      el(
        'ol',
        { class: 'golden-list' },
        goldenRules.map((rule) =>
          el('li', { class: 'golden-item' }, [
            el('span', { class: 'golden-icon', 'aria-hidden': 'true' }, rule.icon),
            el('strong', {}, rule.title),
            el('span', {}, rule.text),
          ]),
        ),
      ),
    ]);
  }

  KM.layout = { mountLayout, goldenRulesBox };
})((globalThis.KM = globalThis.KM || {}));
