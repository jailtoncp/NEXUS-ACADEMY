import content from './portugues-content.json' with { type: 'json' };
import bank from './portugues-question-bank.json' with { type: 'json' };
import realBank from './portugues-real-question-bank.json' with { type: 'json' };

const subject = {
  id: 'portugues',
  name: 'Português',
  abbreviation: 'PORT',
  description: 'Teoria organizada por tópicos do edital de Língua Portuguesa, questões reais extraídas do acervo e questões autorais do NEXUS ACADEMY.',
  questionNotice: `${realBank.questions.length} questões reais extraídas de duas apostilas do acervo (texto-base em imagem; banca e ano aparecem quando o material informa) e ${bank.questions.length} questões autorais do NEXUS ACADEMY. O gabarito das reais segue o do material e elas ainda não têm comentário. Parte das questões das duas apostilas ainda está pendente (alternativas incompletas no PDF ou texto-base não localizado), então esta disciplina não está finalizada.`,
  topics: content,
  questions: [...realBank.questions, ...bank.questions],
  reviewCount: 0,
  questionAudit: { ...bank.metrics, realQuestions: realBank.metrics },
  sourceInventory: [],
};

export default subject;
