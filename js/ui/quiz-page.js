(function (KM) {
  'use strict';

  const { questions, imagePath, techniques, el } = KM;
  const { isBetter, isCorrect, scrambledOrder, selectQuestions, shuffle, starsFor } = KM.quiz;
  const { load, save } = KM.storage;
  const { goldenRulesBox, mountLayout } = KM.layout;

  const MIXED = { id: 'vegyes', title: 'Mindegyik – vegyesen', icon: '🎲', color: '#264653' };
  const TOPICS = [...techniques, MIXED];
  const PRAISE = ['Szuper!', 'Ügyes vagy!', 'Pontosan!', 'Telitalálat!'];
  const RESULT_MESSAGES = {
    3: 'Igazi Kis Mentő vagy!',
    2: 'Szép munka! Még egy kis gyakorlás, és tökéletes lesz.',
    1: 'Jó kezdet! Nézd át újra a tananyagot, és próbáld újra!',
  };

  const app = document.getElementById('app');

  // --- Képernyők -------------------------------------------------------------

  function showStart() {
    render(
      el('h1', {}, 'Kvíz – mit tudsz már?'),
      el('p', { class: 'lead' }, 'Válassz egy témát!'),
      el(
        'div',
        { class: 'topic-grid' },
        TOPICS.map((topic) =>
          el('button', { class: 'topic', type: 'button', style: `--accent: ${topic.color}`, onClick: () => start(topic) }, [
            el('span', { class: 'card-icon', 'aria-hidden': 'true' }, topic.icon),
            el('span', { class: 'topic-title' }, topic.title),
            bestBadge(topic.id),
          ]),
        ),
      ),
      goldenRulesBox(),
    );
  }

  /** @param {{id: string, title: string}} topic */
  function start(topic) {
    const techniqueId = topic === MIXED ? null : topic.id;
    showQuestion({ topic, questions: selectQuestions(questions, techniqueId), index: 0, score: 0 });
  }

  function showQuestion(state) {
    const question = state.questions[state.index];
    const isLast = state.index === state.questions.length - 1;
    const prompt = el('h2', { class: 'question-prompt', tabindex: -1 }, question.prompt);
    const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });

    const answerArea = renderers[question.type](question, (response) => {
      const correct = isCorrect(question, response);
      if (correct) state.score++;
      const nextButton = el(
        'button',
        { class: 'btn btn-primary', type: 'button', onClick: () => (isLast ? showResult(state) : showQuestion({ ...state, index: state.index + 1 })) },
        isLast ? 'Eredmény 🏆' : 'Tovább ▶',
      );
      feedback.className = `feedback ${correct ? 'is-correct' : 'is-wrong'}`;
      feedback.replaceChildren(
        el('p', { class: 'feedback-title' }, correct ? `✅ ${pickRandom(PRAISE)}` : '❌ Majdnem!'),
        el('p', {}, question.explain),
        nextButton,
      );
      nextButton.focus();
    });

    render(progress(state), el('section', { class: 'question' }, [prompt, answerArea, feedback]));
    prompt.focus();
  }

  function showResult(state) {
    const result = { score: state.score, total: state.questions.length };
    const stars = starsFor(result.score, result.total);
    const bestKey = `best:${state.topic.id}`;
    const newRecord = isBetter(result, load(bestKey));
    if (newRecord) save(bestKey, result);

    const certificateName = el('span', { class: 'cert-name' }, '…');
    const nameInput = el('input', {
      id: 'name',
      class: 'input',
      type: 'text',
      maxlength: 30,
      autocomplete: 'off',
      placeholder: 'Írd ide a neved',
      onInput: (event) => (certificateName.textContent = event.target.value.trim() || '…'),
    });

    render(
      el('section', { class: 'result' }, [
        el('h1', {}, RESULT_MESSAGES[stars]),
        starRating(stars),
        el('p', { class: 'lead' }, `${result.score} / ${result.total} helyes válasz`),
        newRecord ? el('p', { class: 'badge' }, '🎉 Ez az eddigi legjobb eredményed ebben a témában!') : null,
        stars < 3 && state.topic !== MIXED
          ? el('a', { class: 'link', href: `index.html#${state.topic.id}` }, `📖 Nézd át újra: ${state.topic.title}`)
          : null,
      ]),
      el('section', { class: 'certificate-box' }, [
        el('label', { for: 'name', class: 'label' }, 'Kinek szól az oklevél?'),
        nameInput,
        el('div', { class: 'certificate' }, [
          el('p', { class: 'cert-label' }, 'OKLEVÉL'),
          el('p', {}, 'Ezt az oklevelet kapja'),
          certificateName,
          el('p', {}, `aki kitöltötte a(z) „${state.topic.title}” kvízt.`),
          starRating(stars),
          el('p', { class: 'cert-score' }, `${result.score} / ${result.total} helyes válasz`),
          el('p', { class: 'cert-date' }, new Date().toLocaleDateString('hu-HU')),
        ]),
      ]),
      el('div', { class: 'actions' }, [
        el('button', { class: 'btn', type: 'button', onClick: () => window.print() }, '🖨️ Oklevél nyomtatása'),
        el('button', { class: 'btn btn-primary', type: 'button', onClick: () => start(state.topic) }, '🔄 Újra'),
        el('button', { class: 'btn', type: 'button', onClick: backToStart }, '📚 Másik téma'),
      ]),
    );
  }

  function backToStart() {
    history.replaceState(null, '', location.pathname);
    showStart();
  }

  // --- Kérdéstípusok -----------------------------------------------------------
  // Új típus: egy új függvény ide + a QUESTION_TYPES lista a core/quiz.js-ben.
  // Minden renderer megkapja a kérdést és a `submit(response)` függvényt.

  const renderers = {
    choice: (question, submit) =>
      el('div', {}, [
        question.image
          ? el('img', { class: 'question-img', src: imagePath(question.image), alt: question.imageAlt, width: 240, height: 180 })
          : null,
        optionButtons(question, shuffle(question.options.map((text, i) => ({ value: i, content: text }))), submit),
      ]),

    image: (question, submit) =>
      optionButtons(
        question,
        shuffle(
          question.options.map((option, i) => ({
            value: i,
            content: el('img', { src: imagePath(option.image), alt: option.alt, width: 240, height: 180 }),
          })),
        ),
        submit,
        'options-images',
      ),

    truefalse: (question, submit) =>
      optionButtons(
        question,
        [
          { value: true, content: '👍 Igaz' },
          { value: false, content: '👎 Hamis' },
        ],
        submit,
        'options-tf',
      ),

    order: (question, submit) => {
      const picked = [];
      const answerList = el('ol', { class: 'order-picked', 'aria-label': 'A te sorrended' });
      const pool = scrambledOrder(question.items.length).map((itemIndex) =>
        el('button', { class: 'option', type: 'button', onClick: (event) => pick(itemIndex, event.currentTarget) }, question.items[itemIndex]),
      );
      const reset = el('button', { class: 'btn btn-small', type: 'button', disabled: true, onClick: resetPicks }, '↺ Újrakezdem');
      const wrapper = el('div', { class: 'order' }, [
        el('p', { class: 'hint' }, 'Kattints a lépésekre a helyes sorrendben!'),
        el('div', { class: 'options' }, pool),
        answerList,
        reset,
      ]);

      function pick(itemIndex, button) {
        picked.push(itemIndex);
        button.disabled = true;
        answerList.append(el('li', {}, question.items[itemIndex]));
        reset.disabled = false;
        if (picked.length === question.items.length) finish();
      }

      function resetPicks() {
        picked.length = 0;
        answerList.replaceChildren();
        pool.forEach((button) => (button.disabled = false));
        reset.disabled = true;
      }

      function finish() {
        reset.remove();
        [...answerList.children].forEach((li, position) =>
          li.classList.add(picked[position] === position ? 'is-correct' : 'is-wrong'),
        );
        if (!isCorrect(question, picked)) {
          wrapper.append(
            el('div', { class: 'solution' }, [
              el('p', {}, 'A helyes sorrend:'),
              el('ol', {}, question.items.map((item) => el('li', {}, item))),
            ]),
          );
        }
        submit([...picked]);
      }

      return wrapper;
    },
  };

  /**
   * Közös gombsor a választós típusokhoz: kattintás után letilt, a helyeset zöldre,
   * a rossz választást pirosra színezi.
   * @param {{value: any, content: any}[]} options
   */
  function optionButtons(question, options, submit, variant = '') {
    const buttons = options.map((option) =>
      el('button', { class: 'option', type: 'button', onClick: () => choose(option) }, option.content),
    );

    function choose(chosen) {
      options.forEach((option, i) => {
        buttons[i].disabled = true;
        if (isCorrect(question, option.value)) buttons[i].classList.add('is-correct');
        else if (option === chosen) buttons[i].classList.add('is-wrong');
      });
      submit(chosen.value);
    }

    return el('div', { class: `options ${variant}` }, buttons);
  }

  // --- Apró segédek ------------------------------------------------------------

  function render(...children) {
    app.replaceChildren(...children);
    window.scrollTo(0, 0);
  }

  function progress({ topic, questions: list, index }) {
    return el('div', { class: 'progress' }, [
      el('p', { class: 'progress-label' }, [el('span', {}, `${topic.icon} ${topic.title}`), el('span', {}, `${index + 1}. kérdés / ${list.length}`)]),
      el(
        'div',
        { class: 'progress-track', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': list.length, 'aria-valuenow': index },
        el('div', { class: 'progress-fill', style: `width: ${(index / list.length) * 100}%` }),
      ),
    ]);
  }

  function starRating(count) {
    return el('p', { class: 'stars', role: 'img', 'aria-label': `${count} csillag a 3-ból` }, '★'.repeat(count) + '☆'.repeat(3 - count));
  }

  function bestBadge(topicId) {
    const best = load(`best:${topicId}`);
    return best ? el('span', { class: 'best' }, `Legjobb: ${best.score}/${best.total}`) : null;
  }

  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

  // --- Indítás (a fájl végén, hogy minden konstans már létezzen) ---------------

  mountLayout('quiz');
  const requested = TOPICS.find((topic) => topic.id === new URLSearchParams(location.search).get('t'));
  if (requested) start(requested);
  else showStart();
})((globalThis.KM = globalThis.KM || {}));
