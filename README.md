# NEXUS ACADEMY

Plataforma de estudo **de uso pessoal** para concursos policiais (Polícia Civil, Polícia Científica e áreas afins). Organiza o acervo de materiais em disciplinas, tópicos, teoria e bancos de questões com gabarito. Feita com React, Vite e JavaScript (JSX).

> **Privacidade:** o banco contém questões e recortes de materiais de cursos e apostilas. Mantenha este repositório **privado** e **não publique** o site. Veja "Publicação" abaixo.

## Como rodar no seu computador

```bash
npm ci
npm run dev
```

Abra o endereço mostrado no terminal **acrescentando `/NEXUS-ACADEMY/`** (por exemplo, `http://localhost:5173/NEXUS-ACADEMY/`), porque o projeto usa esse caminho-base (`vite.config.js`).

Para conferir a compilação: `npm run build`.

## Estado das disciplinas

O estado detalhado, com números, fontes e pendências, está em `CONTROLE-DISCIPLINAS.md`. Resumo:

| Disciplina | Situação |
| --- | --- |
| Raciocínio Lógico | Finalizada anteriormente (313 questões). Há pendências de revisão registradas no controle. |
| Informática | Quase completa: 13 tópicos, 54 subtópicos, 882 questões reais e 34 autorais. Faltam comentários em texto e conferência com o edital oficial. |
| Português | Em andamento: 10 tópicos, 28 subtópicos, 896 questões reais e 35 autorais. Faltam questões pendentes das duas apostilas e comentários. |
| Demais disciplinas | Ainda não implementadas (telas provisórias). |

## Estrutura

```
src/
  main.jsx                      navegação e registro das disciplinas
  components/DisciplineModule.jsx  tela de uma disciplina (teoria e questões)
  data/subjects/
    <disciplina>.js             monta a disciplina (tópicos + questões)
    <disciplina>-content.json   teoria: tópicos e subtópicos
    <disciplina>-real-question-bank.json   questões reais extraídas do acervo
    <disciplina>-question-bank.json        questões autorais (complemento)
public/questoes/<disciplina>/   recortes de imagem (texto-base, figuras, questões)
CONTROLE-DISCIPLINAS.md         registro verificável do que foi feito e do que falta
```

### Formato de uma questão

Campos principais: `id`, `origin` (`real` ou `authorial`), `prompt`, `options` (A–E; também aceita 2 alternativas, no estilo Certo/Errado, ou 4), `answer`, `comment`, `topicId`, `subtopicId`, `board`, `year`, `exam`, `source` (arquivo, número e página de origem) e, opcionalmente, `images` com recortes (`src` relativo a `public/`, `location: "prompt"`). Questões reais mantêm banca, ano e fonte apenas quando o material informa; nada é inventado.

### Adicionar questões

1. Inclua a questão no `*-real-question-bank.json` da disciplina, com `topicId` e `subtopicId` que existam no `*-content.json`.
2. Se houver imagem, salve em `public/questoes/<disciplina>/` e referencie em `images`.
3. Todo tópico precisa ter ao menos uma questão (a tela não trata lista vazia).

## Publicação (GitHub Pages)

O fluxo `.github/workflows/deploy.yml` publica o site a cada `push` na branch `main`. Em conta gratuita, o Pages só funciona com repositório **público**. Se o objetivo é uso pessoal, **desative o fluxo** (ou troque o gatilho `push` por `workflow_dispatch`) e use apenas `npm run dev` localmente.

## Limitações conhecidas

- Os gabaritos são os dos materiais de origem; só uma parte foi conferida de forma independente.
- Parte das questões vem como recorte de imagem (texto-base, figuras e questões de aulas escaneadas).
- A classificação por assunto das questões reais é automática e pode precisar de ajustes.
- O build (`npm run build`) e os testes no navegador não foram executados no ambiente em que os dados foram preparados; rode-os antes de confiar no resultado.
