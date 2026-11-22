import content from './portugues-content.json' with { type: 'json' };
import bank from './portugues-question-bank.json' with { type: 'json' };
import realBank from './portugues-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'portugues',
  name: 'Português',
  abbreviation: 'PORT',
  description: 'Teoria organizada por tópicos do edital de Língua Portuguesa, questões reais extraídas e auditadas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length} questões reais do acervo publicadas do PDF 2, com gabaritos conferidos e comentários. O PDF 2 contém 80 questões de Português; as 80 questões já foram extraídas e examinadas; 15 permanecem em revisão por ambiguidade, múltiplas respostas ou defeito editorial. Também há ${bank.questions.length} questões autorais do NEXUS ACADEMY. Esta disciplina ainda não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: realBank.metrics.questionsInReview,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [{ sourceId: 'pp500-portugues', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 80, integrated: 31, pendingExtractionOrDeduplication: 0, needsReview: 15, answerKeySource: 'gabarito_comentado.pdf, pp. 103–109' }],
};

export default subject;
