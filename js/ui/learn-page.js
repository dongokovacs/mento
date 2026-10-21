(function (KM) {
  'use strict';

  const { imagePath, techniques, el } = KM;
  const { goldenRulesBox, mountLayout } = KM.layout;

  mountLayout('learn');

  document.getElementById('app').replaceChildren(
    el('section', { class: 'hero' }, [
      el('h1', {}, 'Légy te is Kis Mentő!'),
      el('p', { class: 'lead' }, 'Tanuld meg, hogyan segíthetsz, ha valaki megsérül. Lépésről lépésre, rajzokkal.'),
    ]),
    goldenRulesBox(),
    el('div', { class: 'cards' }, techniques.map(techniqueCard)),
  );

  // Ha a kvízből egy témára mutató linkkel jöttünk (#id), az a kártya legyen nyitva.
  const linkedCard = document.getElementById(location.hash.slice(1));
  if (linkedCard instanceof HTMLDetailsElement) linkedCard.open = true;

  /** @param {Technique} technique */
  function techniqueCard(technique) {
    return el('details', { class: 'card', id: technique.id, style: `--accent: ${technique.color}` }, [
      el('summary', { class: 'card-summary' }, [
        el('span', { class: 'card-icon', 'aria-hidden': 'true' }, technique.icon),
        el('span', { class: 'card-head' }, [
          el('span', { class: 'card-title' }, technique.title),
          el('span', { class: 'card-intro' }, technique.intro),
        ]),
      ]),
      stepper(technique.steps),
      el('a', { class: 'btn btn-primary card-cta', href: `kviz.html?t=${technique.id}` }, '⭐ Gyakoroljuk!'),
    ]);
  }

  /** @param {Step[]} steps */
  function stepper(steps) {
    let current = 0;
    const image = el('img', { class: 'step-img', width: 240, height: 180, loading: 'lazy' });
    const counter = el('p', { class: 'step-count' });
    const title = el('h3', { class: 'step-title' });
    const text = el('p', { class: 'step-text' });
    const prev = el('button', { class: 'btn', type: 'button', onClick: () => show(current - 1) }, '◀ Előző');
    const next = el('button', { class: 'btn btn-primary', type: 'button', onClick: () => show(current + 1) }, 'Következő ▶');
    const dots = steps.map((step, i) =>
      el('button', { class: 'dot', type: 'button', 'aria-label': `${i + 1}. lépés: ${step.title}`, onClick: () => show(i) }, i + 1),
    );

    function show(index) {
      current = index;
      const step = steps[index];
      image.src = imagePath(step.image);
      image.alt = step.title;
      counter.textContent = `${index + 1}. lépés / ${steps.length}`;
      title.textContent = step.title;
      text.textContent = step.text;
      prev.disabled = index === 0;
      next.disabled = index === steps.length - 1;
      dots.forEach((dot, i) => dot.toggleAttribute('aria-current', i === index));
    }

    show(0);
    return el('div', { class: 'stepper' }, [
      el('div', { class: 'dots' }, dots),
      image,
      el('div', { class: 'step-body', 'aria-live': 'polite' }, [counter, title, text]),
      el('div', { class: 'step-nav' }, [prev, next]),
    ]);
  }
})((globalThis.KM = globalThis.KM || {}));
