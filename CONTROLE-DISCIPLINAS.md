# CONTROLE-DISCIPLINAS.md — NEXUS ACADEMY

**Atualizado em:** 2026-10-17
**Escopo desta etapa:** exclusivamente Informática, além do ajuste mínimo de CI necessário para publicar o site.

## Regra de conteúdo e imagens

O usuário autorizou o uso de imagens que considera públicas e esclareceu que questões textuais devem permanecer sem figura. Para esta implementação, optou-se por não republicar enunciados, alternativas, comentários ou capturas literais dos materiais-fonte: o módulo usa explicações e questões autorais. As três questões autorais que dependem de leitura visual têm diagramas próprios correspondentes; as demais são textuais. Qualquer questão futura transcrita ou figura literal deve ser avaliada separadamente quanto à permissão de publicação.

## Status das disciplinas

| Disciplina | Responsável informado | Status | Acompanhamento |
|---|---|---|---|
| Raciocínio Lógico | Manus 2 | **FINALIZADA** | Não refazer. Os arquivos de dados da disciplina não foram modificados nesta etapa. O componente compartilhado foi ajustado para Informática e os fluxos de RLM foram testados. |
| Informática | Claude (etapas 2 e 3) | **EM ANDAMENTO — 12 DE 44 FONTES COM QUESTÕES EXTRAÍDAS** | Trilha com 446 questões reais únicas (apostila geral + 11 PDFs de revisão) e 34 autorais. PDFs escaneados e slides ainda não auditados; não declarar finalizada. |
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
- `package.json` — bindings Linux x64 opcionais exigidos pelo runner de CI para Rolldown e Lightning CSS.
- `package-lock.json` — versões reproduzíveis e bindings Linux arm64/x64 presentes no lockfile.
- `.github/workflows/deploy.yml` — instalação do workflow alterada para `npm ci`.
- `CONTROLE-DISCIPLINAS.md` — este registro de continuidade.

Os arquivos de dados de Raciocínio Lógico não foram alterados. As mudanças no componente compartilhado são necessárias para apresentar Informática e foram verificadas em RLM. O ajuste de CI limitou-se à instalação reproduzível das dependências e aos binários opcionais da plataforma do runner.

## Testes efetivamente realizados

- `npm ci --no-audit --no-fund` — **passou** localmente.
- `npm run build` — **passou** localmente e no runner Ubuntu x64. O Vite emite um aviso informativo de tamanho do chunk JavaScript (aprox. 585 kB, acima do limite padrão de 500 kB); não impede o build.
- GitHub Actions — **deploy concluído com sucesso** no commit `581221a1b47cb8822ad2d587dec1e924d16ad990`; execução [39024715672](https://github.com/jailtoncp/NEXUS-ACADEMY/actions/runs/39024715672).
- Smoke test público — a página, os bundles JS/CSS e os 3 PNGs autorais responderam HTTP 200; o bundle contém Informática e Raciocínio Lógico.
- Verificação no navegador público — Informática abre e apresenta 34 questões; Raciocínio Lógico abre e apresenta 313 questões. Nenhum arquivo de dados de RLM foi alterado.
- `git diff --check` — **passou**.
- Validação estrutural — **passou**: 10 tópicos, 25 subtópicos, 34 questões, cinco alternativas por questão, gabaritos presentes, IDs únicos, classificação curricular válida e três imagens existentes com texto alternativo e legenda.
- Chromium/Playwright sobre a build estática — **passou**: navegação para Informática, filtro por assunto, links oficiais, resposta correta e feedback, histórico local, carregamento dos diagramas nas questões 18, 22 e 33, layout móvel de 390 px sem rolagem horizontal e navegação de Raciocínio Lógico (313 questões disponíveis); nenhum erro JavaScript.
- Revisão visual — conteúdo desktop e diagrama de e-mail em celular conferidos; a sidebar conclui a transição móvel e as imagens carregam.

## Pendências e publicação

- A auditoria individual das 43 fontes restantes, a contagem total de questões originais, a deduplicação global e a classificação de itens originais em prontos/em auditoria continuam pendentes. Não declarar Informática finalizada até resolver ou delimitar explicitamente essa auditoria.
- **Publicação verificada:** [https://jailtoncp.github.io/NEXUS-ACADEMY/](https://jailtoncp.github.io/NEXUS-ACADEMY/). O build e o deploy pelo GitHub Actions concluíram com sucesso; o smoke test público confirmou navegação e figuras.
- Nenhum texto de questão original, gabarito original ou figura literal foi publicado na etapa 1. **A etapa 2 (abaixo) inclui questões reais e recortes de figuras: o repositório deve permanecer privado.**

## Etapa 2 — Informática: apostila geral (questões reais)

**Fonte examinada:** `apostila .pdf` (seção INFORMÁTICA, 300 questões, págs. 267–320 do PDF; gabarito nas págs. 382–385). Esta é **1 das 44 fontes candidatas**; as demais continuam sem auditoria. A apostila `APOSTILA 2000` (PM-SP, Nova Concursos) foi inspecionada mas **ainda não extraída**, e os 41 arquivos de Português são majoritariamente escaneados (exigem leitura página a página).

| Item | Resultado |
| --- | --- |
| Questões encontradas | 300 (sequência 1–300 completa, 5 alternativas cada) |
| Gabarito da apostila | 300 de 300 localizados, sem lacunas nem duplicatas |
| Duplicatas removidas | 32 (21 grupos) → **268 questões únicas** |
| Questões com recorte de figura | 80 (inclui 5 com alternativas em imagem) |
| Banca / ano / prova | **Não informados na apostila** — campos mantidos nulos |
| Comentários explicativos | **0** das 268 — pendente |
| Classificação por assunto | Regras automáticas + revisão manual de 36 itens duvidosos: 233 alta, 24 revisada, 10 média, 1 baixa confiança |

**Gabarito — o que foi e o que não foi conferido:** o gabarito de cada questão é o da própria apostila. Conferência independente feita à mão em apenas 4 questões (1, 6, 7 e 189). Divergência encontrada: questões 189 e 246 são a mesma questão, com gabarito B e A; pela figura o correto é **B**, e a 246 foi excluída como duplicata. Fora essas, o gabarito **não foi verificado** e pode conter erros da fonte.

**Limitações conhecidas:** texto extraído do PDF (não digitado à mão); formatação como negrito, tachado e cores só aparece nos recortes de figura; poucas questões podem ter espaços indevidos herdados do PDF (ex.: URL na questão 298).

**Arquivos criados/alterados:** `src/data/subjects/informatica-real-question-bank.json` (novo), `public/questoes/informatica/*.png` (80 novos), `src/data/subjects/informatica.js` (importa o novo banco; avisos atualizados), `CONTROLE-DISCIPLINAS.md`. Componentes compartilhados e demais disciplinas **não foram alterados**.

**Testes realizados:** carregamento do módulo no Node 22 e verificação programática das 302 questões (ids únicos, tópicos/subtópicos existentes, alternativas A–E preenchidas, gabarito válido, imagens existentes): 0 erros. **Não executados:** `npm ci`, `npm run build` e teste no navegador (sem acesso à rede no ambiente de trabalho).

## Etapa 3 — Informática: PDFs de revisão do segundo acervo

**Fontes examinadas (11 arquivos "INFO questões", todos com texto e gabarito):** Windows 1, Word 2, Excel 3, Correio eletrônico 4, e os arquivos 5, 6, 8, 9, 10, 11 e 12. Somadas à apostila geral da etapa 2, são **12 das 44 fontes candidatas com questões extraídas** (a contagem de 44 vem do levantamento anterior e não foi refeita).

| Item | Resultado |
| --- | --- |
| Questões encontradas nos 11 PDFs | 189 (numeração e gabarito completos: 189 de 189) |
| Já presentes no banco (mesmo texto e mesmo gabarito) | 11 → registradas em `alsoIn`, sem duplicar |
| Novas integradas | 178 |
| **Total de questões reais únicas** | **446** (268 da etapa 2 + 178) |
| Recortes de figura | 141 questões no total (61 novos) |
| Banca e ano | 18 questões, apenas onde o material informa (CESPE, IDECAN etc.); demais ficam nulos |
| Formatos | inclui 3 questões Certo/Errado e 2 questões com 4 alternativas |
| Comentários explicativos | 0 — pendente |

**Observação sobre quase-duplicatas:** a questão 10 do arquivo "INFO questões 10" difere da INFO-REAL-184 por uma palavra ("óptica" x "magnética"). Os gabaritos (E e D) estão corretos para cada enunciado, então as duas foram mantidas.

**Classificação:** os arquivos temáticos (Windows, Word, Excel, Correio, Hardware, Videoconferência) usam o assunto do próprio arquivo como tópico; os 28 itens dos arquivos de tópicos mistos (8, 11 e 12) foram classificados por regras e ajustados à mão. O subtópico dentro de cada tópico é automático e pode precisar de ajuste.

**Gabarito:** continua sendo o do material de origem. A única conferência independente nesta etapa foi a comparação com as questões já integradas: nenhuma divergência real nas 11 repetidas.

**Ainda NÃO auditado em Informática:** 7 PDFs de aula escaneados (INFO 1, 2, 3, 41, 42, 43 e 5) e o PDF de questões escaneado "INFO questões 7" (33 págs) — exigem leitura página a página; os slides INFO 6, 7 e 8 (contêm questões em formato de slide); a apostila `APOSTILA 2000` (PM-SP); e as demais fontes do levantamento original. Direito Penal e Direito Processual Penal do mesmo acervo ainda não foram iniciados.

**Testes:** carregamento do módulo no Node 22 e verificação programática das 480 questões (ids únicos, tópicos e subtópicos existentes, alternativas e gabarito consistentes, imagens existentes, alternativas em imagem sempre com recorte): 0 erros. `npm ci`, `npm run build` e teste no navegador **não foram executados** (sem rede no ambiente).
