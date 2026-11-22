import bank from './direito-administrativo-pp500-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-administrativo',
  name: 'Direito Administrativo',
  abbreviation: 'DADM',
  description: 'Princípios e organização da Administração Pública, atos e poderes administrativos, serviços públicos, agentes públicos, improbidade, transparência, controle, licitações, contratos, responsabilidade do Estado e orçamento.',
  questionNotice: `${bank.questions.length} questões reais do PDF 2 publicadas após validação independente. ${bank.metrics.questionsInReview} questões foram retidas por inconsistência normativa ou ausência de alternativa correta.`,
  topics: [],
  questions: bank.questions,
  reviewCount: bank.metrics.questionsInReview,
  questionAudit: bank.metrics,
  sourceInventory: [{ sourceId: 'pp500-direito-administrativo', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 33, integrated: bank.metrics.questionsIntegrated, duplicates: bank.metrics.duplicates, needsReview: bank.metrics.questionsInReview, pending: bank.metrics.questionsPending, answerKeySource: 'gabarito_comentado.pdf, pp. 87–91' }],
};

export default subject;
