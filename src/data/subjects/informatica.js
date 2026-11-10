import bank from './informatica-question-bank.json' with { type: 'json' };
import realBank from './informatica-real-question-bank.json' with { type: 'json' };
import content from './informatica-content.json' with { type: 'json' };

const subject = {
  id: 'informatica',
  name: 'Informática',
  abbreviation: 'INFO',
  description: 'Teoria organizada por tópicos do edital da PC-SP (hardware, sistemas, Office, redes, e-mail, mensageria, nuvem, segurança, crimes virtuais e backup), questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length} questões reais extraídas do acervo (apostila geral e revisões em PDF) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. Banca e ano aparecem apenas quando o material informa. O gabarito segue o do material de origem e as questões reais ainda não têm comentário. Parte do acervo (PDFs escaneados e slides) ainda não foi auditada, portanto este banco não é um inventário integral.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: bank.metrics.needsReviewQuestions,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: bank.sourceInventory,
};

export default subject;
