import bank from './raciocinio-logico-question-bank.json' with { type: 'json' };

const subject = {
  id: 'raciocinio-logico',
  name: 'Raciocínio Lógico',
  abbreviation: 'RLM',
  description: 'Teoria consolidada e questões selecionadas dos materiais de RLM, lógica e matemática básica presentes no acervo.',
  topics: [
    {
      id: 'fundamentos', title: 'Fundamentos da lógica proposicional', order: 1,
      summary: 'Reconheça proposições e determine quando uma sentença pode ser avaliada como verdadeira ou falsa.',
      subtopics: [
        { id: 'proposicoes', title: 'Proposições e sentenças', order: 1, content: `Uma proposição é uma sentença declarativa completa à qual se pode atribuir exatamente um valor lógico: verdadeiro (V) ou falso (F). Perguntas, ordens, exclamações, desejos e sentenças abertas (com variável cujo valor não foi definido) não são proposições lógicas.\n\nUma proposição simples exprime uma única afirmação. Uma proposição composta reúne duas ou mais proposições por conectivos. Os princípios clássicos presentes no material são identidade, não contradição e terceiro excluído: uma proposição conserva seu sentido, não pode ser simultaneamente verdadeira e falsa e, no sistema bivalente, é verdadeira ou falsa.` },
        { id: 'tautologia-contradicao-contingencia', title: 'Tautologia, contradição e contingência', order: 2, content: `A classificação depende da coluna final da tabela-verdade: tautologia é verdadeira em todas as valorações; contradição é falsa em todas; contingência apresenta ao menos um resultado verdadeiro e um falso.\n\nPara n proposições simples distintas, uma tabela-verdade completa possui 2ⁿ linhas. Identifique os componentes e confira todas as combinações antes de classificar a fórmula.` }
      ]
    },
    {
      id: 'conectivos', title: 'Conectivos e tabelas-verdade', order: 2,
      summary: 'Interprete os conectivos, seus valores lógicos e as fórmulas compostas.',
      subtopics: [
        { id: 'operadores', title: 'Operadores lógicos', order: 1, content: `Conjunção (p ∧ q, “p e q”): só é verdadeira quando ambas as proposições são verdadeiras. Disjunção inclusiva (p ∨ q, “p ou q”): só é falsa quando ambas são falsas. A disjunção exclusiva é verdadeira quando exatamente uma das partes é verdadeira.\n\nCondicional (p → q, “se p, então q”): é falsa somente no caso p = V e q = F. p é o antecedente e q, o consequente. Bicondicional (p ↔ q, “p se e somente se q”): é verdadeira quando p e q têm o mesmo valor lógico. A negação (¬p) inverte o valor lógico de p.` },
        { id: 'tabelas-verdade', title: 'Construção e leitura de tabelas-verdade', order: 2, content: `Liste as combinações possíveis das proposições simples (2ⁿ linhas) e avalie os conectivos de dentro para fora, respeitando parênteses e precedência. Uma linha decisiva pode refutar uma tautologia, mas a classificação completa exige considerar todas as valorações.\n\nConfira especialmente a condicional: V → F = F; nos demais casos o resultado é V. Em provas, transcreva cada linha com atenção para não confundir disjunção inclusiva e exclusiva.` }
      ]
    },
    {
      id: 'negacoes-equivalencias', title: 'Negações e equivalências', order: 3,
      summary: 'Transforme sentenças sem alterar suas condições de verdade.',
      subtopics: [
        { id: 'negacao', title: 'Negação simples e leis de De Morgan', order: 1, content: `Negar uma proposição simples inverte seu valor lógico. Para proposições compostas, aplique De Morgan: ¬(p ∧ q) ≡ (¬p ∨ ¬q) e ¬(p ∨ q) ≡ (¬p ∧ ¬q).\n\nA negação da condicional é ¬(p → q) ≡ (p ∧ ¬q): conserva-se o antecedente, nega-se o consequente e usa-se “e”. Preserve o escopo da negação e confira o conectivo resultante.` },
        { id: 'equivalencias', title: 'Equivalências da condicional', order: 2, content: `A condicional p → q é equivalente à contrapositiva ¬q → ¬p e à disjunção ¬p ∨ q. Não se deve confundir a contrapositiva com a inversa q → p ou com a recíproca ¬p → ¬q: em geral, essas não são equivalentes à condicional original.\n\nA disjunção p ∨ q também pode ser expressa como ¬p → q. Use uma tabela-verdade para confirmar equivalências mais extensas ou com vários conectivos.` },
        { id: 'quantificadores-negacao', title: 'Negação de afirmações quantificadas', order: 3, content: `A negação de “todo A é B” é “existe A que não é B”. A negação de “nenhum A é B” é “existe A que é B”. A negação de uma afirmação existencial exige que nenhum elemento satisfaça a condição.\n\nTroque o quantificador universal pelo existencial (e vice-versa), negue a propriedade e mantenha o domínio e o escopo corretos.` }
      ]
    },
    {
      id: 'quantificadores', title: 'Quantificadores e lógica de predicados', order: 4,
      summary: 'Interprete afirmações universais e particulares e relações entre classes.',
      subtopics: [
        { id: 'proposicoes-categoricas', title: 'Proposições universais e particulares', order: 1, content: `“Todo A é B” afirma inclusão de A em B; “nenhum A é B” afirma que as classes não têm elementos em comum; “algum A é B” afirma existência de elemento na interseção; “algum A não é B” afirma que existe elemento de A fora de B.\n\nDistinguir universal e particular, bem como afirmativa e negativa, ajuda a avaliar silogismos. Não conclua que uma classe tem elementos apenas porque uma afirmação universal descreve sua relação.` },
        { id: 'negacoes-quantificadores', title: 'Quantificadores e suas negações', order: 2, content: `Quantificador universal: vale para todos os elementos do domínio. Quantificador existencial: vale para pelo menos um. Para negar uma afirmação universal, basta um contraexemplo; para negar uma existencial, todos os elementos devem falhar na condição.\n\nEm questões com predicados e classes, explicite o domínio e traduza “todo”, “nenhum”, “algum” e “algum não” antes de escolher a alternativa.` }
      ]
    },
    {
      id: 'argumentos', title: 'Argumentação lógica', order: 5,
      summary: 'Avalie se a conclusão decorre necessariamente das premissas.',
      subtopics: [
        { id: 'validade', title: 'Validade e silogismos', order: 1, content: `Um argumento reúne premissas e uma conclusão. É válido quando não existe situação em que todas as premissas sejam verdadeiras e a conclusão falsa. A validade diz respeito à forma do raciocínio, não à verdade factual das premissas.\n\nNos silogismos, organize as classes e verifique a conclusão à luz de todas as premissas. Diagramas podem ajudar; não afirme existência particular sem uma premissa que a garanta.` },
        { id: 'argumentos-hipoteticos', title: 'Argumentos hipotéticos', order: 2, content: `Modus ponens: p → q; p; logo q. Modus tollens: p → q; ¬q; logo ¬p. Silogismo hipotético: p → q; q → r; logo p → r.\n\nA afirmação de uma condicional não permite afirmar seu antecedente a partir do consequente, nem negar o consequente a partir da negação do antecedente. Em cadeias e dilemas, simbolize as premissas antes de concluir.` },
        { id: 'verdades-mentiras', title: 'Problemas de verdades e mentiras', order: 3, content: `Trate as informações sobre quem diz a verdade ou mente como restrições. Teste hipóteses, registre o valor lógico de cada afirmação e descarte os casos incompatíveis com o enunciado.\n\nUma tabela de casos reduz o risco de concluir por intuição, especialmente quando a questão fixa quantas afirmações são verdadeiras ou falsas.` }
      ]
    },
    {
      id: 'associacoes', title: 'Associações lógicas', order: 6,
      summary: 'Organize pistas sobre pessoas, características, lugares, funções e relações.',
      subtopics: [
        { id: 'quadros-logicos', title: 'Tabelas de associação', order: 1, content: `Construa uma grade com as categorias e marque relações certas, impossíveis e ainda abertas. Converta cada pista em uma restrição, elimine possibilidades incompatíveis e propague as consequências antes de avaliar as alternativas.\n\nNão assuma que a ordem apresentada no enunciado corresponde às associações corretas. Para problemas com várias pessoas e atributos, atualize a grade a cada dedução.` }
      ]
    },
    {
      id: 'conjuntos', title: 'Conjuntos e diagramas', order: 7,
      summary: 'Represente relações entre classes e resolva problemas de inclusão e interseção.',
      subtopics: [
        { id: 'operacoes-conjuntos', title: 'Operações e relações entre conjuntos', order: 1, content: `Use ∈ para pertinência e ⊆ para inclusão. A união A ∪ B reúne os elementos que pertencem a pelo menos um dos conjuntos; a interseção A ∩ B reúne os que pertencem a ambos; a diferença A \\ B reúne os que pertencem a A, mas não a B.\n\nEm problemas de contagem, identifique as regiões exclusivas e as interseções. Para dois conjuntos, |A ∪ B| = |A| + |B| − |A ∩ B|. Confira se o enunciado informa elementos em todos os grupos ou permite regiões vazias.` },
        { id: 'diagramas-venn', title: 'Diagramas e inclusão de classes', order: 2, content: `Diagramas de Venn transformam afirmações sobre classes em regiões: “todo A é B” coloca A dentro de B; “nenhum A é B” separa as regiões; “algum A é B” exige ao menos um elemento na interseção.\n\nEm questões com três ou mais conjuntos, avalie cada região e respeite quantificadores e negações. Um diagrama não autoriza supor que uma região contém elementos se isso não foi informado.` }
      ]
    },
    {
      id: 'sequencias', title: 'Sequências e padrões', order: 8,
      summary: 'Identifique regras numéricas, figurais, alfabéticas e periódicas antes de projetar termos.',
      subtopics: [
        { id: 'sequencias-numericas', title: 'Sequências numéricas', order: 1, content: `Compare diferenças sucessivas, razões, alternância de regras, soma dos algarismos e agrupamentos em posições. Progressão aritmética acrescenta uma diferença constante; progressão geométrica multiplica por uma razão constante. Sequências também podem repetir diferenças em pares ou alternar regras.\n\nTeste a regra em vários termos conhecidos antes de calcular um termo distante; não extrapole uma regra que contradiga algum dado.` },
        { id: 'sequencias-figurais', title: 'Sequências figurais e cíclicas', order: 2, content: `Em padrões com figuras, palitos ou sobreposições, procure periodicidade, rotação, posição e número de elementos. Traduza o padrão para uma contagem antes de selecionar a alternativa.\n\nEm um ciclo de k elementos, use o resto da divisão da posição por k; resto zero corresponde ao último elemento do ciclo.` },
        { id: 'sequencias-palavras', title: 'Sequências de palavras e letras', order: 3, content: `Em sequências alfabéticas, transforme letras em posições e compare os saltos; confira como o alfabeto da questão trata letras especiais quando isso for relevante. Em palavras, observe ordem, repetição, letras comuns e propriedades declaradas no enunciado.\n\nAplique o padrão à posição solicitada e confira o resultado nos termos anteriores.` }
      ]
    },
    {
      id: 'matematica-basica', title: 'Raciocínio matemático', order: 9,
      summary: 'Resolva problemas de cálculo, proporcionalidade, percentuais e medidas sem perder as condições do enunciado.',
      subtopics: [
        { id: 'aritmetica', title: 'Aritmética, frações e decimais', order: 1, content: `Respeite a ordem das operações e alinhe as casas decimais. Para multiplicar decimais, multiplique como inteiros e depois reposicione a vírgula considerando o número total de casas decimais dos fatores.\n\nSimplifique frações por fatores comuns e confira o resultado por estimativa ou operação inversa. Preserve unidades e valores ao transportar dados entre linhas de cálculo.` },
        { id: 'proporcoes', title: 'Razão, proporção e regra de três', order: 2, content: `Razão compara grandezas por divisão. Em uma proporção, produtos cruzados são iguais. Antes de aplicar regra de três, determine se as grandezas variam diretamente ou inversamente e mantenha as unidades consistentes.\n\nEm problemas de produtividade e tempo, calcule a taxa por unidade de tempo ou trabalho e só então escale para a quantidade pedida.` },
        { id: 'percentuais', title: 'Porcentagem e juros simples', order: 3, content: `x% corresponde a x/100. Um aumento ou desconto percentual é aplicado ao valor-base indicado; em variações sucessivas, cada percentual incide sobre o novo valor, não se somam automaticamente as taxas.\n\nJuros simples: J = C · i · t, com capital C, taxa i e tempo t na mesma unidade da taxa. Confira se a questão pede juros ou montante (capital mais juros).` },
        { id: 'equacoes-medias', title: 'Médias, equações e sistemas', order: 4, content: `Média aritmética simples é a soma dos valores dividida pela quantidade. Em média com incógnita, transforme a definição em uma equação. Sistemas lineares reúnem duas ou mais equações; eliminação ou substituição permitem encontrar valores compatíveis com todas elas.\n\nEm equações, preserve a igualdade ao aplicar a mesma operação aos dois lados e substitua a solução para conferir.` }
      ]
    },
    {
      id: 'combinatoria-probabilidade', title: 'Combinatória e probabilidade', order: 10,
      summary: 'Conte possibilidades e avalie eventos simples respeitando se a ordem importa.',
      subtopics: [
        { id: 'analise-combinatoria', title: 'Contagem e análise combinatória', order: 1, content: `O princípio multiplicativo conta etapas sucessivas: se há m opções em uma etapa e n na seguinte, há m·n pares possíveis. Em arranjos a ordem importa; em combinações, grupos com os mesmos elementos são contados uma vez.\n\nEm problemas do pior caso, use o princípio da casa dos pombos: distribuições suficientes em menos categorias que objetos garantem repetição. Identifique restrições antes de usar uma fórmula.` },
        { id: 'probabilidade', title: 'Probabilidade simples', order: 2, content: `Quando os resultados elementares são equiprováveis, P(A) = casos favoráveis / casos possíveis. A probabilidade fica entre 0 e 1; a do evento complementar é 1 − P(A).\n\nDefina o espaço amostral e conte resultados sem duplicar casos. Em problemas de conjuntos, diferencie união, interseção e complemento antes de calcular.` }
      ]
    }
  ],
  questions: bank.questions,
  reviewCount: bank.metrics.needsReviewQuestions,
  questionAudit: bank.metrics,
  sourceInventory: bank.sourceInventory,
};

export default subject;
