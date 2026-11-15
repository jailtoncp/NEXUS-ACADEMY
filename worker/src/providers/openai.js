export class ProviderError extends Error {
  constructor(status, retryAfter = null) {
    super('O provedor de IA retornou uma resposta não bem-sucedida.');
    this.name = 'ProviderError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export async function requestOpenAIChat({ apiKey, model, messages, fetchImpl = fetch }) {
  const response = await fetchImpl('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_completion_tokens: 600,
    }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new ProviderError(response.status, response.headers.get('retry-after'));
  }

  const payload = await response.json();
  const answer = payload?.choices?.[0]?.message?.content;
  if (typeof answer !== 'string' || !answer.trim()) {
    throw new ProviderError(502);
  }

  return answer.trim();
}
