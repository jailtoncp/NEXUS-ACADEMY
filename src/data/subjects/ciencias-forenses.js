import content from './ciencias-forenses-content.json' with { type: 'json' };
import bank from './ciencias-forenses-question-bank.json' with { type: 'json' };

const subject = {
  id: 'ciencias-forenses',
  name: 'Ciências Forenses',
  abbreviation: 'CFOR',
  description: 'Módulo inicial com 9 assuntos, 27 subassuntos e 36 questões autorais, elaborado a partir dos materiais enviados e complementado por referências oficiais.',
  questionNotice: '36 questões autorais, com enunciados, alternativas e comentários próprios. Nenhuma questão de prova ou de banco de terceiros foi reproduzida. O conteúdo foi reescrito a partir do livro e dos resumos enviados; referências legais e institucionais estão indicadas nos assuntos correspondentes.',
  topics: content,
  questions: bank.questions,
  reviewCount: bank.metrics.heldForReview,
  questionAudit: bank.metrics,
  sourceInventory: [
    'Material fornecido: Vinícius Pires Rincão, Perícia Forense, UniCesumar (PDF). Conteúdo resumido e reescrito.',
    'Material fornecido: Medicina Legal — resumo comentado para concursos (DOCX). Conteúdo reorganizado e reescrito.',
    'Material fornecido: Papiloscopia Forense — resumo comentado para concursos (DOCX). Conteúdo reorganizado e reescrito.',
    'Código de Processo Penal, arts. 6º, 158, 158-A a 158-F, 159, 160, 167 e 169; Lei nº 13.964/2019.',
    'Ministério da Justiça e Segurança Pública, POPs de Perícia Criminal 2024 — Papiloscopia.',
    'Ministério da Saúde, Manual de instruções para preenchimento da Declaração de Óbito.',
    'Polícia Científica de Santa Catarina, SVO x DML — exemplo de fluxo estadual.'
  ],
};

export default subject;
