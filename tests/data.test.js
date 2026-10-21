import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadScripts } from './load.js';

const KM = loadScripts('js/data/techniques.js', 'js/data/questions.js', 'js/core/quiz.js');
const { imagePath, techniques, questions } = KM;
const { QUESTION_TYPES } = KM.quiz;

const root = new URL('../', import.meta.url);
const imageExists = (ref) => existsSync(fileURLToPath(new URL(imagePath(ref), root)));
const techniqueIds = new Set(techniques.map((t) => t.id));

test('a technikák azonosítói egyediek, és mindegyiknek van lépése', () => {
  assert.equal(techniqueIds.size, techniques.length);
  for (const technique of techniques) assert.ok(technique.steps.length > 0, technique.id);
});

test('minden technikához tartozik kérdés, és minden kérdés létező technikára mutat', () => {
  for (const id of techniqueIds) assert.ok(questions.some((q) => q.techniqueId === id), `nincs kérdés: ${id}`);
  for (const q of questions) assert.ok(techniqueIds.has(q.techniqueId), `ismeretlen technika: ${q.id}`);
});

test('a kérdések szerkezete érvényes', () => {
  for (const q of questions) {
    assert.ok(QUESTION_TYPES.includes(q.type), `ismeretlen típus: ${q.id}`);
    assert.ok(q.prompt && q.explain, `hiányzó szöveg: ${q.id}`);

    if (q.type === 'choice' || q.type === 'image') {
      assert.ok(q.options.length >= 2, `kevés lehetőség: ${q.id}`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `rossz answer: ${q.id}`);
    }
    if (q.type === 'image') {
      for (const option of q.options) assert.ok(option.image && option.alt, `hiányzó kép/alt: ${q.id}`);
    }
    if (q.type === 'choice' && q.image) assert.ok(q.imageAlt, `hiányzó imageAlt: ${q.id}`);
    if (q.type === 'truefalse') assert.equal(typeof q.answer, 'boolean', `rossz answer: ${q.id}`);
    if (q.type === 'order') assert.ok(q.items.length >= 2, `kevés elem: ${q.id}`);
  }
});

test('minden hivatkozott kép létezik', () => {
  const refs = [
    ...techniques.flatMap((t) => t.steps.map((step) => step.image)),
    ...questions.filter((q) => q.image).map((q) => q.image),
    ...questions.filter((q) => q.type === 'image').flatMap((q) => q.options.map((option) => option.image)),
  ];
  const missing = refs.filter((ref) => !imageExists(ref));
  assert.deepEqual(missing, []);
});
