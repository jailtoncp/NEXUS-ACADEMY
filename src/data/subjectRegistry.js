import portugues from './subjects/portugues.js';
import informatica from './subjects/informatica.js';
import raciocinioLogico from './subjects/raciocinio-logico.js';
import criminologia from './subjects/criminologia.js';
import direitoPenal from './subjects/direito-penal.js';
import processoPenal from './subjects/processo-penal.js';
import execucaoPenal from './subjects/execucao-penal.js';
import legislacaoEspecial from './subjects/legislacao-especial.js';
import direitosHumanos from './subjects/direitos-humanos.js';

export const activeSubjects = [
  portugues,
  informatica,
  raciocinioLogico,
  criminologia,
  direitoPenal,
  processoPenal,
  execucaoPenal,
  legislacaoEspecial,
  direitosHumanos,
];

export const developmentDisciplines = [];

export const plannedDisciplines = [
  'Direito Constitucional',
  'Direito Administrativo',
  'Ciências Forenses',
];

export const plannedStudyFeatures = [
  'Flashcards',
  'Revisão',
  'Simulados',
  'Biblioteca',
  'Favoritos',
];

export const subjectByName = new Map(activeSubjects.map((subject) => [subject.name, subject]));
export const subjectById = new Map(activeSubjects.map((subject) => [subject.id, subject]));

export const availableQuestionTotal = activeSubjects.reduce(
  (total, subject) => total + subject.questions.length,
  0,
);
