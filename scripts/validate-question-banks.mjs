import { activeSubjects } from '../src/data/subjectRegistry.js';

const errors = [];
const globalIds = new Map();
let totalQuestions = 0;
let questionsWithoutComment = 0;

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
      questionsWithoutComment += 1;
    }
  }
}

if (errors.length) {
  console.error(`Falha na validação: ${errors.length} problema(s) estruturais em ${totalQuestions} questões.`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Integridade estrutural aprovada: ${activeSubjects.length} disciplinas e ${totalQuestions} questões; IDs, enunciados, alternativas e gabaritos conferidos.`);
  if (questionsWithoutComment) {
    console.warn(`Atenção: ${questionsWithoutComment} questões legadas não possuem comentário explicativo. Permanecem identificadas para enriquecimento, sem bloquear o build.`);
  } else {
    console.log('Todas as questões possuem comentário explicativo.');
  }
}
