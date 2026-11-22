import content from './direito-processual-penal-content.json' with { type: 'json' };
import bank from './processo-penal-question-bank.json' with { type: 'json' };
import realBank from './processo-penal-real-question-bank.json' with { type: 'json' };
import supplementalBank from './processo-penal-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'processo-penal',
  name: 'Processo Penal',
  abbreviation: 'DPP',
  description: 'Persecução penal, inquérito policial, ação penal, provas, prisões e recursos, com as atualizações do pacote anticrime e do juiz das garantias, questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length + supplementalBank.questions.length} questões reais extraídas do acervo (inclui 3 questões recuperadas e conferidas do PDF 1) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. O gabarito das reais reflete o CPP vigente na época do material e não foi conferido de forma independente; questões sobre arquivamento, prisões, cadeia de custódia e ação penal podem ter sido afetadas por mudanças posteriores e trazem um aviso. As reais ainda não têm comentário. Esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...supplementalBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, supplementalQuestions: supplementalBank.metrics },
  sourceInventory: [],
};

export default subject;
