import content from './portugues-content.json' with { type: 'json' };
import bank from './portugues-question-bank.json' with { type: 'json' };
import realBank from './portugues-real-question-bank.json' with { type: 'json' };
import recoveredBank from './portugues-recovered-question-bank.json' with { type: 'json' };

const subject = {
  id: 'portugues',
  name: 'Português',
  abbreviation: 'PORT',
  description: 'Teoria organizada por tópicos do edital de Língua Portuguesa, questões reais extraídas e auditadas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `962 questões no total: 927 reais (65 do PDF 2, com gabaritos conferidos e comentários, e 862 recuperadas das apostilas geral e 2000 Questões PM-SP) + 35 autorais do NEXUS ACADEMY. Atenção: as questões recuperadas preservam os gabaritos do material de origem, sem conferência independente; parte delas tem alternativas incompletas ou texto-base não localizado. As 15 questões do PDF 2 que já estavam em revisão continuam sinalizadas.`,
  topics: content,
  questions: [...realBank.questions, ...recoveredBank.questions, ...bank.questions],
  reviewCount: realBank.metrics.questionsInReview,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, recoveredQuestions: recoveredBank.metrics },
  sourceInventory: [{ sourceId: 'pp500-portugues', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 80, integrated: 31, pendingExtractionOrDeduplication: 0, needsReview: 15, answerKeySource: 'gabarito_comentado.pdf, pp. 103–109' }],
};

export default subject;
