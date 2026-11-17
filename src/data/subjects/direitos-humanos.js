import content from './direitos-humanos-content.json' with { type: 'json' };
import bank from './direitos-humanos-question-bank.json' with { type: 'json' };
import realBank from './direitos-humanos-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direitos-humanos',
  name: 'Direitos Humanos',
  abbreviation: 'DH',
  description: 'Declaração Universal dos Direitos Humanos (1948) e Convenção Americana de Direitos Humanos (Pacto de San José), com sistema interamericano, direitos e garantias judiciais.',
  questionNotice: `${realBank.questions.length} questões reais com gabarito e comentário extraídas do banco de 300+ questões comentadas do acervo (Polícia Penal; sem banca e ano no material) e ${bank.questions.length} questões autorais do NEXUS ACADEMY.  O gabarito e o comentário seguem o material de origem e não foram conferidos de forma independente. Esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [],
};

export default subject;
