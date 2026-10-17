import bank from './informatica-question-bank.json' with { type: 'json' };

const subject = {
  id: 'informatica',
  name: 'Informática',
  abbreviation: 'INFO',
  description: 'Trilha autoral para concursos: conceitos estáveis, diferenças de versão e questões inéditas do NEXUS ACADEMY.',
  questionNotice: '34 questões autorais do NEXUS ACADEMY; não são itens oficiais e não reproduzem enunciados ou figuras das fontes. O levantamento temático cobre 38 documentos; a auditoria individual de questões foi concluída em 1 de 44 fontes candidatas, portanto este banco não é um inventário integral do acervo.',
  topics: [
    {
      id: 'fundamentos', title: 'Fundamentos e componentes', order: 1,
      summary: 'Entenda o papel do hardware, do software, da memória e das unidades de informação.',
      subtopics: [
        { id: 'hardware-software', title: 'Hardware, software e processamento', order: 1, content: 'Hardware reúne componentes físicos, como processador, memória, unidade de armazenamento e periféricos. Software reúne instruções e dados que orientam o computador. Um sistema operacional administra recursos e oferece serviços; aplicativos realizam tarefas específicas, como editar texto ou navegar na web.\n\nA CPU executa instruções e realiza ou coordena operações de processamento. A memória RAM guarda temporariamente dados usados por programas em execução; é volátil. SSDs e discos rígidos guardam arquivos de forma não volátil, embora nenhum meio de armazenamento esteja imune a falha. Teclados e sensores enviam entradas; monitores e alto-falantes apresentam saídas; alguns dispositivos, como telas sensíveis ao toque, exercem as duas funções.' },
        { id: 'unidades-dados', title: 'Bits, bytes e capacidade', order: 2, content: 'Bit (b) representa um dígito binário. Um byte (B) contém oito bits. A distinção entre b e B importa em velocidades de rede e tamanhos de arquivo: megabits por segundo não são megabytes por segundo.\n\nOs prefixos decimais e binários não são intercambiáveis. Em convenção binária, 1 KiB = 1.024 bytes e 1 MiB = 1.024 KiB; em convenção decimal, 1 kB = 1.000 bytes e 1 MB = 1.000 kB. Em provas, use a convenção explicitada no enunciado e não arredonde antes de concluir.' }
      ]
    },
    {
      id: 'sistemas-operacionais', title: 'Sistemas operacionais e arquivos', order: 2,
      summary: 'Relacione processos, interfaces, pastas, extensões, permissões e suporte de versões.',
      subtopics: [
        { id: 'sistema-operacional', title: 'Sistema operacional, processos e interfaces', order: 1, content: 'O sistema operacional administra processador, memória, dispositivos, arquivos e contas, e oferece serviços que os aplicativos utilizam. O núcleo (kernel) executa funções centrais; interfaces gráficas e shells recebem ações do usuário e solicitam operações ao sistema. Um shell pode ser textual ou gráfico.\n\nProcessos são programas em execução, com estado e recursos associados. Drivers permitem que o sistema se comunique com dispositivos específicos. Atualizações podem corrigir falhas, mudar recursos ou ajustar compatibilidade; a disponibilidade depende da edição, da política e do ciclo de vida do produto.' },
        { id: 'arquivos-formatos', title: 'Caminhos, extensões e permissões', order: 2, content: 'Pastas organizam arquivos; um caminho identifica sua localização por uma sequência de diretórios. Extensões, como .docx, .xlsx e .pdf, ajudam a identificar formatos e associar aplicativos, mas renomear a extensão não converte os dados internos. Um arquivo pode ter sido criado em outro sistema, estar corrompido ou conter conteúdo incompatível com o sufixo exibido.\n\nPermissões controlam quem pode ler, alterar ou executar recursos. No Linux, as permissões tradicionais são descritas para proprietário, grupo e outros, com operações de leitura, escrita e execução. Em diretórios, a permissão de execução também se relaciona à possibilidade de percorrer ou pesquisar o diretório. Aplique somente os privilégios necessários.' },
        { id: 'versoes-suporte', title: 'Versões antigas e ciclo de suporte', order: 3, content: 'Materiais preparatórios podem citar Windows 7 ou 10 e versões antigas do Office. Menus, nomes de comandos e recursos variam entre edições; quando a questão identifica uma versão, responda dentro desse contexto. Conhecimento de uma interface antiga não deve ser tratado automaticamente como instrução para a versão atual.\n\nPara Windows 10 Home e Pro, a Microsoft identifica a versão 22H2 como a final e informa que o suporte normal terminou em 14 de outubro de 2025. O sistema continua funcionando, mas a ausência de atualizações regulares aumenta o risco; o programa ESU é uma exceção para dispositivos inscritos, não suporte geral contínuo. O suporte do Office 2016 e do Office 2019 também terminou em 14 de outubro de 2025; os aplicativos podem continuar abrindo, mas isso não significa que continuem recebendo suporte ou correções de segurança.', references: [
          { label: 'Microsoft — fim do suporte ao Windows 10', url: 'https://support.microsoft.com/en-us/windows/deployment/updates-lifecycle/windows-10-support-has-ended-on-october-14-2025' },
          { label: 'Microsoft Lifecycle — Windows 10 Home e Pro', url: 'https://learn.microsoft.com/en-us/lifecycle/products/windows-10-home-and-pro' },
          { label: 'Microsoft Lifecycle — Office 2016', url: 'https://learn.microsoft.com/en-us/lifecycle/products/microsoft-office-2016' },
          { label: 'Microsoft — fim do suporte ao Office 2016 e 2019', url: 'https://support.microsoft.com/en-us/office/system-requirements/end-of-support-for-office-2016-and-office-2019' }
        ] }
      ]
    },
    {
      id: 'processamento-texto', title: 'Processadores de texto', order: 3,
      summary: 'Estruture documentos, padronize estilos e revise alterações sem confundir ferramentas.',
      subtopics: [
        { id: 'word-estrutura', title: 'Estilos, páginas e seções', order: 1, content: 'Estilos aplicam um conjunto coerente de propriedades e podem indicar a função estrutural de um parágrafo, como título ou subtítulo. Quando a hierarquia é marcada com estilos, sumários automáticos e painéis de navegação podem localizar e acompanhar os cabeçalhos. Espaços digitados manualmente não substituem essa estrutura.\n\nQuebras de página iniciam uma nova página; quebras de seção permitem que partes do documento adotem configurações diferentes, como orientação, margens ou cabeçalho. Para um relatório com uma página em paisagem entre páginas em retrato, isole a página em uma seção apropriada e confira se cabeçalhos e numeração continuam como desejado.' },
        { id: 'word-revisao', title: 'Revisão, comentários e formatos', order: 2, content: 'Comentários registram observações para quem está revisando. O controle de alterações registra inserções, exclusões e outras modificações para que possam ser aceitas ou rejeitadas. Os recursos são complementares, não equivalentes. Antes de distribuir um arquivo, revise alterações pendentes e remova comentários ou metadados que não devam acompanhar a cópia.\n\nO formato nativo preserva mais recursos editáveis do aplicativo. Exportar para PDF tende a preservar a apresentação visual e facilitar leitura em diferentes dispositivos, mas não equivale a manter um documento de texto plenamente editável. A disponibilidade de comandos, formatos e opções varia conforme a versão e a configuração.' }
      ]
    },
    {
      id: 'planilhas', title: 'Planilhas eletrônicas', order: 4,
      summary: 'Use referências de células, fórmulas e ferramentas de análise com atenção à versão e à localidade.',
      subtopics: [
        { id: 'referencias-formulas', title: 'Fórmulas e referências', order: 1, content: 'Fórmulas começam com um sinal de igual e podem combinar constantes, operadores, referências e funções. Uma referência relativa, como B5, muda quando a fórmula é copiada para outra posição. Uma referência absoluta, como $B$5, mantém coluna e linha. Referências mistas fixam apenas uma parte, como $B5 ou B$5.\n\nA ordem de cálculo segue as regras do aplicativo; parênteses tornam a intenção mais clara. Ao copiar uma fórmula, verifique como cada referência se desloca. Em exemplos de prova, o nome das funções e o separador de argumentos podem depender do idioma e das configurações regionais.' },
        { id: 'funcoes-dados', title: 'Funções, erros e análise de dados', order: 2, content: 'Funções agregam cálculos comuns. SOMA adiciona valores; MÉDIA calcula uma média aritmética; uma função condicional, como SE/IF, escolhe um resultado conforme um teste lógico. Contagens e somas condicionais permitem resumir conjuntos que atendem a critérios. Os nomes localizados e os recursos disponíveis variam entre versões.\n\nClassificar reorganiza registros segundo uma ordem; filtrar restringe o que aparece, sem necessariamente apagar os demais dados. Gráficos representam relações entre dados selecionados. Erros como divisão por zero ou referência inválida indicam problemas distintos. Antes de classificar uma tabela, inclua todas as colunas correspondentes para não separar um registro de seus campos.' }
      ]
    },
    {
      id: 'apresentacoes', title: 'Apresentações', order: 5,
      summary: 'Diferencie efeitos de passagem, animações internas e configurações compartilhadas dos slides.',
      subtopics: [
        { id: 'transicoes-animacoes', title: 'Transições e animações', order: 1, content: 'Transições determinam como uma apresentação passa de um slide para outro. Animações atuam sobre elementos dentro do slide, como texto, formas ou imagens. O efeito visual pode parecer semelhante, mas o momento de aplicação é diferente. Excesso de movimento pode distrair; use efeitos que ajudem a sequência de exposição.\n\nUma apresentação pode ser exibida em tela cheia, em janela ou em modos de edição e leitura. As opções de apresentação, teclas e aparência dependem da versão, do sistema e do equipamento conectado.' },
        { id: 'mestre-layouts', title: 'Temas, layouts e slide mestre', order: 2, content: 'Um tema reúne escolhas visuais como paleta, fontes e efeitos. Layouts definem arranjos de espaços reservados para conteúdo. O slide mestre, ou recurso equivalente, centraliza elementos e padrões que se repetem em muitos slides. Alterar o padrão compartilhado ajuda a manter consistência sem editar cada slide isoladamente.\n\nAntes de distribuir, confira proporção de tela, contraste, legibilidade e compatibilidade das fontes e mídias. Os formatos editáveis e de apresentação podem preservar capacidades diferentes; PDF é útil para leitura estável, mas não substitui o arquivo-fonte quando ajustes são necessários.' }
      ]
    },
    {
      id: 'internet-redes', title: 'Internet e redes', order: 6,
      summary: 'Compreenda nomes de domínio, serviços web, transporte de dados e redes organizacionais.',
      subtopics: [
        { id: 'dns-web', title: 'DNS, endereços e navegação web', order: 1, content: 'Uma URL identifica um recurso e pode conter esquema, nome de host, caminho e parâmetros. DNS permite localizar informações associadas a nomes de domínio, inclusive endereços IP; o resolvedor consulta dados distribuídos entre servidores e pode aproveitar respostas em cache. DNS não é o mesmo que HTTP e não transporta, por si só, o conteúdo de uma página.\n\nA Web é um serviço que opera sobre a Internet. HTTP usa mensagens de solicitação e resposta para interagir com recursos. HTTPS protege a comunicação HTTP com TLS. A proteção do canal não torna automaticamente confiáveis as afirmações do site: ainda é necessário verificar domínio, contexto e identidade da organização.', references: [
          { label: 'IETF — RFC 1035: Domain Name System', url: 'https://www.rfc-editor.org/rfc/rfc1035.html' },
          { label: 'IETF — RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
          { label: 'IETF — RFC 8446: TLS 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446.html' }
        ] },
        { id: 'protocolos-redes', title: 'Protocolos, TCP, UDP e dispositivos', order: 2, content: 'Protocolos definem regras de comunicação. IP endereça e encaminha datagramas entre redes. TCP oferece mecanismos de entrega confiável e ordenada; UDP tem menos mecanismos no próprio protocolo e pode ser escolhido quando baixa latência importa ou quando a aplicação trata perdas de outra forma. Nenhum deles é, por si só, um aplicativo de navegação.\n\nUm switch conecta dispositivos em uma rede local; um roteador encaminha tráfego entre redes. Modems e pontos de acesso podem integrar outros papéis, dependendo do equipamento. A função deve ser identificada pelo contexto, não apenas pelo nome comercial impresso no aparelho.', references: [
          { label: 'IETF — RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' }
        ] },
        { id: 'redes-organizacionais', title: 'Internet, intranet e extranet', order: 3, content: 'Internet é a rede global de redes que usa a família de protocolos TCP/IP. Intranet é um ambiente de serviços internos de uma organização, que pode utilizar tecnologias da Web. Extranet estende parte desses recursos a pessoas externas autorizadas, com controle de acesso. Uma intranet pode usar conexões protegidas pela Internet sem se tornar um serviço público.\n\nConfidencialidade e disponibilidade dependem de arquitetura, autenticação, permissões e gestão de risco. Um endereço privado ou uma página com senha não elimina a necessidade de aplicar controles de segurança.' }
      ]
    },
    {
      id: 'correio-eletronico', title: 'Correio eletrônico e comunicação', order: 7,
      summary: 'Separe transporte e consulta de mensagens e reconheça funções dos campos e da comunicação por IP.',
      subtopics: [
        { id: 'protocolos-email', title: 'SMTP, IMAP e POP3', order: 1, content: 'SMTP participa do transporte de correio, inclusive da entrega entre sistemas de e-mail. IMAP permite que um cliente acesse e manipule caixas postais mantidas no servidor, favorecendo sincronização entre dispositivos. POP3 recupera mensagens do servidor; seu modelo básico é menos voltado à administração remota de pastas.\n\nEsses papéis descrevem o modelo geral, não garantem uma configuração específica. Serviços atuais costumam adicionar TLS, autenticação moderna e políticas próprias. Observe o enunciado para separar envio de mensagem, acesso à caixa postal e proteção do canal.', references: [
          { label: 'IETF — RFC 5321: SMTP', url: 'https://www.rfc-editor.org/rfc/rfc5321.html' },
          { label: 'IETF — RFC 9051: IMAP4rev2', url: 'https://www.rfc-editor.org/rfc/rfc9051.html' },
          { label: 'IETF — RFC 1939: POP3', url: 'https://www.rfc-editor.org/rfc/rfc1939.html' }
        ] },
        { id: 'campos-mensagem', title: 'Destinatários, anexos e mensagens suspeitas', order: 2, content: 'Para indica destinatários principais. Cc envia cópia visível; Cco/Bcc oculta os endereços desse campo dos outros destinatários na mensagem recebida. Esses campos não impedem reencaminhamento nem garantem confidencialidade do conteúdo. Confira cuidadosamente os endereços antes de enviar anexos ou informações restritas.\n\nVoIP transporta voz por redes que usam IP. Mensagens, chamadas e arquivos podem compartilhar a mesma infraestrutura de rede, mas têm funções e protocolos distintos. Uma mensagem que pede ação urgente, dados pessoais ou acesso por URL encurtada deve ser verificada por canal independente.' }
      ]
    },
    {
      id: 'nuvem-colaboracao', title: 'Nuvem e colaboração', order: 8,
      summary: 'Entenda armazenamento compartilhado, permissões e o comportamento atual de gravações no Teams.',
      subtopics: [
        { id: 'onedrive-sharepoint', title: 'OneDrive, SharePoint e sincronização', order: 1, content: 'OneDrive associa arquivos a uma conta de usuário e facilita armazenamento e compartilhamento. SharePoint oferece sites, bibliotecas e espaços de equipe. Os serviços se integram, mas a localização e as permissões dependem de onde o arquivo está e de como foi compartilhado. Conceda apenas o acesso necessário e reveja links públicos ou externos.\n\nSincronizar uma pasta mantém cópias locais e remotas em correspondência conforme as regras do serviço. Uma alteração ou exclusão pode se propagar. Sincronização não substitui automaticamente backup independente, versionado e restaurável.' },
        { id: 'teams-gravacoes', title: 'Teams: reuniões e gravações', order: 2, content: 'A gravação de uma reunião de canal é armazenada no site SharePoint associado ao canal. Para reuniões que não são de canal, a documentação atual indica o OneDrive do organizador, na pasta Recordings. A localização de chamadas individuais/de grupo e os direitos de acesso seguem regras próprias; não presuma que todos os participantes externos terão acesso automático.\n\nA política de expiração é administrável. A documentação de administração consultada descreve 120 dias como prazo padrão para gravações e transcrições, mas a configuração pode ser alterada pela organização. Portanto, não trate esse prazo como universal nem como garantia de retenção. A interface e as opções podem mudar; para uma questão de prova, considere a versão expressamente indicada.', references: [
          { label: 'Microsoft Learn — armazenamento e permissões das gravações do Teams', url: 'https://learn.microsoft.com/en-us/microsoftteams/tmr-meeting-recording-change' },
          { label: 'Microsoft Support — localizar e compartilhar gravações', url: 'https://support.microsoft.com/en-us/teams/meetings/play-share-and-download-meeting-recordings-in-microsoft-teams' },
          { label: 'Microsoft Learn — opções e ciclo de vida de gravações', url: 'https://learn.microsoft.com/en-us/microsoftteams/manage-meeting-recording-options' }
        ] },
        { id: 'onenote', title: 'Anotações colaborativas', order: 3, content: 'Blocos do OneNote organizam conteúdo em seções e páginas. Quando armazenados em local compartilhado compatível, podem apoiar edição conjunta e sincronização, conforme as permissões atribuídas. A estrutura de anotações não é uma planilha, um protocolo de e-mail ou um sistema operacional.\n\nAo compartilhar um bloco, confirme quem tem acesso e se o vínculo é de leitura ou edição. Uma cópia local pode não refletir alterações de outras pessoas se não houver sincronização concluída.' }
      ]
    },
    {
      id: 'seguranca-digital', title: 'Segurança da informação', order: 9,
      summary: 'Reconheça ataques e combine autenticação, proteção de rede, atualizações e resposta a incidentes.',
      subtopics: [
        { id: 'phishing', title: 'Phishing e engenharia social', order: 1, content: 'Phishing usa mensagens ou páginas enganosas para levar alguém a revelar dados, instalar código ou executar uma ação. Pressão por resposta imediata, pedidos inesperados de informação e endereços encurtados ou parecidos com os legítimos são sinais de alerta. Boa ortografia não prova legitimidade, e erros de escrita não são requisito para que haja fraude.\n\nNão abra o link recebido para confirmar se ele é verdadeiro. Procure o site ou telefone oficial por outro caminho, reporte a mensagem conforme o procedimento aplicável e evite responder ou abrir anexos suspeitos.', references: [
          { label: 'CISA — reconhecer e reportar phishing (página educativa marcada como arquivada)', url: 'https://www.cisa.gov/secure-our-world/recognize-and-report-phishing' }
        ] },
        { id: 'controles-defesa', title: 'Malware, firewall e atualização', order: 2, content: 'Malware é software criado para realizar ações nocivas, como roubar dados, espionar, abrir acesso não autorizado ou interromper serviços. Vírus é uma categoria de malware; ransomware pode bloquear ou criptografar dados e exigir pagamento. Um antivírus pode detectar ou bloquear ameaças conhecidas, mas não elimina todos os riscos.\n\nFirewall aplica regras ao tráfego de rede. Atualizações corrigem vulnerabilidades e melhoram compatibilidade; atrasá-las pode deixar sistemas expostos. Firewall, antivírus, atualização, autenticação e orientação do usuário são controles diferentes e complementares, não substitutos uns dos outros.' },
        { id: 'autenticacao', title: 'Autenticação multifator', order: 3, content: 'Autenticação verifica se uma pessoa ou sistema corresponde à identidade alegada. MFA pede evidências de mais de uma categoria, como algo que se sabe (senha), algo que se possui (dispositivo ou chave) ou algo que se é (biometria). Duas senhas continuam sendo fatores da mesma categoria.\n\nUm código adicional pode dificultar o uso de uma senha roubada, embora métodos de MFA variem em resistência a phishing. Ative MFA em contas importantes e proteja os métodos de recuperação. Nunca aprove uma solicitação que você não iniciou.', references: [
          { label: 'CISA — ativar MFA (página educativa marcada como arquivada)', url: 'https://www.cisa.gov/secure-our-world/turn-mfa' }
        ] },
        { id: 'criptografia-integridade', title: 'Criptografia, hash e integridade', order: 4, content: 'Criptografia usa uma chave para tornar dados ilegíveis a quem não tem autorização; conforme o método, uma chave relacionada permite decifrar. A gestão de chaves é parte essencial da proteção. HTTPS usa TLS para proteger o canal e autenticar o servidor segundo certificados e regras do protocolo, mas não certifica a honestidade do conteúdo publicado.\n\nHash criptográfico produz um resumo de tamanho definido e é projetado para ser impraticável de inverter. Comparar resumos pode ajudar a detectar alterações se o valor de referência for confiável. Hash não é o mesmo que criptografia reversível, nem garante sozinho que um arquivo seja benigno.' }
      ]
    },
    {
      id: 'backup-recuperacao', title: 'Backup e recuperação', order: 10,
      summary: 'Planeje cópias independentes, proteja uma cópia contra alteração e teste a restauração.',
      subtopics: [
        { id: 'estrategia-321', title: 'Cópias e estratégia 3-2-1', order: 1, content: 'Uma regra prática comum propõe manter três cópias dos dados, em dois tipos de mídia, com uma cópia fora do local principal. Ela reduz alguns riscos de perda por falha de equipamento ou incidente local, mas não garante recuperação se todas as cópias forem acessíveis ao mesmo ataque.\n\nMantenha cópias críticas offline ou com proteção contra alteração, controle quem pode apagá-las e teste restaurações. A cópia só é útil se os dados puderem ser recuperados dentro do prazo e da prioridade necessários. A CISA recomenda backups offline e criptografados e testes regulares de disponibilidade e integridade.', references: [
          { label: 'CISA — StopRansomware Guide: backups e recuperação', url: 'https://www.cisa.gov/stopransomware/ransomware-guide' }
        ] },
        { id: 'sincronizacao-backup', title: 'Sincronização não é backup', order: 2, content: 'Sincronização replica alterações entre locais; uma exclusão acidental pode ser propagada. Backup cria cópias destinadas à recuperação, de preferência com versões, retenção e isolamento adequados. Lixeira e histórico de versões ajudam em alguns serviços, mas dependem de configuração e prazo de retenção.\n\nTeste periodicamente o procedimento de restauração e proteja as credenciais do serviço de backup. Uma estratégia deve considerar erro humano, falha de hardware, ransomware, perda de acesso à conta e desastre no local principal.' }
      ]
    }
  ],
  questions: bank.questions,
  reviewCount: bank.metrics.needsReviewQuestions,
  questionAudit: bank.metrics,
  sourceInventory: bank.sourceInventory,
};

export default subject;
