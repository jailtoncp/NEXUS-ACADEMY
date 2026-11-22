import content from './direito-constitucional-content.json' with { type: 'json' };
import bank from './direito-constitucional-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-constitucional',
  name: 'Direito Constitucional',
  abbreviation: 'DCON',
  description: 'Constituição Federal de 1988: fundamentos, direitos e garantias, organização do Estado, Poderes e Administração Pública constitucional.',
  questionNotice: '36 questões autorais do NEXUS ACADEMY, elaboradas a partir do material de estudo enviado e de fontes constitucionais e institucionais oficiais. Nenhuma questão de prova ou de banco de terceiros foi reproduzida.',
  topics: content,
  questions: bank.questions,
  reviewCount: bank.metrics.heldForReview,
  questionAudit: bank.metrics,
  sourceInventory: [
    'Material fornecido: Direito Constitucional — apostila de preparação para concursos, anotações e capturas de tela. Conteúdo reorganizado e reescrito.',
    'Constituição da República Federativa do Brasil de 1988, texto consolidado e alterações constitucionais vigentes consultadas em 20/11/2026.',
    'Legislação federal correlata e jurisprudência institucional do STF, TSE e demais órgãos oficiais indicada nos assuntos correspondentes.'
  ],
};

export default subject;
