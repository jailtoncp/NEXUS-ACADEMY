# Avaliação do protótipo local do NEXUS TEACHER

**Data:** 17 de novembro de 2026
**Status:** protótipo experimental, opt-in e não publicado.

## Resumo executivo

O protótipo executa um modelo ONNX diretamente no navegador, sem chave de API e sem cobrança por token. O candidato é o Qwen3 0.6B quantizado. As variantes de pesos têm aproximadamente **570 MB (`q4f16`)** para WebGPU e **618 MB (`q8`)** para CPU/WASM, além do runtime ONNX e dos arquivos auxiliares. [5] O browser pode manter os pesos em cache, mas pode removê-los.

No Chromium headless usado nesta avaliação, o adaptador SwiftShader não oferece `shader-f16`: o arquivo WebGPU carregou, mas a primeira geração falhou. O código foi ajustado para só habilitar WebGPU se esse recurso estiver presente. O fallback CPU/WASM carregou e manteve a interface responsiva graças ao proxy Worker, mas **não respondeu à pergunta de teste em 240 segundos**. Logo, a arquitetura local é tecnicamente possível, mas esta avaliação não sustenta substituir o chat atual. A compatibilidade e a velocidade em um computador Windows com GPU real ainda precisam ser verificadas.

Nenhum serviço pago foi contratado ou configurado; nenhuma chave de API foi adicionada. O chat padrão permanece como caminho normal, e o protótipo local só é ativado pelo parâmetro de URL `?nexusTeacherPrototype=local`.

## Arquitetura implementada

O componente experimental usa `@huggingface/transformers` 4.3.2, Transformers.js e ONNX Runtime Web com o checkpoint `onnx-community/Qwen3-0.6B-ONNX`, fixado na revisão `58ca03a5e7b354b480b1a82b34bde8dc7b854cc0`. O cartão do checkpoint fornece exemplo de geração conversacional no browser com `device: "webgpu"` e `dtype: "q4f16"`; a biblioteca também documenta quantização `q8` e `TextStreamer`. [1] [2] [3]

O protótipo é carregado sob demanda e oferece dois backends: WebGPU + `q4f16`, ou CPU/WASM + `q8`. Antes de ativar o primeiro, verifica se o adaptador tem a feature `shader-f16`, requerida pelo caminho testado. Se não tiver, escolhe CPU/WASM. No fallback WASM, `env.backends.onnx.wasm.proxy` é ligado para transferir a inferência a um Web Worker e evitar bloquear a interface. [10]

A teoria do assunto selecionado e até seis mensagens recentes alimentam o prompt; pergunta, mensagens e respostas vivem apenas no estado React em memória e não são gravadas no histórico persistente do aplicativo. A geração usa `/no_think` e parâmetros recomendados pelo cartão oficial do Qwen3 para resposta sem thinking. [9]

Os pesos e ativos necessários ao runtime são baixados sob demanda. A configuração do Transformers.js usa o cache do navegador, que pode ser limpo ou despejado pelo próprio navegador. [6] O modelo base informa licença Apache-2.0; a licença e os termos do checkpoint devem ser revistos antes de qualquer distribuição pública. [4]

O componente local é carregado por import dinâmico apenas quando a URL opt-in é usada; o runtime Transformers.js só é importado após clicar para carregar o modelo. O service worker existente não foi alterado: seu precache cobre o shell e os JS/CSS referenciados pelo HTML, enquanto ativos de mesma origem podem ser guardados quando solicitados pela primeira vez. Assim, os pesos externos não são acrescentados ao shell inicial do PWA.

## Ambiente e medições

Teste em **Linux x86_64 de sandbox**, AMD EPYC com 6 vCPUs e 24 GB de RAM disponibilizados ao ambiente, **Chromium 156 headless**, origem `localhost` segura e SwiftShader como implementação gráfica de software. Isso não representa uma GPU física nem o computador Windows do usuário. A documentação confirma que WebGPU depende de contexto seguro, navegador, adaptador, hardware e driver; Chrome/Edge no Windows podem usar D3D12, mas a compatibilidade real é específica do dispositivo. [7] [8]

| Caminho | Download nominal dos pesos | Inicialização observada | Resultado da pergunta curta |
|---|---:|---:|---|
| WebGPU `q4f16` | 569,8 MB | 13,1 s | Falhou na primeira inferência: o shader de `Gather` exigia `f16`, não suportado pelo adaptador SwiftShader. Nenhuma resposta foi produzida. |
| CPU/WASM `q8` | 617,7 MB | 15,9 s | “Em uma frase, o que é a CPU?” continuava sem resposta após 240 s; o chat permanecia no estado de geração, sem mensagem de erro ou resposta. |

No teste WebGPU, `navigator.gpu` e um adaptador estavam presentes, mas `adapter.features.has('shader-f16')` era falso; `adapter.info` não forneceu detalhes. O erro de execução confirmou a incompatibilidade. Por isso o código não oferece mais esse adaptador como opção para `q4f16` e cai automaticamente para CPU/WASM.

No teste CPU/WASM com proxy, avaliações do DOM via DevTools continuaram respondendo durante a janela de 240 s, embora o modelo não terminasse. A contagem de recursos do browser ficou em 51 antes e depois de enviar a pergunta; os hosts externos observados foram `huggingface.co` e os domínios de fontes Google. Não houve novo recurso de rede durante a geração nem endpoint de inferência observado. Os pesos/runtime são baixados antes do envio da pergunta; o código do modo local não contém fallback para API.

Uma tentativa CPU/WASM anterior, sem o proxy, também não respondeu e deixou o renderer pouco responsivo; foi interrompida. O proxy resolveu a responsividade observável da interface, mas não tornou a geração rápida neste ambiente. Não foi possível medir tokens/s ou qualidade da resposta porque a geração CPU/WASM não terminou e a WebGPU falhou.

## Custo, limitações e compatibilidade

- **Custo de inferência:** não há tarifa por token nem conta de provedor de IA. O usuário paga indiretamente com banda, armazenamento/cache, CPU/GPU, memória, bateria e tempo de espera do dispositivo.
- **Primeiro carregamento:** somente os pesos são de aproximadamente 0,57–0,62 GB. O build inclui ainda o WASM do runtime (26,9 MB sem compressão, 6,8 MB gzip) e chunks JS do Transformers.js; outros arquivos de tokenizer e metadados podem acrescentar tráfego. O navegador pode reutilizar o cache, mas isso não é garantido.
- **WebGPU:** `navigator.gpu` não basta. O adaptador precisa executar o checkpoint `q4f16`, inclusive oferecer `shader-f16`; memória, driver e suporte do navegador também importam. O teste headless usou SwiftShader, portanto não mede a velocidade de GPU real.
- **CPU/WASM:** o fallback torna a tela consultável durante o cálculo, mas exceder quatro minutos sem resposta nesta máquina é incompatível com uma experiência normal de tutor. O resultado pode mudar bastante em outro hardware; não foi testado em Windows.
- **Qualidade didática:** Qwen3 0.6B declara suporte multilíngue e contexto de 32.768 tokens, mas o tamanho do modelo não garante precisão em português ou aderência às questões do NEXUS. Como não houve resposta concluída, a qualidade ainda não foi avaliada. [4]

## Recomendação

**Não substituir nem remover o chat atual ainda.** Manter o modo local experimental e opt-in. O próximo teste decisivo deve ocorrer em Chrome ou Edge no computador Windows real, com aceleração gráfica ativa: confirmar se a feature `shader-f16` aparece, medir tempo de primeiro token, tokens/s, uso de RAM/VRAM, temperatura/bateria e validar uma bateria de perguntas representativas contra a teoria. Se o dispositivo cair para CPU/WASM, testar versões menores/quantizações alternativas ou rever o orçamento de contexto antes de considerar o fluxo utilizável.

## Validação e escopo

- `npm run build`: concluído; Vite reporta o chunk principal `index` de 2,82 MB (543 kB gzip), acima do aviso padrão de 500 kB. O protótipo e Transformers.js são separados em chunks dinâmicos; o WASM do runtime é um ativo adicional.
- Instalação limpa com `npx --yes npm@12.2.2 ci`: concluída.
- `node --test worker/test/*.test.js`: **11 testes aprovados**, 0 falhas.
- O projeto fixa `npm@12.2.2` e nega os scripts de instalação de `onnxruntime-node` e `protobufjs`; o workflow Pages agora instala esse npm em Node 22 para respeitar a política `allowScripts`. Os gatilhos e o destino de publicação não foram alterados. [11] [12]
- `git diff --check`: sem problemas de whitespace.
- Não houve deploy, merge, commit, push, configuração de API paga ou alteração de chave/segredo. O trabalho permanece na branch local `feat/nexus-teacher-local-prototype` do repositório existente.
- Não foram alterados bancos de questões, histórico persistente, pesquisa, service worker/PWA ou publicação principal. O arquivo temporário `public/manus-routes.json` foi removido.

## Fontes

[1]: https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX "Checkpoint ONNX Qwen3 0.6B e exemplo oficial Transformers.js"
[2]: https://huggingface.co/docs/transformers.js/en/pipelines "Transformers.js pipelines e geração de texto"
[3]: https://huggingface.co/docs/transformers.js/en/guides/dtypes "Transformers.js quantização e dtypes"
[4]: https://huggingface.co/Qwen/Qwen3-0.6B "Cartão do modelo base Qwen3 0.6B"
[5]: https://huggingface.co/api/models/onnx-community/Qwen3-0.6B-ONNX "Metadados e tamanhos dos arquivos ONNX no Hugging Face Hub"
[6]: https://huggingface.co/docs/transformers.js/en/api/env "Transformers.js env e Cache API no navegador"
[7]: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API "MDN WebGPU API: contexto seguro e solicitação de adaptador"
[8]: https://web.dev/blog/webgpu-supported-major-browsers "Suporte WebGPU por navegador e sistema operacional"
[9]: https://huggingface.co/Qwen/Qwen3-0.6B "Cartão oficial Qwen3: alternância de thinking e parâmetros"
[10]: https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html "ONNX Runtime Web: proxy WASM e restrições"
[11]: https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts/ "npm 11: allowScripts ainda consultivo"
[12]: https://docs.npmjs.com/cli/v12/commands/npm-install-scripts/ "npm 12: revisão e bloqueio de install scripts"
