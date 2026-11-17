import content from './direito-penal-content.json' with { type: 'json' };
import bank from './direito-penal-question-bank.json' with { type: 'json' };
import realBank from './direito-penal-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-penal',
  name: 'Direito Penal',
  abbreviation: 'DPE',
  description: 'Parte Geral e Parte Especial do Código Penal com atualizações legislativas recentes, questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length} questões reais extraídas da apostila geral do acervo (sem banca e ano no material) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. O gabarito das reais reflete a lei vigente na época do material e não foi conferido de forma independente; questões sobre crimes patrimoniais, feminicídio e ação penal podem ter sido afetadas por leis recentes e trazem um aviso. As reais ainda não têm comentário. Esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [],
};

export default subject;
