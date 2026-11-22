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
  reviewCount: 1,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [{ sourceId: 'pp500-execucao-penal', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 1, integrated: 0, duplicates: 0, needsReview: 1, pending: 0, note: 'Q49 retida: a afirmação de que a execução penal somente se inicia após o trânsito em julgado exige ressalva diante das hipóteses de execução provisória e da jurisprudência atual.' }],
};

export default subject;
