import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { handleRequest } from '../src/index.js';

const allowedOrigin = 'https://jailtoncp.github.io';
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function testEnv(overrides = {}) {
  return {
    ALLOWED_ORIGINS: allowedOrigin,
    OPENAI_API_KEY: 'test-only-not-a-real-key',
    OPENAI_MODEL: 'gpt-5.4-mini',
    TEACHER_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides,
  };
}

function validPayload(overrides = {}) {
  return {
    context: {
      discipline: 'Informática',
      topic: 'Fundamentos e componentes',
      summary: 'Hardware, software e memória.',
      lessons: [{ title: 'Hardware e software', content: 'Hardware é a parte física; software é a parte lógica.' }],
    },
    history: [{ role: 'user', content: 'Pode explicar com exemplo?' }, { role: 'assistant', content: 'Claro, usando o material do assunto.' }],
    question: 'Qual é a diferença entre hardware e software?',
    ...overrides,
  };
}

function postRequest(body, { origin = allowedOrigin, headers = {} } = {}) {
  return new Request('https://nexus-teacher-api.example.workers.dev/api/teacher', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.5', ...headers },
    body: JSON.stringify(body),
  });
}

test('health não expõe configuração ou credenciais', async () => {
  const response = await handleRequest(new Request('https://worker.example/health'), testEnv());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: 'nexus-teacher-api' });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('preflight CORS aceita somente a origem permitida', async () => {
  const allowed = await handleRequest(new Request('https://worker.example/api/teacher', {
    method: 'OPTIONS', headers: { Origin: allowedOrigin },
  }), testEnv());
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), allowedOrigin);

  const denied = await handleRequest(new Request('https://worker.example/api/teacher', {
    method: 'OPTIONS', headers: { Origin: 'https://evil.example' },
  }), testEnv());
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get('Access-Control-Allow-Origin'), null);
});

test('bloqueia POST sem origem autorizada', async () => {
  const response = await handleRequest(postRequest(validPayload(), { origin: 'https://evil.example' }), testEnv());
  assert.equal(response.status, 403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
});

test('aplica rate limit antes de chamar o provedor', async () => {
  globalThis.fetch = async () => { throw new Error('o provedor não deveria ser chamado'); };
  const env = testEnv({ TEACHER_RATE_LIMITER: { limit: async () => ({ success: false }) } });
  const response = await handleRequest(postRequest(validPayload()), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
  assert.match((await response.json()).error, /limite temporário/i);
});

test('valida contexto e não chama a IA quando o conteúdo excede o limite', async () => {
  globalThis.fetch = async () => { throw new Error('o provedor não deveria ser chamado'); };
  const payload = validPayload({ context: {
    discipline: 'Informática', topic: 'Assunto', summary: '',
    lessons: [{ title: 'Teoria', content: 'x'.repeat(12_001) }],
  } });
  const response = await handleRequest(postRequest(payload), testEnv());
  assert.equal(response.status, 413);
  assert.match((await response.json()).error, /excede o limite/i);
});

test('retorna 503 quando o segredo do provedor não foi instalado', async () => {
  globalThis.fetch = async () => { throw new Error('o provedor não deveria ser chamado'); };
  const response = await handleRequest(postRequest(validPayload()), testEnv({ OPENAI_API_KEY: '' }));
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /ainda não foi configurado/i);
});

test('envia contexto do assunto e histórico ao adaptador e retorna a resposta real do provedor', async () => {
  let capturedUrl;
  let capturedOptions;
  globalThis.fetch = async (url, options) => {
    capturedUrl = url;
    capturedOptions = options;
    return new Response(JSON.stringify({ choices: [{ message: { content: 'Hardware é o componente físico; software é o conjunto de instruções e programas.' } }] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const response = await handleRequest(postRequest(validPayload()), testEnv());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), allowedOrigin);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { reply: 'Hardware é o componente físico; software é o conjunto de instruções e programas.' });
  assert.equal(capturedUrl, 'https://api.openai.com/v1/chat/completions');
  assert.equal(capturedOptions.headers.Authorization, 'Bearer test-only-not-a-real-key');

  const sent = JSON.parse(capturedOptions.body);
  assert.equal(sent.model, 'gpt-5.4-mini');
  assert.equal(sent.max_completion_tokens, 600);
  assert.equal(sent.messages[0].role, 'system');
  assert.match(sent.messages[1].content, /Disciplina: Informática/);
  assert.match(sent.messages[1].content, /Fundamentos e componentes/);
  assert.equal(sent.messages.at(-1).content, 'Qual é a diferença entre hardware e software?');
  assert.deepEqual(sent.messages.slice(2, -1).map((message) => message.role), ['user', 'assistant']);
});

test('não revela erros internos do provedor', async () => {
  globalThis.fetch = async () => new Response('private provider details', { status: 401 });
  const response = await handleRequest(postRequest(validPayload()), testEnv());
  assert.equal(response.status, 503);
  const payload = await response.json();
  assert.doesNotMatch(JSON.stringify(payload), /private provider details|test-only-not-a-real-key/);
});

test('não permite rotas ou métodos não definidos', async () => {
  const missing = await handleRequest(new Request('https://worker.example/not-found'), testEnv());
  assert.equal(missing.status, 404);
  const method = await handleRequest(new Request('https://worker.example/api/teacher', {
    method: 'GET', headers: { Origin: allowedOrigin },
  }), testEnv());
  assert.equal(method.status, 405);
});

test('limita o tamanho acumulado das mensagens anteriores', async () => {
  globalThis.fetch = async () => { throw new Error('o provedor não deveria ser chamado'); };
  const history = Array.from({ length: 6 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: 'x'.repeat(3_000),
  }));
  const response = await handleRequest(postRequest(validPayload({ history })), testEnv());
  assert.equal(response.status, 413);
  assert.match((await response.json()).error, /histórico.*excede/i);
});

test('rejeita corpo sem Content-Type JSON antes de consumir limite ou chamar o provedor', async () => {
  let limiterCalls = 0;
  globalThis.fetch = async () => { throw new Error('o provedor não deveria ser chamado'); };
  const request = new Request('https://nexus-teacher-api.example.workers.dev/api/teacher', {
    method: 'POST',
    headers: { Origin: allowedOrigin, 'Content-Type': 'text/plain', 'CF-Connecting-IP': '203.0.113.5' },
    body: JSON.stringify(validPayload()),
  });
  const env = testEnv({ TEACHER_RATE_LIMITER: { limit: async () => { limiterCalls += 1; return { success: true }; } } });
  const response = await handleRequest(request, env);
  assert.equal(response.status, 415);
  assert.equal(limiterCalls, 0);
});
