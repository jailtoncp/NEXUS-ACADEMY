import bank from './etica-pp500-question-bank.json' with { type: 'json' };

const subject = {
  id: 'etica',
  name: 'Ética no Serviço Público',
  abbreviation: 'ETI',
  description: 'Ética funcional, conduta do servidor, conflito de interesses, sigilo profissional, integridade e atuação ética no serviço público.',
  questionNotice: `${bank.questions.length} questões reais do PDF 2 publicadas após validação independente.`,
  topics: [],
  questions: bank.questions,
  reviewCount: bank.metrics.questionsInReview,
  questionAudit: bank.metrics,
  sourceInventory: [{ sourceId: 'pp500-etica', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 6, integrated: bank.metrics.questionsIntegrated, duplicates: bank.metrics.duplicates, needsReview: bank.metrics.questionsInReview, pending: bank.metrics.questionsPending, answerKeySource: 'gabarito_comentado.pdf, pp. 87–91' }],
};

export default subject;
