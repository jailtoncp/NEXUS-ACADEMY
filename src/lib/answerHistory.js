import { activeSubjects, subjectById } from '../data/subjectRegistry.js';

export const ANSWER_HISTORY_KEY = 'nexus-academy:answer-history:v1';
export const HISTORY_FORMAT = 'nexus-academy-answer-history';
export const HISTORY_VERSION = 1;
const questionIndex = new Map(activeSubjects.map((subject) => [
  subject.id,
  new Map(subject.questions.map((question) => [String(question.id), question])),
]));

function questionForAttempt(attempt) {
  const subject = subjectById.get(attempt?.discipline);
  if (!subject) return null;
  const question = questionIndex.get(subject.id)?.get(String(attempt.questionId));
  return question ? { subject, question } : null;
}

export function validateAttempt(attempt) {
  if (!attempt || typeof attempt !== 'object' || Array.isArray(attempt)) return false;
  if (typeof attempt.questionId !== 'string' || !attempt.questionId.trim()) return false;
  if (typeof attempt.discipline !== 'string') return false;
  const found = questionForAttempt(attempt);
  if (!found) return false;
  const { subject, question } = found;
  if (attempt.disciplineName !== subject.name) return false;
  if (attempt.topicId !== question.topicId || attempt.subtopicId !== question.subtopicId) return false;
  if (typeof attempt.chosenOption !== 'string' || !Object.hasOwn(question.options, attempt.chosenOption)) return false;
  if (attempt.correctOption !== question.answer || !Object.hasOwn(question.options, attempt.correctOption)) return false;
  if (typeof attempt.isCorrect !== 'boolean' || attempt.isCorrect !== (attempt.chosenOption === attempt.correctOption)) return false;
  if (typeof attempt.answeredAt !== 'string' || !Number.isFinite(Date.parse(attempt.answeredAt))) return false;
  if (!Number.isFinite(attempt.responseTimeMs) || attempt.responseTimeMs < 0) return false;
  if (attempt.source !== undefined && typeof attempt.source !== 'string') return false;
  return true;
}

function readRawHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ANSWER_HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readAnswerHistory() {
  return (readRawHistory() || []).filter(validateAttempt);
}

export function appendAnswerAttempt(attempt) {
  if (!validateAttempt(attempt)) throw new Error('A resposta não passou na validação do histórico.');
  const history = readRawHistory();
  if (!history) throw new Error('O histórico local está em formato inválido; os dados existentes foram preservados.');
  const next = [...history, attempt];
  window.localStorage.setItem(ANSWER_HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('nexus-history-updated'));
  return next.filter(validateAttempt);
}

export function summarizeAnswerHistory(history = readAnswerHistory()) {
  const valid = Array.isArray(history) ? history.filter(validateAttempt) : [];
  const correct = valid.filter((attempt) => attempt.isCorrect).length;
  return {
    attempts: valid.length,
    correct,
    errors: valid.length - correct,
    accuracy: valid.length ? (correct / valid.length) * 100 : null,
    lastActivity: valid.reduce((latest, attempt) => {
      const timestamp = Date.parse(attempt.answeredAt);
      return timestamp > (latest || 0) ? timestamp : latest;
    }, 0) || null,
    byDiscipline: [...subjectById.values()].map((subject) => {
      const attempts = valid.filter((attempt) => attempt.discipline === subject.id);
      const correctCount = attempts.filter((attempt) => attempt.isCorrect).length;
      return {
        id: subject.id,
        name: subject.name,
        attempts: attempts.length,
        correct: correctCount,
        errors: attempts.length - correctCount,
        accuracy: attempts.length ? (correctCount / attempts.length) * 100 : null,
      };
    }),
  };
}

export function createHistoryExport(history = readAnswerHistory()) {
  const valid = Array.isArray(history) ? history.filter(validateAttempt) : [];
  return {
    format: HISTORY_FORMAT,
    version: HISTORY_VERSION,
    exportedAt: new Date().toISOString(),
    attempts: valid,
  };
}

export function validateHistoryImport(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, message: 'O arquivo precisa conter um objeto JSON de backup.' };
  }
  if (payload.format !== HISTORY_FORMAT || payload.version !== HISTORY_VERSION) {
    return { valid: false, message: 'Formato ou versão do backup não reconhecido. Nenhum dado foi alterado.' };
  }
  if (!Array.isArray(payload.attempts)) {
    return { valid: false, message: 'O backup não contém uma lista válida de respostas. Nenhum dado foi alterado.' };
  }
  const invalidIndex = payload.attempts.findIndex((attempt) => !validateAttempt(attempt));
  if (invalidIndex !== -1) {
    return {
      valid: false,
      message: `A resposta ${invalidIndex + 1} não passou na validação (disciplina, questão, alternativa, gabarito, data ou duração). Nenhum dado foi alterado.`,
    };
  }
  return { valid: true, attempts: payload.attempts };
}

export function replaceAnswerHistory(attempts) {
  if (!Array.isArray(attempts) || attempts.some((attempt) => !validateAttempt(attempt))) {
    throw new Error('Histórico inválido. Os dados existentes foram preservados.');
  }
  window.localStorage.setItem(ANSWER_HISTORY_KEY, JSON.stringify(attempts));
  window.dispatchEvent(new CustomEvent('nexus-history-updated'));
}
