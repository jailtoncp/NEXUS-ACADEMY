import content from './legislacao-especial-content.json' with { type: 'json' };
import bank from './legislacao-especial-question-bank.json' with { type: 'json' };
import pp500Bank from './legislacao-especial-pp500-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'legislacao-especial',
  name: 'Legislação Especial',
  abbreviation: 'LEG',
  description: 'Leis penais especiais cobradas em concursos policiais: drogas, abuso de autoridade, desarmamento, crimes hediondos, tortura, lavagem de dinheiro, Maria da Penha e organizações criminosas.',
  questionNotice: `${realBank.questions.length + pp500Bank.questions.length} questões reais (incluindo 1 questão validada do PDF 2) e ${bank.questions.length} autorais. No bloco PDF 2, 2 foram classificadas como repetidas e 2 ficaram em revisão. A questão de progressão de hediondos (Q10) não foi publicada porque o percentual de 40% do material está desatualizado após alteração legislativa de 2026.`,
  topics: content,
  questions: [...realBank.questions, ...pp500Bank.questions, ...bank.questions],
  reviewCount: 2,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, pdf2: pp500Bank.metrics },
  sourceInventory: [{ sourceId: 'pp500-legislacao-especial', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 5, integrated: 1, duplicates: 2, needsReview: 2, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 77–81' }],
};

export default subject;
