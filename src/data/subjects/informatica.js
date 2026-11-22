import bank from './informatica-question-bank.json' with { type: 'json' };
import realBank from './informatica-real-question-bank.json' with { type: 'json' };
import pp500Bank from './informatica-pp500-candidate-bank.json' with { type: 'json' };
import content from './informatica-content.json' with { type: 'json' };

const subject = {
  id: 'informatica',
  name: 'Informática',
  abbreviation: 'INFO',
  description: 'Teoria organizada por tópicos do edital da PC-SP (hardware, sistemas, Office, redes, e-mail, mensageria, nuvem, segurança, crimes virtuais e backup), questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${pp500Bank.questions.length} questões reais do PDF 2 publicadas, com comentários e gabaritos conferidos; ${pp500Bank.metrics.questionsInReview} questão desse bloco permanece em revisão e ${pp500Bank.metrics.duplicatesRemoved} foram identificadas como repetidas. O banco também mantém ${realBank.questions.length} questões reais de outras fontes e ${bank.questions.length} questões autorais.`,
  topics: content,
  questions: [...realBank.questions, ...pp500Bank.questions, ...bank.questions],
  reviewCount: bank.metrics.needsReviewQuestions + (realBank.metrics.questionsInReview || 0) + pp500Bank.metrics.questionsInReview,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [...(bank.sourceInventory || []), { sourceId: 'pp500-informatica', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 50, integrated: 46, duplicates: 3, needsReview: 1, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 94–98' }],
};

export default subject;
