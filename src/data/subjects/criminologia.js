import content from './criminologia-content.json' with { type: 'json' };
import bank from './criminologia-question-bank.json' with { type: 'json' };

const subject = {
  id: 'criminologia',
  name: 'Criminologia',
  abbreviation: 'CRIM',
  description: 'Teoria autoral organizada em 13 assuntos e 41 subassuntos, com questões interativas e nota jurídica verificada em 15/11/2026.',
  questionNotice: `${bank.questions.length} questões autorais com redação, alternativas e comentários próprios; questões com dúvidas de chave, OCR, classificação ou conteúdo ficaram fora do treino. Não há PDFs, páginas nem layouts do acervo publicados. O recorte jurídico foi conferido em 15/11/2026.`,
  topics: content,
  questions: bank.questions,
  reviewCount: bank.metrics.heldForReview,
  questionAudit: bank.metrics,
  sourceInventory: [],
};

export default subject;
