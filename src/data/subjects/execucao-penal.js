import content from './execucao-penal-content.json' with { type: 'json' };
import bank from './execucao-penal-question-bank.json' with { type: 'json' };
import realBank from './execucao-penal-real-question-bank.json' with { type: 'json' };
import pp500Bank from './execucao-penal-pp500-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'execucao-penal',
  name: 'Execução Penal',
  abbreviation: 'LEP',
  description: 'Lei de Execução Penal (Lei 7.210/1984): classificação, assistência, trabalho, remição, direitos, disciplina, regimes e livramento, com as atualizações de 2024 e 2026.',
  questionNotice: `${realBank.questions.length + pp500Bank.questions.length} questões reais (incluindo ${pp500Bank.metrics.questionsIntegrated} questões validadas do PDF 2) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. No bloco PDF 2, ${pp500Bank.metrics.duplicates} foram classificadas como repetidas e ${pp500Bank.metrics.questionsInReview} ficaram em revisão; a Q49 da seção anterior também permanece em revisão. Itens sobre progressão, exame criminológico, saída temporária e RDD foram confrontados com a legislação vigente em 22/11/2026.`,
  topics: content,
  questions: [...realBank.questions, ...pp500Bank.questions, ...bank.questions],
  reviewCount: pp500Bank.metrics.questionsInReview + 1,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, pdf2: pp500Bank.metrics },
  sourceInventory: [{ sourceId: 'pp500-execucao-penal-legislacao', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 1, integrated: 0, duplicates: 0, needsReview: 1, pending: 0, note: 'Q49 da seção de Legislação Penal/Processual Penal retida: o enunciado absoluto sobre início da execução exige distinção entre execução definitiva e hipóteses específicas de execução provisória.' }, { sourceId: 'pp500-execucao-penal', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 50, integrated: pp500Bank.metrics.questionsIntegrated, duplicates: pp500Bank.metrics.duplicates, needsReview: pp500Bank.metrics.questionsInReview, pending: pp500Bank.metrics.questionsPending, answerKeySource: 'gabarito_comentado.pdf, pp. 82–86' }],
};

export default subject;
