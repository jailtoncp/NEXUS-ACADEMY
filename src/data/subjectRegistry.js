import portugues from './subjects/portugues.js';
import informatica from './subjects/informatica.js';
import raciocinioLogico from './subjects/raciocinio-logico.js';
import criminologia from './subjects/criminologia.js';

export const activeSubjects = [portugues, informatica, raciocinioLogico, criminologia];

export const developmentDisciplines = [];

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
