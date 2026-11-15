# NEXUS TEACHER — API e configuração

## Arquitetura

O site continua estático no GitHub Pages. O React envia somente a pergunta, as mensagens recentes da conversa e a teoria do assunto atual para `POST /api/teacher` no Cloudflare Worker. O Worker valida os dados, aplica rate limit e chama o adaptador OpenAI. A chave `OPENAI_API_KEY` existe somente como Secret do Worker; a URL pública do Worker não é uma credencial.

O modelo inicial é `gpt-5.4-mini`. O adaptador está isolado em `src/providers/openai.js`, permitindo substituir o provedor sem expor chaves ao navegador. O Worker não grava perguntas, respostas ou teoria em armazenamento próprio e não escreve payloads em logs. O React mantém as mensagens apenas na memória da sessão, separadas por disciplina e assunto; ao recarregar a página, elas desaparecem.

O controle inicial limita cada IP a 8 solicitações por 60 segundos por localidade Cloudflare. O limite nativo é aproximado e local por região, não um limite global rigoroso. Como esta etapa não inclui contas/login, CORS e rate limit reduzem uso casual indevido, mas não equivalem a autenticação. O endpoint também limita tamanho de mensagens, contexto e resposta. Configure alertas/limites de gastos no projeto da OpenAI antes de ativar o serviço.

## Configuração para ativar a IA

1. Crie ou use uma conta Cloudflare Workers. O workflow do Worker é manual e não altera o workflow existente de GitHub Pages.
2. Em `Settings → Secrets and variables → Actions` no repositório, configure os **Secrets** `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN`. Crie um token restrito à conta que hospedará o Worker, com a permissão de edição de Workers. Não use um token global da conta.
3. Depois de integrar esta branch em `main`, execute manualmente `Deploy NEXUS TEACHER API` em GitHub Actions. O Worker responde em `https://nexus-teacher-api.<subdominio-workers>.workers.dev`.
4. No painel Cloudflare, abra `Workers & Pages → nexus-teacher-api → Settings → Variables and Secrets` e adicione `OPENAI_API_KEY` como **Secret**. Crie essa chave no projeto de API da OpenAI e configure lá um limite/alerta de gastos. Não cole a chave no chat, em `VITE_*`, em arquivo versionado ou no código do navegador.
5. Em `Settings → Secrets and variables → Actions → Variables`, configure `VITE_TEACHER_API_URL` com a URL base HTTPS do Worker, sem `/api/teacher`.
6. Execute manualmente o workflow `Deploy NEXUS ACADEMY` para reconstruir o site publicado. Esse é o workflow atual do Pages; seu destino e seu gatilho `main` não foram substituídos. Uma ausência da variável deixa o chat em estado “integração não configurada”, sem respostas simuladas.

O `ALLOWED_ORIGINS` em `wrangler.toml` está limitado ao host publicado atual (`https://jailtoncp.github.io`). Se o domínio público mudar, atualize esse valor para a **origem** exata do site (sem caminho, como `/NEXUS-ACADEMY/`) e faça novo deploy do Worker. Para testar localmente, adicione temporariamente `http://localhost:5173` ao allowlist do Worker de desenvolvimento; não amplie a origem de produção com curingas.

## Custos e limites

O Cloudflare Workers Free informa 100.000 solicitações por dia sem cobrança de duração; os limites e condições podem mudar. Rate Limiting usa contadores aproximados por localidade, então não deve ser tratado como proteção rígida de orçamento. O Worker não requer banco ou persistência adicional.

Na tabela oficial consultada em 15/11/2026, GPT-5.4 Mini custa US$ 0,75 por 1 milhão de tokens de entrada e US$ 4,50 por 1 milhão de tokens de saída. Para uma estimativa conservadora de 8.000 tokens de entrada e o teto de 600 tokens de saída por pergunta, isso equivale a aproximadamente US$ 0,0087 por chamada; 100 chamadas custariam cerca de US$ 0,87 e 1.000, cerca de US$ 8,70. O custo real depende da tokenização, do contexto e das mensagens anteriores enviadas novamente em cada chamada. Não inclui tributos ou mudanças futuras de preço.

A mensagem do aluno e a teoria do assunto são transmitidas ao provedor de IA para produzir a resposta. O aplicativo não as mantém após a sessão, mas a retenção e o tratamento no provedor seguem as configurações e os termos da conta de API utilizada.

## Desenvolvimento e validação

Na raiz do repositório:

```bash
npm ci
npm run build
node --test worker/test/*.test.js
```

Os testes do Worker usam uma resposta substituta somente para testar o contrato HTTP e o tratamento de erros; o código do produto não contém respostas simuladas. Um teste de resposta real só é possível após publicar o Worker e instalar `OPENAI_API_KEY` como Secret no Cloudflare.

## Fontes oficiais

- [Cloudflare Workers — Rate Limiting API](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Cloudflare Workers — Preços](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare Workers — Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare — GitHub Actions para Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [OpenAI API — GPT-5.4 Mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
- [OpenAI API — preços](https://developers.openai.com/api/docs/pricing)
