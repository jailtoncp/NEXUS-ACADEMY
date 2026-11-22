import content from './direitos-humanos-content.json' with { type: 'json' };
import bank from './direitos-humanos-question-bank.json' with { type: 'json' };
import realBank from './direitos-humanos-real-question-bank.json' with { type: 'json' };
import pp500Bank from './direitos-humanos-pp500-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direitos-humanos',
  name: 'Direitos Humanos',
  abbreviation: 'DH',
  description: 'Declaração Universal dos Direitos Humanos (1948) e Convenção Americana de Direitos Humanos (Pacto de San José), com sistema interamericano, direitos e garantias judiciais.',
  questionNotice: `${realBank.questions.length + pp500Bank.questions.length} questões reais de diferentes fontes, incluindo ${pp500Bank.metrics.questionsIntegrated} questões validadas do PDF 2, e ${bank.questions.length} questões autorais. No bloco PDF 2, ${pp500Bank.metrics.duplicates} foram identificadas como repetidas e ${pp500Bank.metrics.questionsInReview} ficaram em revisão. As respostas sem gabarito na fonte foram validadas com a legislação e os instrumentos internacionais indicados nos comentários.`,
  topics: content,
  questions: [...realBank.questions, ...pp500Bank.questions, ...bank.questions],
  reviewCount: pp500Bank.metrics.questionsInReview,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, pdf2: pp500Bank.metrics },
  sourceInventory: [{ sourceId: 'pp500-direitos-humanos', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 40, integrated: pp500Bank.metrics.questionsIntegrated, duplicates: pp500Bank.metrics.duplicates, needsReview: pp500Bank.metrics.questionsInReview, pending: pp500Bank.metrics.questionsPending, answerKeySource: 'sem gabarito complementar; validação independente' }],
};

export default subject;
