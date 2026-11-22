import content from './direitos-humanos-content.json' with { type: 'json' };
import bank from './direitos-humanos-question-bank.json' with { type: 'json' };
import realBank from './direitos-humanos-real-question-bank.json' with { type: 'json' };
import supplementalBank from './direitos-humanos-supplemental-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direitos-humanos',
  name: 'Direitos Humanos',
  abbreviation: 'DH',
  description: 'Declaração Universal dos Direitos Humanos (1948) e Convenção Americana de Direitos Humanos (Pacto de San José), com sistema interamericano, direitos e garantias judiciais.',
  questionNotice: `${realBank.questions.length + supplementalBank.questions.length} questões reais com gabarito e comentário extraídas do banco de 300+ questões comentadas do acervo (inclui 1 questão recuperada e conferida do PDF 1) e ${bank.questions.length} questões autorais do NEXUS ACADEMY.  O gabarito e o comentário seguem o material de origem e não foram conferidos de forma independente. Esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...supplementalBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics, supplementalQuestions: supplementalBank.metrics },
  sourceInventory: [],
};

export default subject;
