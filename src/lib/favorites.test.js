import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { activeSubjects } from '../data/subjectRegistry.js';
import { FAVORITES_KEY, isQuestionFavorite, readFavoriteItems, resolveFavoriteItems, toggleQuestionFavorite } from './favorites.js';

const values = new Map();
const dispatched = [];
globalThis.window = {
  localStorage: {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
  },
  dispatchEvent: (event) => { dispatched.push(event.type); return true; },
};

const subject = activeSubjects[0];
const question = subject.questions[0];

beforeEach(() => {
  values.clear();
  dispatched.length = 0;
});

test('salva um favorito em chave separada e resolve a questão do acervo', () => {
  const result = toggleQuestionFavorite(subject.id, question.id);
  assert.equal(result.length, 1);
  assert.equal(isQuestionFavorite(subject.id, question.id, result), true);
  assert.equal(values.has(FAVORITES_KEY), true);
  assert.deepEqual([...values.keys()], [FAVORITES_KEY]);
  assert.deepEqual(dispatched, ['nexus-favorites-updated']);
  const [resolved] = resolveFavoriteItems(readFavoriteItems());
  assert.equal(resolved.subject.id, subject.id);
  assert.equal(resolved.question.id, question.id);
});

test('remove um favorito existente sem afetar outro item', () => {
  toggleQuestionFavorite(subject.id, question.id);
  const result = toggleQuestionFavorite(subject.id, question.id);
  assert.deepEqual(result, []);
  assert.equal(readFavoriteItems().length, 0);
});

test('rejeita IDs inexistentes sem criar dados', () => {
  assert.throws(() => toggleQuestionFavorite(subject.id, 'questao-inexistente'), /não está disponível/i);
  assert.equal(values.has(FAVORITES_KEY), false);
});

test('não sobrescreve um armazenamento de favoritos inválido', () => {
  values.set(FAVORITES_KEY, '{json inválido');
  assert.deepEqual(readFavoriteItems(), []);
  assert.throws(() => toggleQuestionFavorite(subject.id, question.id), /dados existentes foram preservados/i);
  assert.equal(values.get(FAVORITES_KEY), '{json inválido');
});
