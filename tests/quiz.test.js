import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadScripts } from './load.js';

const { MIXED_COUNT, isBetter, isCorrect, scrambledOrder, selectQuestions, shuffle, starsFor } =
  loadScripts('js/core/quiz.js').quiz;

/** Determinisztikus véletlenszám-forrás a teszteléshez. */
function seeded(seed = 42) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

const sample = [
  { techniqueId: 'a', type: 'truefalse', answer: true },
  { techniqueId: 'a', type: 'truefalse', answer: false },
  { techniqueId: 'b', type: 'truefalse', answer: true },
  ...Array.from({ length: 12 }, () => ({ techniqueId: 'c', type: 'truefalse', answer: true })),
];

test('shuffle: ugyanazok az elemek, az eredeti tömb érintetlen', () => {
  const input = [1, 2, 3, 4, 5];
  const result = shuffle(input, seeded());
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
  assert.deepEqual([...result].sort(), input);
});

test('selectQuestions: téma szerint szűr', () => {
  const result = selectQuestions(sample, 'a', seeded());
  assert.equal(result.length, 2);
  assert.ok(result.every((q) => q.techniqueId === 'a'));
});

test('selectQuestions: vegyesen MIXED_COUNT kérdést ad', () => {
  assert.equal(selectQuestions(sample, null, seeded()).length, MIXED_COUNT);
});

test('scrambledOrder: sosem a helyes sorrend, és minden index benne van', () => {
  const alwaysIdentity = () => 0.999; // ez a forrás magától nem keverne
  for (const random of [alwaysIdentity, seeded(1), seeded(7)]) {
    const order = scrambledOrder(4, random);
    assert.notDeepEqual(order, [0, 1, 2, 3]);
    assert.deepEqual([...order].sort(), [0, 1, 2, 3]);
  }
  assert.deepEqual(scrambledOrder(1), [0]);
});

test('isCorrect: választós és igaz/hamis', () => {
  assert.equal(isCorrect({ type: 'choice', answer: 1 }, 1), true);
  assert.equal(isCorrect({ type: 'choice', answer: 1 }, 0), false);
  assert.equal(isCorrect({ type: 'image', answer: 0 }, 0), true);
  assert.equal(isCorrect({ type: 'truefalse', answer: false }, false), true);
  assert.equal(isCorrect({ type: 'truefalse', answer: false }, true), false);
});

test('isCorrect: sorba rendezés', () => {
  const question = { type: 'order', items: ['a', 'b', 'c'] };
  assert.equal(isCorrect(question, [0, 1, 2]), true);
  assert.equal(isCorrect(question, [1, 0, 2]), false);
  assert.equal(isCorrect(question, [0, 1]), false);
});

test('starsFor: határértékek', () => {
  assert.equal(starsFor(9, 10), 3);
  assert.equal(starsFor(8, 10), 2);
  assert.equal(starsFor(6, 10), 2);
  assert.equal(starsFor(5, 10), 1);
  assert.equal(starsFor(0, 0), 1);
});

test('isBetter: arány alapján hasonlít', () => {
  assert.equal(isBetter({ score: 3, total: 6 }, null), true);
  assert.equal(isBetter({ score: 5, total: 6 }, { score: 4, total: 6 }), true);
  assert.equal(isBetter({ score: 4, total: 6 }, { score: 4, total: 6 }), false);
  assert.equal(isBetter({ score: 7, total: 10 }, { score: 5, total: 6 }), false);
});
