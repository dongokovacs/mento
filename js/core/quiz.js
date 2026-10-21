/**
 * Kvízlogika DOM nélkül – ezért Node-ban is tesztelhető.
 * Minden függvény tiszta; a véletlenszám-forrás paraméterként cserélhető.
 */

(function (KM) {
  'use strict';

  const QUESTION_TYPES = ['choice', 'image', 'truefalse', 'order'];

  /** Vegyes kvíznél ennyi kérdés jön. */
  const MIXED_COUNT = 10;

  /**
   * Új, megkevert tömb (Fisher–Yates); az eredetit nem módosítja.
   * @template T
   * @param {T[]} list
   * @param {() => number} [random]
   * @returns {T[]}
   */
  function shuffle(list, random = Math.random) {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Egy téma összes kérdése, vagy (techniqueId nélkül) MIXED_COUNT vegyes kérdés.
   * @param {Question[]} all
   * @param {string | null} techniqueId
   * @param {() => number} [random]
   */
  function selectQuestions(all, techniqueId, random) {
    if (techniqueId) return shuffle(all.filter((q) => q.techniqueId === techniqueId), random);
    return shuffle(all, random).slice(0, MIXED_COUNT);
  }

  /**
   * Kevert indexsorrend a sorba rendezős kérdéshez – sosem a helyes sorrend,
   * különben a gyerek kattintás nélkül is „kitalálná”.
   * @param {number} length
   * @param {() => number} [random]
   */
  function scrambledOrder(length, random) {
    const order = shuffle([...Array(length).keys()], random);
    if (length > 1 && isIdentity(order)) order.push(order.shift());
    return order;
  }

  /**
   * @param {Question} question
   * @param {number | boolean | number[]} response  order típusnál a választott elemek eredeti indexei
   */
  function isCorrect(question, response) {
    if (question.type === 'order') {
      return Array.isArray(response) && response.length === question.items.length && isIdentity(response);
    }
    return response === question.answer;
  }

  /** 1–3 csillag: legalább 90% → 3, legalább 60% → 2, egyébként 1. */
  function starsFor(score, total) {
    const ratio = total > 0 ? score / total : 0;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.6) return 2;
    return 1;
  }

  /**
   * @param {{score: number, total: number}} result
   * @param {{score: number, total: number} | null} best
   */
  function isBetter(result, best) {
    return !best || result.score / result.total > best.score / best.total;
  }

  const isIdentity = (order) => order.every((value, i) => value === i);

  KM.quiz = { QUESTION_TYPES, MIXED_COUNT, shuffle, selectQuestions, scrambledOrder, isCorrect, starsFor, isBetter };
})((globalThis.KM = globalThis.KM || {}));
