import content from './direito-penal-content.json' with { type: 'json' };
import realBank from './direito-penal-real-question-bank.json' with { type: 'json' };
import bank from './direito-penal-question-bank.json' with { type: 'json' };
import pp500Bank from './direito-penal-pp500-supplemental-question-bank.json' with { type: 'json' };
import ethicsSourceBank from './direito-penal-etica-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-penal',
  name: 'Direito Penal',
  abbreviation: 'DPE',
  description: 'Parte Geral e Parte Especial do Código Penal com atualizações legislativas recentes, questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length + pp500Bank.questions.length + ethicsSourceBank.questions.length} questões reais (incluindo questões validadas do PDF 2 e conferidas com o gabarito complementar do PDF 4) e ${bank.questions.length} autorais. No bloco PDF 2, 7 foram classificadas como repetidas e 4 ficaram em revisão; a Q1, Q6, Q8 e Q12 não foram publicadas. Os itens novos têm comentários e referências às páginas da fonte.`,
  topics: content,
  questions: [...realBank.questions, ...pp500Bank.questions, ...ethicsSourceBank.questions, ...bank.questions],
  reviewCount: 4,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, pdf2: pp500Bank.metrics, ethicsSource: ethicsSourceBank.metrics },
  sourceInventory: [{ sourceId: 'pp500-legislacao-penal', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 24, integrated: 14, duplicates: 6, needsReview: 4, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 77–81' }, { sourceId: 'pp500-ethics-peculato', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 1, integrated: 1, duplicates: 0, needsReview: 0, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 87–91; classificada em Direito Penal por tratar de peculato' }],
};

export default subject;
