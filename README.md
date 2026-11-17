# NEXUS ACADEMY

Plataforma de estudo para concursos policiais, construída com React, Vite e JavaScript (JSX). Reúne disciplinas integradas, trilhas de conteúdo, questões, gabaritos e acompanhamento local de respostas.

> **Direitos e publicação:** para a atualização de 17/11/2026, o usuário declarou possuir autorização específica para publicar publicamente o conteúdo integral recebido no ZIP `atualizaçãonexus.zip` e solicitou sua publicação no GitHub Pages. Essa declaração não substitui revisão independente de direitos nem autoriza reutilização fora do escopo confirmado.

## Executar localmente

```bash
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite acrescentando `/NEXUS-ACADEMY/` (por exemplo, `http://localhost:5173/NEXUS-ACADEMY/`). Para validar a compilação, execute `npm run build`.

## Disciplinas integradas

| Disciplina | Questões | Conteúdo/status |
| --- | ---: | --- |
| Português | 931 | 10 tópicos; 896 reais e 35 autorais. Em andamento. |
| Informática | 916 | 13 tópicos; 882 reais e 34 autorais. Em andamento. |
| Raciocínio Lógico | 313 | Módulo integrado; ver pendências históricas no controle. |
| Criminologia | 340 | 13 tópicos; 41 subtópicos e 340 questões autorais; 91 itens de origem seguem fora do treino para revisão. |
| Direito Penal | 191 | 11 tópicos; 182 reais e 9 autorais. Em andamento. |
| Processo Penal | 154 | 8 tópicos; 148 reais e 6 autorais. Em andamento. |
| Execução Penal | 102 | 7 tópicos; 100 reais e 2 autorais. Em andamento. |
| Legislação Especial | 63 | 8 tópicos; 63 reais. Em andamento. |
| Direitos Humanos | 30 | 2 tópicos; DUDH e Pacto de San José. Parcial. |

**Total:** 9 disciplinas e 3.040 questões conectadas. Direito Constitucional, Direito Administrativo e Ciências Forenses seguem planejadas. As contagens são derivadas dos dados importados, não uma avaliação semântica de cada questão.

## Recursos atuais

- Pesquisa global por disciplina, assunto, subassunto, conteúdo e questão.
- Registro local de respostas, desempenho por disciplina e exportação/restauração de histórico JSON.
- Interface responsiva com tipografia ampliada e suporte a instalação como PWA; o shell é armazenado para uso offline após o primeiro carregamento.
- Questões com imagens carregam seus assets correspondentes; as cinco disciplinas desta atualização não contêm referências de imagem.
- Avisos de atualização legislativa e a origem do gabarito aparecem junto das questões quando esses dados estão disponíveis.

## Organização

```text
src/
  main.jsx                         aplicação e navegação
  components/DisciplineModule.jsx  conteúdo, banco de questões e histórico
  data/subjectRegistry.js          módulos disponíveis e planejados
  data/subjects/                  definições, trilhas e bancos por disciplina
  lib/answerHistory.js             persistência local e backup de respostas
public/
  icons/                           ícones PWA
  manifest.webmanifest             manifesto instalável
  sw.js                            service worker/offline
  questoes/                        imagens de questões existentes
CONTROLE-DISCIPLINAS.md            status, fontes, pendências e testes registrados
```

## Banco de questões

Cada módulo define questões com identificador, enunciado, alternativas, gabarito, assunto e fonte quando disponível. Alguns gabaritos refletem os materiais de origem e ainda não foram conferidos independentemente; os avisos específicos acompanham os itens afetados. Consulte o controle antes de considerar uma disciplina finalizada.

## Publicação

O workflow `.github/workflows/deploy.yml` publica automaticamente quando há push na branch `main`. Site: <https://jailtoncp.github.io/NEXUS-ACADEMY/>. A instalação PWA funciona no escopo `/NEXUS-ACADEMY/`.

## Limitações conhecidas

- Conteúdo real, gabaritos e classificação temática não foram auditados semanticamente item a item nesta integração.
- O build atual pode emitir o aviso padrão de bundle JavaScript grande; a compilação ainda conclui sem erros.
- Histórico de respostas fica neste dispositivo/navegador e só é transferido por exportação/importação explícita.

Para detalhes de auditorias, origem, números e pendências, consulte [`CONTROLE-DISCIPLINAS.md`](CONTROLE-DISCIPLINAS.md).
