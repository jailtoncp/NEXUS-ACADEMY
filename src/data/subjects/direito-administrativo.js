import content from './direito-administrativo-content.json' with { type: 'json' };
import bank from './direito-administrativo-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-administrativo',
  name: 'Direito Administrativo',
  abbreviation: 'DADM',
  description: 'Regime e organização administrativa, princípios, poderes e atos, controles, serviços públicos, agentes, responsabilidade civil, licitações e contratos.',
  questionNotice: '36 questões autorais do NEXUS ACADEMY, elaboradas a partir do material enviado e de fontes legais e institucionais oficiais. Nenhuma questão de prova ou de banco de terceiros foi reproduzida. As referências indicam o âmbito de aplicação; regras federais e categorias doutrinárias não são apresentadas como universais.',
  topics: content,
  questions: bank.questions,
  reviewCount: bank.metrics.heldForReview,
  questionAudit: bank.metrics,
  sourceInventory: [
    'Material fornecido: apostilas, aulas, anotações e capturas de tela de Direito Administrativo. Conteúdo reorganizado e reescrito.',
    'Constituição Federal de 1988 e legislação federal correlata em redação atualizada, consultadas em 20/11/2026.',
    'Jurisprudência e orientações institucionais do STF, TCU, Câmara dos Deputados e órgãos federais, indicadas nos assuntos correspondentes.'
  ],
};

export default subject;
