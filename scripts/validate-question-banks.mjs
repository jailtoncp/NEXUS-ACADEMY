import { activeSubjects } from '../src/data/subjectRegistry.js';

const errors = [];
const globalIds = new Map();
let totalQuestions = 0;

for (const subject of activeSubjects) {
  if (!subject.id || !subject.name || !Array.isArray(subject.questions)) {
    errors.push(`Disciplina inválida: ${subject.name || subject.id || 'sem identificação'}`);
    continue;
  }

  const localIds = new Set();
  for (const [index, question] of subject.questions.entries()) {
    totalQuestions += 1;
    const label = `${subject.name} · questão ${question.id || index + 1}`;

    if (!question.id) errors.push(`${label}: ID ausente.`);
    else {
      if (localIds.has(question.id)) errors.push(`${label}: ID duplicado dentro da disciplina.`);
      localIds.add(question.id);
      if (globalIds.has(question.id)) {
        errors.push(`${label}: ID também usado em ${globalIds.get(question.id)}.`);
      } else {
        globalIds.set(question.id, subject.name);
      }
    }

    if (typeof question.prompt !== 'string' || !question.prompt.trim()) {
      errors.push(`${label}: enunciado ausente.`);
    }

    const options = question.options;
    if (!options || typeof options !== 'object' || Array.isArray(options) || Object.keys(options).length < 2) {
      errors.push(`${label}: alternativas ausentes ou inválidas.`);
    } else if (!Object.hasOwn(options, question.answer)) {
      errors.push(`${label}: gabarito não corresponde a uma alternativa existente.`);
    }

    if (typeof question.comment !== 'string' || !question.comment.trim()) {
      errors.push(`${label}: comentário explicativo ausente.`);
    }
  }
}

if (errors.length) {
  console.error(`Falha na validação: ${errors.length} problema(s) em ${totalQuestions} questões.`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Integridade aprovada: ${activeSubjects.length} disciplinas, ${totalQuestions} questões, IDs únicos, enunciados, alternativas, gabaritos e comentários presentes.`);
}
