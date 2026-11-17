import React, { useEffect, useRef, useState } from 'react';
import { Bot, Cpu, LoaderCircle, RotateCcw, Send, ShieldCheck, UserRound, Zap } from 'lucide-react';
import './teacher-chat.css';
import './teacher-local-prototype.css';

const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';
const MODEL_REVISION = '58ca03a5e7b354b480b1a82b34bde8dc7b854cc0';
const MODEL_SIZES = { webgpu: 569_789_750, wasm: 617_687_478 };
const MAX_QUESTION_CHARS = 1_200;
const MAX_CONTEXT_CHARS = 10_000;
const MAX_HISTORY_MESSAGES = 6;
const MAX_NEW_TOKENS = 192;

function createMessage(role, content) {
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, role, content };
}

function buildTheoryContext(subject, topic) {
  const lessons = topic.subtopics
    .map((subtopic) => `${subtopic.title}\n${subtopic.content}`)
    .join('\n\n');
  const context = [
    `Disciplina: ${subject.name}`,
    `Assunto: ${topic.title}`,
    topic.summary ? `Resumo: ${topic.summary}` : '',
    lessons ? `Teoria disponível:\n${lessons}` : '',
  ].filter(Boolean).join('\n\n');
  return context.slice(0, MAX_CONTEXT_CHARS);
}

function getAssistantText(result) {
  const generated = result?.[0]?.generated_text;
  if (Array.isArray(generated)) return generated.at(-1)?.content || '';
  return typeof generated === 'string' ? generated : '';
}

function cleanAssistantText(text) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .replace(/<\/?think>/gi, '')
    .trim();
}

function formatBytes(value) {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return `${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}

function safeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error || 'erro desconhecido');
  return message.replace(/\s+/g, ' ').slice(0, 260);
}

export default function TeacherLocalPrototype({ subject, topic }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [engine, setEngine] = useState('webgpu');
  const [gpu, setGpu] = useState({ checked: false, available: false, message: 'Verificando suporte a WebGPU…' });
  const [modelStatus, setModelStatus] = useState('idle');
  const [progress, setProgress] = useState(null);
  const [loadMs, setLoadMs] = useState(null);
  const [generationStats, setGenerationStats] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const generatorRef = useRef(null);
  const logRef = useRef(null);
  const mountedRef = useRef(false);
  const theoryContext = buildTheoryContext(subject, topic);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function detectWebGpu() {
      if (!window.isSecureContext) {
        if (!cancelled) {
          setGpu({ checked: true, available: false, message: 'WebGPU exige um contexto seguro HTTPS ou localhost.' });
          setEngine('wasm');
        }
        return;
      }
      if (!('gpu' in navigator)) {
        if (!cancelled) {
          setGpu({ checked: true, available: false, message: 'Este navegador não expõe navigator.gpu; use CPU/WASM.' });
          setEngine('wasm');
        }
        return;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (cancelled) return;
        const supportsF16 = Boolean(adapter?.features?.has?.('shader-f16'));
        const available = Boolean(adapter && supportsF16);
        setGpu({
          checked: true,
          available,
          message: available
            ? 'Adaptador WebGPU com shader-f16 detectado. A carga real ainda pode depender de memória e suporte do driver.'
            : adapter
              ? 'Adaptador WebGPU encontrado, mas sem shader-f16 exigido pelo checkpoint q4f16; use CPU/WASM.'
              : 'A API WebGPU existe, mas não encontrou um adaptador utilizável; use CPU/WASM.',
        });
        setEngine(available ? 'webgpu' : 'wasm');
      } catch {
        if (!cancelled) {
          setGpu({ checked: true, available: false, message: 'Não foi possível obter um adaptador WebGPU; use CPU/WASM.' });
          setEngine('wasm');
        }
      }
    }

    detectWebGpu();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, isGenerating]);

  async function loadModel() {
    if (modelStatus === 'loading' || modelStatus === 'ready') return;
    if (engine === 'webgpu' && !gpu.available) {
      setError('WebGPU não está disponível neste navegador. Selecione CPU/WASM para continuar sem serviço externo de IA.');
      return;
    }

    setError('');
    setProgress(null);
    setLoadMs(null);
    setModelStatus('loading');
    const startedAt = performance.now();

    try {
      const { env, pipeline } = await import('@huggingface/transformers');
      env.useBrowserCache = true;
      env.useWasmCache = true;
      env.backends.onnx.wasm.proxy = engine === 'wasm';

      const options = {
        dtype: engine === 'webgpu' ? 'q4f16' : 'q8',
        revision: MODEL_REVISION,
        progress_callback: (item) => {
          if (!mountedRef.current) return;
          const total = Number(item?.total) || 0;
          const loaded = Number(item?.loaded) || 0;
          const ratio = Number(item?.progress);
          setProgress({
            file: typeof item?.file === 'string' ? item.file.split('/').at(-1) : '',
            percent: Number.isFinite(ratio) ? Math.max(0, Math.min(100, Math.round(ratio * 100))) : null,
            loaded,
            total,
          });
        },
      };
      if (engine === 'webgpu') options.device = 'webgpu';

      const generator = await pipeline('text-generation', MODEL_ID, options);
      if (!mountedRef.current) return;
      generatorRef.current = generator;
      setLoadMs(performance.now() - startedAt);
      setModelStatus('ready');
      setProgress(null);
    } catch (loadError) {
      if (!mountedRef.current) return;
      setModelStatus('error');
      setError(`Não foi possível carregar o modelo local: ${safeErrorMessage(loadError)}. Nenhuma API alternativa será chamada.`);
    }
  }

  async function sendQuestion(event) {
    event.preventDefault();
    const currentQuestion = question.trim();
    const generator = generatorRef.current;
    if (!generator || !currentQuestion || isGenerating || currentQuestion.length > MAX_QUESTION_CHARS) return;

    const userMessage = createMessage('user', currentQuestion);
    const priorMessages = messages.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({ role, content }));
    const modelMessages = [
      {
        role: 'system',
        content: [
          'Você é o NEXUS TEACHER, professor auxiliar do NEXUS ACADEMY. Responda sempre em português brasileiro, com clareza e didática.',
          'Use a teoria fornecida como fonte principal. Não invente informações nem finja que algo está no material. Se a teoria não bastar, diga isso e delimite o que consegue responder.',
          'Explique o conceito e, quando ajudar, use um exemplo curto. Não revele raciocínio interno; entregue apenas a resposta pedagógica final.',
          `\nCONTEXTO DA DISCIPLINA:\n${theoryContext}`,
        ].join('\n'),
      },
      ...priorMessages,
      { role: 'user', content: `${currentQuestion}\n/no_think` },
    ];

    setQuestion('');
    setError('');
    setGenerationStats(null);
    setIsGenerating(true);
    setMessages([...messages, userMessage]);
    const startedAt = performance.now();
    let firstTextAt = null;
    let generatedTokens = 0;

    try {
      const { TextStreamer } = await import('@huggingface/transformers');
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text) => {
          if (text && text.trim() && firstTextAt === null) firstTextAt = performance.now();
        },
        token_callback_function: (tokens) => {
          generatedTokens += Array.isArray(tokens) ? tokens.length : 1;
        },
      });
      const result = await generator(modelMessages, {
        max_new_tokens: MAX_NEW_TOKENS,
        do_sample: true,
        temperature: 0.7,
        top_p: 0.8,
        top_k: 20,
        presence_penalty: 1.5,
        streamer,
      });
      if (!mountedRef.current) return;
      const reply = cleanAssistantText(getAssistantText(result));
      if (!reply) throw new Error('o modelo encerrou sem produzir uma resposta visível');

      const elapsedMs = performance.now() - startedAt;
      setMessages([...messages, userMessage, createMessage('assistant', reply)]);
      setGenerationStats({
        elapsedMs,
        firstTextMs: firstTextAt === null ? null : firstTextAt - startedAt,
        tokensPerSecond: generatedTokens > 0 ? generatedTokens / (elapsedMs / 1000) : null,
        generatedTokens,
      });
    } catch (generationError) {
      if (!mountedRef.current) return;
      setMessages(messages);
      setQuestion(currentQuestion);
      setError(`A geração local falhou: ${safeErrorMessage(generationError)}. A pergunta não foi enviada a uma API externa.`);
    } finally {
      if (mountedRef.current) setIsGenerating(false);
    }
  }

  function clearConversation() {
    if (isGenerating) return;
    setMessages([]);
    setError('');
    setQuestion('');
    setGenerationStats(null);
  }

  const chosenSize = MODEL_SIZES[engine];
  const loadButtonLabel = modelStatus === 'ready'
    ? 'Modelo carregado neste navegador'
    : modelStatus === 'loading'
      ? 'Carregando pesos ONNX…'
      : modelStatus === 'error'
        ? 'Tentar carregar novamente'
        : 'Baixar e carregar modelo';

  return (
    <section className="teacher-chat teacher-local-chat" aria-labelledby={`teacher-local-title-${subject.id}-${topic.id}`}>
      <div className="teacher-chat-head">
        <div className="teacher-chat-brand">
          <div className="teacher-chat-icon" aria-hidden="true"><Cpu /></div>
          <div className="teacher-chat-copy">
            <span className="teacher-chat-kicker">NEXUS TEACHER · PROTÓTIPO LOCAL</span>
            <h3 id={`teacher-local-title-${subject.id}-${topic.id}`}>Professor virtual no dispositivo</h3>
            <p>Qwen3 0.6B em ONNX via Transformers.js. Este modo experimental não substitui o chat padrão.</p>
          </div>
        </div>
        <button className="teacher-chat-reset" type="button" onClick={clearConversation} disabled={!messages.length || isGenerating} aria-label="Limpar conversa local">
          <RotateCcw /><span>Reiniciar</span>
        </button>
      </div>

      <div className="teacher-local-model-panel">
        <div className="teacher-local-device-status" role="status">
          <Zap aria-hidden="true" />
          <span>{gpu.message}</span>
        </div>

        <div className="teacher-local-engine-options" role="group" aria-label="Modo de execução">
          <button
            className={engine === 'webgpu' ? 'teacher-local-engine selected' : 'teacher-local-engine'}
            type="button"
            onClick={() => setEngine('webgpu')}
            disabled={!gpu.checked || !gpu.available || modelStatus === 'loading' || modelStatus === 'ready'}
            aria-pressed={engine === 'webgpu'}
          >
            <b>WebGPU · q4f16</b><span>≈ 570 MB</span>
          </button>
          <button
            className={engine === 'wasm' ? 'teacher-local-engine selected' : 'teacher-local-engine'}
            type="button"
            onClick={() => setEngine('wasm')}
            disabled={!gpu.checked || modelStatus === 'loading' || modelStatus === 'ready'}
            aria-pressed={engine === 'wasm'}
          >
            <b>CPU/WASM · q8</b><span>≈ 618 MB</span>
          </button>
        </div>

        <p className="teacher-local-privacy"><ShieldCheck aria-hidden="true" /> Pergunta, teoria e resposta são processadas localmente. Só os pesos do modelo são baixados do Hugging Face; o navegador pode mantê-los no cache e removê-los depois. A conversa não é salva. Não há fallback para API.</p>

        <button
          className="teacher-local-load"
          type="button"
          onClick={loadModel}
          disabled={modelStatus === 'loading' || modelStatus === 'ready' || !gpu.checked}
        >
          {modelStatus === 'loading' ? <LoaderCircle className="teacher-spin" /> : <DownloadIcon />}
          {loadButtonLabel}
        </button>

        {modelStatus === 'loading' && (
          <div className="teacher-local-download-progress" role="status" aria-live="polite">
            <span>{progress?.file ? `Arquivo: ${progress.file}` : 'Baixando e preparando o runtime local…'}</span>
            {progress?.percent !== null && progress?.percent !== undefined && (
              <span>{progress.percent}%{progress.total ? ` · ${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}` : ''}</span>
            )}
            <div className="teacher-local-progress-track"><i style={{ width: `${progress?.percent ?? 8}%` }} /></div>
          </div>
        )}

        {modelStatus === 'ready' && (
          <div className="teacher-local-runtime-metrics" role="status">
            <span><b>Backend:</b> {engine === 'webgpu' ? 'WebGPU · q4f16' : 'CPU/WASM · q8'}</span>
            <span><b>Inicialização:</b> {loadMs === null ? '—' : `${(loadMs / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} s`}</span>
            <span><b>Download nominal:</b> {formatBytes(chosenSize)}</span>
          </div>
        )}
      </div>

      <div className="teacher-chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text" aria-label={`Conversa local sobre ${topic.title}`}>
        {messages.length === 0 && !isGenerating && (
          <div className="teacher-chat-empty"><Bot aria-hidden="true" /><span>{modelStatus === 'ready' ? <>Faça uma pergunta sobre <b>{topic.title}</b>. O modelo receberá a teoria deste assunto como contexto.</> : 'Carregue o modelo acima para iniciar uma conversa local. A primeira carga depende da conexão e pode demorar.'}</span></div>
        )}
        {messages.map((message) => (
          <div className={`teacher-message ${message.role === 'user' ? 'user' : 'assistant'}`} key={message.id}>
            <div className="teacher-message-icon" aria-hidden="true">{message.role === 'user' ? <UserRound /> : <Bot />}</div>
            <div className="teacher-message-body">{message.content}</div>
          </div>
        ))}
        {isGenerating && <div className="teacher-chat-processing" role="status"><LoaderCircle /> Gerando no dispositivo; a velocidade depende do hardware local…</div>}
      </div>

      {error && <p className="teacher-chat-error" role="alert">{error}</p>}

      {generationStats && (
        <div className="teacher-local-runtime-metrics teacher-local-generation-metrics" aria-label="Métricas da última resposta">
          <span><b>Geração:</b> {(generationStats.elapsedMs / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} s</span>
          <span><b>1º texto:</b> {generationStats.firstTextMs === null ? '—' : `${(generationStats.firstTextMs / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} s`}</span>
          <span><b>Tokens/s:</b> {generationStats.tokensPerSecond === null ? '—' : generationStats.tokensPerSecond.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</span>
          <span><b>Tokens gerados:</b> {generationStats.generatedTokens || '—'}</span>
        </div>
      )}

      <form className="teacher-chat-form" onSubmit={sendQuestion}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value.slice(0, MAX_QUESTION_CHARS))}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder={`Pergunte sobre ${topic.title}…`}
          aria-label={`Pergunta local sobre ${topic.title}`}
          maxLength={MAX_QUESTION_CHARS}
          rows={2}
          disabled={modelStatus !== 'ready' || isGenerating}
        />
        <button className="teacher-chat-send" type="submit" aria-label="Enviar pergunta para o modelo local" disabled={modelStatus !== 'ready' || !question.trim() || isGenerating}>
          {isGenerating ? <LoaderCircle className="teacher-spin" /> : <Send />}
        </button>
      </form>
      <div className="teacher-chat-foot"><span>Modelo: <a href="https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX" target="_blank" rel="noreferrer">Qwen3 0.6B ONNX</a> · licença base Apache-2.0 · inferência local</span><span className="teacher-chat-count">{question.length}/{MAX_QUESTION_CHARS}</span></div>
    </section>
  );
}

function DownloadIcon() {
  return <span className="teacher-local-download-mark" aria-hidden="true">↓</span>;
}
