import bank from './informatica-question-bank.json' with { type: 'json' };
import realBank from './informatica-real-question-bank.json' with { type: 'json' };
import content from './informatica-content.json' with { type: 'json' };

const subject = {
  id: 'informatica',
  name: 'Informática',
  abbreviation: 'INFO',
  description: 'Teoria organizada por tópicos do edital da PC-SP (hardware, sistemas, Office, redes, e-mail, mensageria, nuvem, segurança, crimes virtuais e backup), questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length} questões reais do PDF 2 publicadas, com comentários e gabaritos conferidos; 1 questão desse bloco permanece em revisão. Também há ${bank.questions.length} questões autorais do NEXUS ACADEMY. O inventário dos demais PDFs e materiais escaneados continua pendente.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: bank.metrics.needsReviewQuestions + (realBank.metrics.questionsInReview || 0),
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [...(bank.sourceInventory || []), { sourceId: 'pp500-informatica', sourceName: '500_questoes_comentadas_de_pp.pdf', questionsFound: 50, integrated: 49, needsReview: 1, pending: 0, answerKeySource: 'gabarito_comentado.pdf, pp. 94–98' }],
};

export default subject;
