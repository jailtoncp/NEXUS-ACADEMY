import content from './portugues-content.json' with { type: 'json' };
import bank from './portugues-question-bank.json' with { type: 'json' };
import realBank from './portugues-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'portugues',
  name: 'Português',
  abbreviation: 'PORT',
  description: 'Teoria organizada por tópicos do edital de Língua Portuguesa, questões reais extraídas e auditadas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length} questões reais do acervo publicadas (12 do PDF 2, com gabaritos conferidos e comentários). O PDF 2 contém 80 questões de Português; 56 ainda aguardam extração/deduplicação e 12 itens permanecem em revisão por ambiguidade ou gabarito inconsistente. Também há ${bank.questions.length} questões autorais do NEXUS ACADEMY. Esta disciplina ainda não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [{ sourceId: 'pp500-portugues', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 80, integrated: 12, pendingExtractionOrDeduplication: 56, needsReview: 12, answerKeySource: 'gabarito_comentado.pdf, pp. 103–109' }],
};

export default subject;
