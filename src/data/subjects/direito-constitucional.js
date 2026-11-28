import content from './direito-constitucional-content.json' with { type: 'json' };
import bank from './direito-constitucional-question-bank.json' with { type: 'json' };

const subject = {
  id: 'direito-constitucional',
  name: 'Direito Constitucional',
  abbreviation: 'DCON',
  description: 'Constituição Federal de 1988: fundamentos, direitos e garantias, organização do Estado, Poderes e Administração Pública constitucional.',
  questionNotice: 'Banco com 36 questões autorais e 102 questões reais de concursos anteriores, identificadas por banca, concurso, ano, número, página e PDF oficial. Os comentários são explicativos e próprios; a redação das questões reais e suas alternativas foi preservada para uso em fase de testes e posterior auditoria de direitos autorais.',
  topics: content,
  questions: bank.questions,
  reviewCount: bank.metrics.heldForReview,
  questionAudit: bank.metrics,
  sourceInventory: [
    'Material fornecido: Direito Constitucional — apostila de preparação para concursos, anotações e capturas de tela. Conteúdo reorganizado e reescrito.',
    'Constituição da República Federativa do Brasil de 1988, texto consolidado e alterações constitucionais vigentes consultadas em 20/11/2026.',
    'Legislação federal correlata e jurisprudência institucional do STF, TSE e demais órgãos oficiais indicada nos assuntos correspondentes.',
    'FGV — PCAM, Delegado de Polícia — 4ª Classe, 2021: https://conhecimento.fgv.br/sites/default/files/concursos/ns001_-_delegado_de_policia_-_4a_classe_prova_objetivans001_tipo_1.pdf',
    'FGV — PCRN, Delegado de Polícia Civil Substituto: https://conhecimento.fgv.br/sites/default/files/concursos/pcrn-delegado-de-policia-civil-substituto-deleg-01-tipo-1.pdf',
    'FGV — PCPI, Delegado de Polícia Civil, 2025: https://conhecimento.fgv.br/sites/default/files/concursos/cns100-delegado-de-policia-cns100-tipo-1.pdf',
    'Cebraspe — PCPE, Delegado, 2023, prova com justificativas: https://cdn.cebraspe.org.br/concursos/pc_pe_23/arquivos/MATRIZ_955PC_PE_DELEGADO001_00_COM_JUSTIFICATIVAS_ATUALIZADO.PDF',
    'Cebraspe — Polícia Federal, 2025: https://cdn.cebraspe.org.br/concursos/pf_25/arquivos/106_PF_001_01.pdf',
    'Cebraspe — PCRJ, Delegado, 2021: https://cdn.cebraspe.org.br/concursos/pc_rj_21_delegado/arquivos/662_PCRJ_001_01.PDF',
    'Cebraspe — PCMA, Delegado, 2026: https://cdn.cebraspe.org.br/concursos/pc_ma_26_delegado/arquivos/656D00BAE831C932D2309E85E6891E3D78938C176E115A3AFEEF23B66F3D607E.pdf',
    'Cebraspe — PCCE, Delegado, 2025: https://cdn.cebraspe.org.br/concursos/pc_ce_25_delegado/arquivos/084_PC_CE_001_01.pdf'
  ],
};

export default subject;
