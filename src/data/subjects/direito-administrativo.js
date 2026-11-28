import bank from './direito-administrativo-pp500-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-administrativo',
  name: 'Direito Administrativo',
  abbreviation: 'DADM',
  description: 'Princípios e organização da Administração Pública, atos e poderes administrativos, serviços públicos, agentes públicos, improbidade, transparência, controle, licitações, contratos, responsabilidade do Estado e orçamento.',
  questionNotice: `${bank.questions.length} questões, incluindo acervo real validado e questões originais baseadas em legislação oficial.`,
  topics: [],
  questions: bank.questions,
  reviewCount: bank.metrics.questionsInReview,
  questionAudit: bank.metrics,
  sourceInventory: [{ sourceId: 'pp500-direito-administrativo', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 33, integrated: 30, duplicates: 0, needsReview: 3, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 87–91' }, { sourceId: 'nexus-original-administrativo-2026', sourceName: 'Questões originais NEXUS ACADEMY baseadas em legislação oficial', questionsFound: 220, integrated: 220, duplicates: 0, needsReview: 0, pending: 0, answerKeySource: 'Constituição Federal; Leis 9.784/1999, 14.133/2021, 8.112/1990, 8.429/1992 e 8.987/1995.' }],
};

export default subject;
