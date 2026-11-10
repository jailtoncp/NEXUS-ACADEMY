# CONTROLE-DISCIPLINAS.md — NEXUS ACADEMY

**Atualizado em:** 2026-10-17
**Escopo desta etapa:** exclusivamente Informática, além do ajuste mínimo de CI necessário para publicar o site.

## Regra de conteúdo e imagens

O usuário autorizou o uso de imagens que considera públicas e esclareceu que questões textuais devem permanecer sem figura. Para esta implementação, optou-se por não republicar enunciados, alternativas, comentários ou capturas literais dos materiais-fonte: o módulo usa explicações e questões autorais. As três questões autorais que dependem de leitura visual têm diagramas próprios correspondentes; as demais são textuais. Qualquer questão futura transcrita ou figura literal deve ser avaliada separadamente quanto à permissão de publicação.

## Status das disciplinas

| Disciplina | Responsável informado | Status | Acompanhamento |
|---|---|---|---|
| Raciocínio Lógico | Manus 2 | **FINALIZADA** | Não refazer. Os arquivos de dados da disciplina não foram modificados nesta etapa. O componente compartilhado foi ajustado para Informática e os fluxos de RLM foram testados. |
| Informática | Claude (etapas 2 a 7) | **QUASE COMPLETA — 849 QUESTÕES REAIS, TEORIA EXPANDIDA; FALTAM COMENTÁRIOS E CONFERÊNCIA COM O EDITAL** | 13 tópicos, 54 subtópicos (~10 mil palavras) e 849 questões reais (444 com banca e ano) mais 34 autorais. Pendentes: texto dos comentários, ~19 questões da Aula 05, 10 sem gabarito casado, 3 prints e conferência com o edital oficial. Não declarar finalizada. |
| Português | Claude (etapas 4, 5 e 8) | **EM ANDAMENTO — 896 QUESTÕES REAIS INTEGRADAS (2 APOSTILAS)** | Teoria (10 tópicos, 28 subtópicos), 896 questões reais (562 com banca e ano) e 35 autorais. Pendentes: ~104 da apostila de 2000, ~258 da apostila geral, PDFs de aula escaneados; sem comentários. Não declarar finalizada. |
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

## Etapa 4 — Português

**Implementado:** módulo `Português` ligado ao site (`src/main.jsx`), com 10 tópicos e 28 subtópicos de teoria (interpretação e organização do texto; ortografia, acentuação e hífen; morfologia; sintaxe da oração; período composto; concordância; regência e crase; pontuação; colocação pronominal; semântica, figuras de linguagem e reescrita) e **35 questões autorais** (origem `authorial`, todos os tópicos cobertos, 5 alternativas, gabarito e comentário). Arquivos novos: `portugues.js`, `portugues-content.json`, `portugues-question-bank.json`.

**Como a teoria foi feita:** é texto redigido por mim (autoral), organizado pelos assuntos dos arquivos de aula do acervo (advérbios, concordância, conjunções, tempos verbais, predicados, pronomes relativos etc.) e pelo conteúdo usual de editais. **Os 41 arquivos de Português do acervo não foram lidos:** 35 deles são PDFs escaneados e os outros 6 têm texto, mas não foram usados. A teoria deve ser conferida contra as aulas.

**Questões reais — pendente:** a apostila geral tem cerca de 600 questões de Língua Portuguesa (págs. 4–121, gabarito a partir da pág. 363). A extração automática é difícil porque a maioria depende de texto-base: os números de cerca de 59 questões não foram detectados por posição e os textos ficam entre as questões. Exige tratamento próprio (agrupar texto-base e questões, conferir gabarito) e não foi iniciada. Também faltam as questões de Português da apostila de 2000 questões (PM-SP).

**Testes:** carregamento do módulo no Node 22 e verificação programática (ids únicos, tópicos e subtópicos existentes, 5 alternativas distintas, gabarito válido, comentário presente, todos os tópicos com questões): 0 erros. `npm ci`, `npm run build` e teste no navegador **não foram executados**.

## Etapa 5 — Português: questões reais da apostila geral

**Fonte:** `apostila .pdf`, seção LÍNGUA PORTUGUESA (págs. 4–121 do PDF); gabarito nas págs. 363–370, **600 de 600 entradas localizadas, sem lacunas nem duplicatas**.

| Item | Resultado |
| --- | --- |
| Questões no gabarito | 600 |
| **Integradas ao site** | **342** (alternativas A–E completas no PDF e texto-base localizado com segurança) |
| Com texto-base em imagem | 218 (recorte fiel da apostila, inclusive tiras e charges) |
| Com recorte da própria questão | 24 (lacunas e figuras que o texto extraído não mostra) |
| Pendentes: alternativas incompletas no PDF | 113 |
| Pendentes: texto-base não localizado | 97 |
| Não encontradas no PDF pela numeração | 48 |
| Blocos sem número ignorados | 32 |
| Banca / ano / prova | **Não informados** na apostila — campos nulos |
| Comentários explicativos | 0 — pendente |

**Como o texto-base é tratado:** o texto-base aparece como recorte de imagem da página, associado à questão pelo aviso "Leia o texto para responder às questões N a M". Associações por suposição foram **descartadas**: na dúvida, a questão ficou pendente em vez de receber um texto possivelmente errado. Os números das pendentes estão em `src/data/subjects/portugues-real-question-bank.json`, campo `metrics.pending`.

**Defeitos do material de origem:** várias questões perderam linhas de alternativas no próprio PDF (ex.: a alternativa C da questão 7 não existe no arquivo); essas foram deixadas de fora. A questão 88 (integrada) tem as alternativas A e B com o mesmo texto no material.

**Classificação por assunto:** automática, por palavras-chave, **sem revisão manual**; a maioria cai em "Interpretação e organização do texto" por padrão e pode precisar de ajuste.

**Gabarito:** é o da própria apostila, sem conferência independente.

**Testes:** carregamento no Node 22 e verificação programática das 377 questões de Português (ids únicos, tópicos e subtópicos existentes, 5 alternativas, gabarito válido, imagens existentes): 0 erros. `npm ci`, `npm run build` e teste no navegador **não foram executados**.

## Etapa 6 — Informática: apostila de 2000 questões e teoria expandida

**Apostila de 2000 questões (PM-SP, Nova Concursos), seção Noções de Informática (págs. 268–309 do PDF):** 303 questões, todas com banca VUNESP e ano (2019 ou 2020) informados no próprio enunciado; gabarito 303 de 303. 31 já existiam no banco (mesmo texto e mesmo gabarito) e, nelas, os campos banca e ano foram preenchidos; 1 repetida interna; **271 novas integradas**, 135 com recorte da página (figuras, planilhas, ícones). Defeitos do material: nas questões 61, 70 e 241 as letras das alternativas estavam repetidas ou trocadas e foram atribuídas pela posição; as questões 35, 78, 79, 101 e 121 trazem só 4 alternativas (A–D) e foram mantidas com essa observação.

**Total de questões reais de Informática: 717** (320 com banca e ano), mais 34 autorais.

**Teoria (arquivo `informatica-content.json`):** reescrita e expandida para **13 tópicos e 54 subtópicos, cerca de 10 mil palavras**, organizada nos itens que o próprio acervo indica para Escrivão e Investigador da PC-SP (sistemas operacionais, hardware, editores de texto, planilhas, mensageria e correio eletrônico, Internet e intranet, crimes virtuais e cibersegurança, videoconferência), além de apresentações, nuvem, segurança e backup. Novos tópicos: Mensageria e VoIP, Videochamada e videoconferência, Crimes virtuais e cibersegurança (Deep Web e Dark Web, Marco Civil e LGPD, provas digitais e ISO 27037, criptomoedas e blockchain). Os subtópicos de versões de suporte, OneDrive/SharePoint, Teams e OneNote foram mantidos como estavam, por já trazerem datas e ressalvas específicas.

**Como a teoria foi feita:** texto redigido por mim, usando como base os slides de texto do acervo (INFO 6, 7 e 8) e conferindo pontos específicos nas aulas escaneadas lidas por OCR (Aulas 2, 3, 4, 5/6, 7 e 8). **Não houve revisão por especialista.** O OCR só tem o idioma inglês, o que perde acentos e gera ruído; por isso as aulas escaneadas foram usadas para conferência, e não copiadas. As questões foram reclassificadas nos novos subtópicos por palavras-chave, com revisão manual de 26 itens.

**Ainda NÃO feito em Informática:**
- As 7 aulas escaneadas (INFO 1, 2, 3, 41, 42, 43 e 5; o arquivo "INFO questões 7" é a mesma Aula 07 do INFO 43) trazem cerca de **176 itens com gabarito comentado** ("N. Letra X" seguido de explicação), a maioria de provas da VUNESP na PC-SP (2018 e 2020), que **não foram integrados**. Parte pode repetir questões já presentes.
- As 717 questões reais **não têm comentário explicativo**; o gabarito é o do material de origem, sem conferência independente.
- Não há edital oficial no acervo; a cobertura foi comparada apenas com os títulos dos arquivos ("Revisão Escrivão 4.x / Investigador 5.x").
- Os 3 prints (`Screenshot_*.png`) da pasta de Informática não foram examinados.

**Testes:** carregamento do módulo no Node 22 e verificação programática (751 questões e 54 subtópicos): ids únicos; tópicos e subtópicos existentes; alternativas e gabarito consistentes; imagens existentes; todo tópico tem questões; 0 erros. `npm ci`, `npm run build` e teste no navegador **não foram executados**.

## Etapa 7 — Informática: questões das aulas escaneadas

**Fontes:** as 7 aulas escaneadas (INFO 1, 2, 3, 41, 42, 43 e 5), lidas por OCR em inglês (único idioma disponível no ambiente, sem acentos). Contêm questões reais de provas da VUNESP na PC-SP (2018 e 2020) com gabarito comentado ("N. Letra X"). O arquivo "INFO questões 7" é a mesma Aula 07 (INFO 43); a Aula 42 só tem comentários, sem questões localizadas.

| Item | Resultado |
| --- | --- |
| Questões detectadas nas aulas | 175 |
| Com gabarito comentado casado | 165 |
| Já existentes no banco (mesmo texto) | 33, com **33 de 33 gabaritos iguais** ao já registrado |
| **Novas integradas** | **132** (recorte fiel da página, com acentos e formatação) |
| Total de questões reais de Informática | **849** |
| Com banca e ano | 444 |

**Como foram tratadas:** cada questão nova aparece como recorte da imagem da aula (enunciado e alternativas), com as alternativas "A–E" como botões; o gabarito vem do gabarito comentado da aula, lido por OCR. **O texto dos comentários NÃO foi transcrito**: o OCR sem acentos e a correção automática de palavras produziam erros e até trocas de sentido, o que seria pior que não ter o texto. Em vez disso, cada uma das 165 questões com gabarito comentado traz a referência da página da aula onde o comentário está (campo `commentSource`).

**Pendentes desta etapa:**
- 10 questões detectadas sem gabarito casado (Aula 01 nº 65; Aula 02 nº 4, 14 e 91; Aula 03 nº 25; Aula 04 nº 8; Aula 07 nº 15; Aula 05 nº 23, 24 e 25).
- Aula 05 (hardware): 22 gabaritos comentados, mas só 3 enunciados foram localizados por OCR; as demais provavelmente são imagens e ficaram de fora.
- Texto dos comentários, 3 prints (`Screenshot_*.png`) e conferência com o edital oficial (não há edital no acervo).

**Testes:** carregamento no Node 22 e verificação programática (883 questões de Informática e 54 subtópicos): 0 erros. `npm ci`, `npm run build` e teste no navegador **não foram executados**.

## Etapa 8 — Português: apostila de 2000 questões (PM-SP)

**Fonte:** `APOSTILA 2000_241008_080545 (1).pdf`, seção Língua Portuguesa (págs. 8–136 do PDF); gabarito nas págs. 136–139, **666 de 666 entradas localizadas**. Todas as questões trazem banca e ano no enunciado (VUNESP, 2010 a 2020), o que preenche os campos de origem que faltavam.

| Item | Resultado |
| --- | --- |
| Questões encontradas | 666 (numeração sequencial 1–666 completa) |
| **Novas integradas** | **554** |
| Repetidas das já integradas | 8 (receberam banca/ano quando faltavam) |
| Pendentes: alternativas incompletas | 49 |
| Pendentes: texto-base não localizado | 55 |
| **Total de questões reais de Português** | **896** (562 com banca e ano) |
| Com texto-base em imagem | 625 |

**Como o texto-base é tratado:** o aviso "Leia o texto para responder às questões N, M e P" identifica quais questões usam cada texto; o texto vira recorte de imagem da página (inclusive tiras e gráficos), compartilhado entre as questões. Questões que citam o texto, mas não tiveram texto localizado com segurança, ficaram pendentes em vez de receber um texto possível. Enunciados e alternativas são texto extraído do PDF; questões com figura ou lacuna (sublinhado) trazem também o recorte da questão. Os números das pendentes estão em `metrics.stage2000.pending` do arquivo `portugues-real-question-bank.json`.

**Limitações:** gabarito do material sem conferência independente; classificação por assunto automática e sem revisão (a maioria cai em "Interpretação e organização do texto" por padrão); sem comentários; alguns recortes de texto-base podem trazer um fragmento da linha anterior no topo.

**Testes:** carregamento no Node 22 e verificação programática das 931 questões de Português: 0 erros. `npm ci`, `npm run build` e teste no navegador **não foram executados**.

## Etapa 9 — Revisão final e entrega

- **Aulas de Português do acervo (39 PDFs, 474 páginas):** 6 têm camada de texto (aulas 19, 20, 21, 24, 26 e 27; as aulas 19 e 20 são idênticas) e o restante é escaneado. Amostras lidas por OCR (aulas 1 e 10) e as aulas com texto mostram que são slides de teoria com exercícios **sem gabarito publicado** (não há "Letra X" nem "Gabarito"), diferentemente das aulas de Informática. Por isso **não foram transformadas em questões reais**: precisariam ter as respostas dadas por mim, o que as tornaria questões não verificadas. Foram usadas apenas como referência de assuntos para a teoria. As demais aulas escaneadas (cerca de 340 páginas) não foram lidas.
- **Verificação final:** os três módulos (Raciocínio Lógico, Informática e Português) carregam juntos no Node 22; Informática (916 questões) e Português (931 questões) passam na checagem programática de dados e de imagens (0 erros). O build do Vite e o teste no navegador **continuam sem execução**.
- **README.md** adicionado, com instruções de uso, estrutura dos dados, como acrescentar questões e o aviso de privacidade e publicação.
- **Pendências gerais:** comentários em texto das questões reais; conferência independente dos gabaritos; edital oficial de referência; questões pendentes de Português (apostila geral e apostila de 2000); Direito Penal, Direito Processual Penal, Criminologia e demais disciplinas.
