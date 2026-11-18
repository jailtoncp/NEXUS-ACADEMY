import { activeSubjects, subjectById } from '../data/subjectRegistry.js';

export const FAVORITES_KEY = 'nexus-academy:favorites:v1';

const questionIndex = new Map(activeSubjects.map((subject) => [
  subject.id,
  new Map(subject.questions.map((question) => [String(question.id), question])),
]));

function localStorageForFavorites() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readRawFavorites() {
  const storage = localStorageForFavorites();
  if (!storage) return [];
  try {
    const stored = storage.getItem(FAVORITES_KEY);
    if (stored === null) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function validateFavorite(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
  if (typeof item.disciplineId !== 'string' || typeof item.questionId !== 'string') return false;
  if (!item.disciplineId.trim() || !item.questionId.trim()) return false;
  if (typeof item.savedAt !== 'string' || !Number.isFinite(Date.parse(item.savedAt))) return false;
  return Boolean(questionIndex.get(item.disciplineId)?.has(item.questionId));
}

export function readFavoriteItems() {
  const raw = readRawFavorites();
  if (!Array.isArray(raw)) return [];
  const unique = new Map();
  for (const item of raw) {
    if (!validateFavorite(item)) continue;
    unique.set(`${item.disciplineId}:${item.questionId}`, item);
  }
  return [...unique.values()];
}

export function isQuestionFavorite(disciplineId, questionId, favorites = readFavoriteItems()) {
  const subjectKey = String(disciplineId);
  const questionKey = String(questionId);
  return favorites.some((item) => item.disciplineId === subjectKey && item.questionId === questionKey);
}

export function toggleQuestionFavorite(disciplineId, questionId) {
  const subjectKey = String(disciplineId);
  const questionKey = String(questionId);
  const subject = subjectById.get(subjectKey);
  if (!subject || !questionIndex.get(subjectKey)?.has(questionKey)) {
    throw new Error('Esta questão não está disponível no acervo atual.');
  }

  const raw = readRawFavorites();
  if (!Array.isArray(raw)) {
    throw new Error('Não foi possível ler seus favoritos locais. Os dados existentes foram preservados.');
  }

  const current = readFavoriteItems();
  const alreadySaved = isQuestionFavorite(subjectKey, questionKey, current);
  const next = alreadySaved
    ? current.filter((item) => !(item.disciplineId === subjectKey && item.questionId === questionKey))
    : [...current, { disciplineId: subjectKey, questionId: questionKey, savedAt: new Date().toISOString() }];
  const storage = localStorageForFavorites();
  if (!storage) throw new Error('O armazenamento local não está disponível neste navegador.');

  try {
    storage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    throw new Error('Não foi possível salvar seus favoritos neste navegador. Libere espaço e tente novamente.');
  }
  window.dispatchEvent(new CustomEvent('nexus-favorites-updated'));
  return next;
}

export function resolveFavoriteItems(items = readFavoriteItems()) {
  return items.flatMap((item) => {
    const subject = subjectById.get(item.disciplineId);
    const question = questionIndex.get(item.disciplineId)?.get(item.questionId);
    return subject && question ? [{ ...item, subject, question }] : [];
  });
}
