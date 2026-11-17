import content from './execucao-penal-content.json' with { type: 'json' };
import bank from './execucao-penal-question-bank.json' with { type: 'json' };
import realBank from './execucao-penal-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'execucao-penal',
  name: 'Execução Penal',
  abbreviation: 'LEP',
  description: 'Lei de Execução Penal (Lei 7.210/1984): classificação, assistência, trabalho, remição, direitos, disciplina, regimes e livramento, com as atualizações de 2024 e 2026.',
  questionNotice: `${realBank.questions.length} questões reais com gabarito e comentário extraídas do banco de 300+ questões comentadas do acervo (Polícia Penal; sem banca e ano no material) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. Questões sobre progressão, exame criminológico, saída temporária e RDD podem ter sido afetadas pelas Leis 14.843/2024 e 15.358/2026 e trazem aviso. O gabarito e o comentário seguem o material de origem e não foram conferidos de forma independente. Esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [],
};

export default subject;
