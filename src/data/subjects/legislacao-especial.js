import content from './legislacao-especial-content.json' with { type: 'json' };
import bank from './legislacao-especial-question-bank.json' with { type: 'json' };
import realBank from './legislacao-especial-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'legislacao-especial',
  name: 'Legislação Especial',
  abbreviation: 'LEG',
  description: 'Leis penais especiais cobradas em concursos policiais: drogas, abuso de autoridade, desarmamento, crimes hediondos, tortura, lavagem de dinheiro, Maria da Penha e organizações criminosas.',
  questionNotice: `${realBank.questions.length} questões reais com gabarito e comentário extraídas do banco de 300+ questões comentadas do acervo (Polícia Penal; sem banca e ano no material) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. Estas leis foram alteradas várias vezes (inclusive pela Lei 15.358/2026); questões antigas podem estar desatualizadas. O gabarito e o comentário seguem o material de origem e não foram conferidos de forma independente. Esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [],
};

export default subject;
