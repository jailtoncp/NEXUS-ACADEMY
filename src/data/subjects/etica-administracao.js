import bank from './etica-administracao-pp500-question-bank.json' with { type: 'json' };

const subject = {
  id: 'etica-administracao',
  name: 'Ética e Noções de Administração Pública',
  abbreviation: 'ETAP',
  description: 'Módulo de questões sobre princípios da Administração Pública, ética funcional, improbidade, transparência, controle, licitações, orçamento e responsabilidade do Estado.',
  questionNotice: `${bank.questions.length} questões reais do PDF 2 publicadas após validação independente. ${bank.metrics.questionsInReview} questões foram retidas por inconsistência normativa ou ausência de alternativa correta.`,
  topics: [],
  questions: bank.questions,
  reviewCount: bank.metrics.questionsInReview,
  questionAudit: bank.metrics,
  sourceInventory: [{ sourceId: 'pp500-etica-administracao', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 40, integrated: bank.metrics.questionsIntegrated, duplicates: bank.metrics.duplicates, needsReview: bank.metrics.questionsInReview, pending: bank.metrics.questionsPending, answerKeySource: 'sem gabarito complementar; validação independente' }],
};

export default subject;
