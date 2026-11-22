import bank from './atualidades-pp500-question-bank.json' with { type: 'json' };

const subject = {
  id: 'atualidades',
  name: 'Atualidades',
  abbreviation: 'ATU',
  description: 'Módulo de questões atuais sobre políticas penais, sistema prisional, segurança pública, direitos humanos e instituições.',
  questionNotice: `${bank.questions.length} questões reais do PDF 2 publicadas após validação independente. ${bank.metrics.duplicates} questões foram classificadas como repetidas e ${bank.metrics.questionsInReview} ficaram em revisão por inconsistência factual ou falta de precisão na fonte.`,
  topics: [],
  questions: bank.questions,
  reviewCount: bank.metrics.questionsInReview,
  questionAudit: bank.metrics,
  sourceInventory: [{ sourceId: 'pp500-atualidades', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 40, integrated: bank.metrics.questionsIntegrated, duplicates: bank.metrics.duplicates, needsReview: bank.metrics.questionsInReview, pending: bank.metrics.questionsPending, answerKeySource: 'sem gabarito complementar; validação independente' }],
};

export default subject;
