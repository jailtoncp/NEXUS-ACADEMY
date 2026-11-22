import content from './direito-processual-penal-content.json' with { type: 'json' };
import bank from './processo-penal-question-bank.json' with { type: 'json' };
import realBank from './processo-penal-real-question-bank.json' with { type: 'json' };
import pp500Bank from './processo-penal-pp500-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'processo-penal',
  name: 'Processo Penal',
  abbreviation: 'DPP',
  description: 'Persecução penal, inquérito policial, ação penal, provas, prisões e recursos, com as atualizações do pacote anticrime e do juiz das garantias, questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length + supplementalBank.questions.length + pp500Bank.questions.length} questões reais (incluindo 10 questões validadas do PDF 2) e ${bank.questions.length} autorais. No bloco PDF 2, 7 foram classificadas como repetidas e 3 ficaram em revisão. O gabarito da Q20 foi corrigido de D para C após conferência do art. 400 do CPP.`,
  topics: content,
  questions: [...realBank.questions, ...supplementalBank.questions, ...pp500Bank.questions, ...bank.questions],
  reviewCount: 3,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, supplementalQuestions: supplementalBank.metrics, pdf2: pp500Bank.metrics },
  sourceInventory: [{ sourceId: 'pp500-legislacao-processual-penal', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 20, integrated: 10, duplicates: 7, needsReview: 3, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 77–81' }],
};

export default subject;
