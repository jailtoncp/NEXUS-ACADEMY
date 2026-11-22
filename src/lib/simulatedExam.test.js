import assert from 'node:assert/strict';
import test from 'node:test';
import {
  distributeEvenly,
  generateSimulatedExam,
  gradeSimulatedExam,
  resolveFinishTiming,
  validateCustomQuotas,
} from './simulatedExam.js';

function makeSubject(id, name, count) {
  return {
    id,
    name,
    questions: Array.from({ length: count }, (_, index) => ({
      id: `${id}-${index + 1}`,
      prompt: `Question ${id}-${index + 1}`,
      options: { A: 'Alpha', B: 'Beta', C: 'Gamma' },
      answer: index % 2 === 0 ? 'A' : 'B',
    })),
  };
}

const subjects = [
  makeSubject('a', 'Disciplina A', 2),
  makeSubject('b', 'Disciplina B', 8),
  makeSubject('c', 'Disciplina C', 4),
];

test('distribui igualmente e redistribui o excedente quando uma disciplina atinge o limite', () => {
  const result = distributeEvenly(subjects, 10, ['a', 'b', 'c']);
  assert.equal(result.valid, true);
  assert.equal(result.available, 14);
  assert.deepEqual(result.allocations, { a: 2, b: 4, c: 4 });
  assert.equal(Object.values(result.allocations).reduce((sum, count) => sum + count, 0), 10);
});

test('distribui o resto de forma estável quando a divisão não é exata', () => {
  const result = distributeEvenly(subjects, 5, ['a', 'b', 'c']);
  assert.deepEqual(result.allocations, { a: 2, b: 2, c: 1 });
});

test('rejeita total inválido, ausência de disciplinas e pool insuficiente', () => {
  assert.equal(distributeEvenly(subjects, 0, ['a']).reason, 'invalid-total');
  assert.equal(distributeEvenly(subjects, 1, []).reason, 'no-disciplines');
  assert.equal(distributeEvenly(subjects, 15, ['a', 'b', 'c']).reason, 'not-enough-questions');
});

test('valida cotas personalizadas e sinaliza soma diferente do total', () => {
  const valid = validateCustomQuotas(subjects, 5, { a: 2, b: 3, c: 0 });
  assert.equal(valid.valid, true);
  assert.equal(valid.sum, 5);

  const mismatch = validateCustomQuotas(subjects, 6, { a: 2, b: 3, c: 0 });
  assert.equal(mismatch.valid, false);
  assert.equal(mismatch.reason, 'total-mismatch');

  const overLimit = validateCustomQuotas(subjects, 3, { a: 3, b: 0, c: 0 });
  assert.equal(overLimit.valid, false);
  assert.equal(overLimit.reason, 'quantity-exceeds-availability');
});

test('seleciona a quantidade solicitada por disciplina sem reposição', () => {
  const result = generateSimulatedExam(subjects, { a: 2, b: 1, c: 0 }, () => 0.4);
  assert.equal(result.length, 3);
  assert.deepEqual(
    result.reduce((counts, entry) => {
      counts[entry.disciplineId] = (counts[entry.disciplineId] || 0) + 1;
      return counts;
    }, {}),
    { a: 2, b: 1 },
  );
  assert.equal(new Set(result.map((entry) => `${entry.disciplineId}:${entry.question.id}`)).size, 3);
  assert.ok(result.every((entry) => entry.question.options[entry.question.answer]));
});

test('classifica corretamente o encerramento manual em relação ao limite de tempo', () => {
  const startedAt = 1_000_000;
  const deadline = startedAt + 30 * 60_000;
  assert.deepEqual(resolveFinishTiming(deadline - 1, startedAt, 30, true), {
    finishedAt: deadline - 1,
    byTimer: false,
  });
  assert.deepEqual(resolveFinishTiming(deadline, startedAt, 30, true), {
    finishedAt: deadline,
    byTimer: true,
  });
  assert.deepEqual(resolveFinishTiming(deadline + 5_000, startedAt, 30, true), {
    finishedAt: deadline,
    byTimer: true,
  });
  assert.deepEqual(resolveFinishTiming(deadline + 5_000, startedAt, 30, false), {
    finishedAt: deadline + 5_000,
    byTimer: false,
  });
});

test('calcula nota de 0 a 10, percentual, acertos, erros, brancos e quebra por disciplina', () => {
  const questions = [
    { disciplineId: 'a', disciplineName: 'Disciplina A', question: { answer: 'B' } },
    { disciplineId: 'a', disciplineName: 'Disciplina A', question: { answer: 'A' } },
    { disciplineId: 'b', disciplineName: 'Disciplina B', question: { answer: 'C' } },
    { disciplineId: 'b', disciplineName: 'Disciplina B', question: { answer: 'A' } },
  ];
  const result = gradeSimulatedExam(questions, { 0: 'B', 1: 'C', 2: 'C' });
  assert.equal(result.total, 4);
  assert.equal(result.answered, 3);
  assert.equal(result.correct, 2);
  assert.equal(result.incorrect, 1);
  assert.equal(result.unanswered, 1);
  assert.equal(result.accuracy, 50);
  assert.equal(result.grade, 5);
  assert.deepEqual(result.byDiscipline.map(({ disciplineId, total, correct, incorrect, unanswered }) => ({
    disciplineId, total, correct, incorrect, unanswered,
  })), [
    { disciplineId: 'a', total: 2, correct: 1, incorrect: 1, unanswered: 0 },
    { disciplineId: 'b', total: 2, correct: 1, incorrect: 0, unanswered: 1 },
  ]);
});
