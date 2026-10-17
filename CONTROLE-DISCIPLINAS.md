# CONTROLE-DISCIPLINAS.md — NEXUS ACADEMY

**Atualizado em:** 2026-10-17
**Escopo desta etapa:** exclusivamente Informática.

## Regra de conteúdo e imagens

O usuário autorizou o uso de imagens que considera públicas e esclareceu que questões textuais devem permanecer sem figura. Para esta implementação, optou-se por não republicar enunciados, alternativas, comentários ou capturas literais dos materiais-fonte: o módulo usa explicações e questões autorais. As três questões autorais que dependem de leitura visual têm diagramas próprios correspondentes; as demais são textuais. Qualquer questão futura transcrita ou figura literal deve ser avaliada separadamente quanto à permissão de publicação.

## Status das disciplinas

| Disciplina | Responsável informado | Status | Acompanhamento |
|---|---|---|---|
| Raciocínio Lógico | Manus 2 | **FINALIZADA** | Não refazer. Os arquivos de dados da disciplina não foram modificados nesta etapa. O componente compartilhado foi ajustado para Informática e os fluxos de RLM foram testados. |
| Informática | Manus 2 | **EM ANDAMENTO / EM REVISÃO** | Conteúdo autoral integrado e testado; auditoria de questões originais do acervo continua incompleta. |
| Português | Cursor | **PLANEJADA, AINDA NÃO IMPLEMENTADA** | Não trabalhada nesta etapa. |
| Criminologia | Manus 1 | **EM ANDAMENTO / STATUS A CONFIRMAR** | Não trabalhada nem reclassificada nesta etapa. |

Os responsáveis e estados de Português e Criminologia reproduzem o estado informado no pedido; não constituem auditoria independente.

## Informática — materiais e contagens

- **Materiais examinados:** ZIP original preservado; inventário e preparação local de 44 PDFs candidatos: 22 na pasta dedicada de Informática, 16 materiais de simulados com planilhas de gabarito e 6 PDFs mistos candidatos. Foram identificadas também 3 imagens avulsas na pasta dedicada. A triagem descartou menções incidentais e conteúdo de outras disciplinas.
- **Extração:** textos paginados e índices de imagens preparados para os 44 PDFs; 8 documentos escaneados receberam OCR em português/inglês. Esses arquivos de trabalho permanecem em `.work/informatica/` e não fazem parte do conteúdo do site.
- **Auditoria de questões-fonte:** somente 1 dos 44 PDFs teve auditoria individual concluída antes da interrupção do processo: 10 ocorrências de questões, sem conflito de gabarito identificado, e 4 itens com elemento visual mapeado. As outras 43 fontes continuam sem auditoria individual. Portanto, o número total de questões originais encontradas, duplicadas e pendentes no acervo **não está confirmado**. Nenhuma questão ou figura literal dessa auditoria foi incorporada ao site.
- **Banco autoral integrado:** 34 questões autorais, identificadas como tal, com alternativas A–E, gabarito e comentário; `board`, `year` e `exam` permanecem nulos para não inventar origem de prova. Os 34 IDs são únicos e todas as questões estão associadas a tópico e subtópico válidos. Isso não equivale a uma auditoria semântica completa de duplicidade em todo o acervo.
- **Trilha didática:** 10 tópicos e 25 subtópicos, com 17 referências a documentação oficial. Foram registradas ressalvas para conteúdos dependentes de versões e serviços atuais.
- **Figuras de questões:** 3 diagramas autorais em PNG, acompanhados de suas fontes editáveis em Mermaid: resolução DNS, protocolos de correio eletrônico e estratégia de backup 3-2-1. Os demais itens são textuais.

## Arquivos criados ou alterados

- `src/data/subjects/informatica.js` — trilha didática e referências oficiais.
- `src/data/subjects/informatica-question-bank.json` — 34 questões autorais e métricas.
- `public/informatica/figures/` — três PNGs autorais e respectivas fontes `.mmd`.
- `src/main.jsx` — integração da disciplina à navegação e às contagens.
- `src/components/DisciplineModule.jsx` — suporte compartilhado a fontes, questões autorais e figuras no enunciado ou nas alternativas.
- `src/components/discipline-module.css` — apresentação responsiva de referências e imagens.
- `CONTROLE-DISCIPLINAS.md` — este registro de continuidade.

Os arquivos de dados de Raciocínio Lógico não foram alterados. As mudanças no componente compartilhado são necessárias para apresentar Informática e foram verificadas em RLM.

## Testes efetivamente realizados

- `npm run build` — **passou**. O Vite emite um aviso informativo de tamanho do chunk JavaScript (aprox. 585 kB, acima do limite padrão de 500 kB); não impede o build.
- `git diff --check` — **passou**.
- Validação estrutural — **passou**: 10 tópicos, 25 subtópicos, 34 questões, cinco alternativas por questão, gabaritos presentes, IDs únicos, classificação curricular válida e três imagens existentes com texto alternativo e legenda.
- Chromium/Playwright sobre a build estática — **passou**: navegação para Informática, filtro por assunto, links oficiais, resposta correta e feedback, histórico local, carregamento dos diagramas nas questões 18, 22 e 33, layout móvel de 390 px sem rolagem horizontal e navegação de Raciocínio Lógico (313 questões disponíveis); nenhum erro JavaScript.
- Revisão visual — conteúdo desktop e diagrama de e-mail em celular conferidos; a sidebar conclui a transição móvel e as imagens carregam.

## Pendências e publicação

- A auditoria individual das 43 fontes restantes, a contagem total de questões originais, a deduplicação global e a classificação de itens originais em prontos/em auditoria continuam pendentes. Não declarar Informática finalizada até resolver ou delimitar explicitamente essa auditoria.
- Verificar se o push para `main` aciona a publicação do site e registrar o resultado após o envio.
- Nenhum texto de questão original, gabarito original ou figura literal foi publicado nesta etapa.
