import portugues from './subjects/portugues.js';
import informatica from './subjects/informatica.js';
import raciocinioLogico from './subjects/raciocinio-logico.js';

export const activeSubjects = [portugues, informatica, raciocinioLogico];

export const developmentDisciplines = ['Criminologia'];

export const plannedDisciplines = [
  'Direito Penal',
  'Processo Penal',
  'Direito Constitucional',
  'Direito Administrativo',
  'Direitos Humanos',
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
