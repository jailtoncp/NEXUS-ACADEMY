import React, { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, RotateCcw, Send, UserRound } from 'lucide-react';
import './teacher-chat.css';

const MAX_QUESTION_CHARS = 1_200;
const API_BASE = getTeacherApiBase(import.meta.env.VITE_TEACHER_API_URL, import.meta.env.DEV);

function getTeacherApiBase(value, isDevelopment) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    const isLocalHttp = isDevelopment && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !isLocalHttp) return '';
    if (url.pathname !== '/' || url.search || url.hash) return '';
    return url.origin;
  } catch {
    return '';
  }
}

function createMessage(role, content) {
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, role, content };
}

function getRecentHistory(messages) {
  const history = messages.slice(-8).map(({ role, content }) => ({ role, content }));
  const totalChars = () => history.reduce((total, message) => total + message.content.length, 0);
  while (history.length && totalChars() > 16_000) history.splice(0, Math.min(2, history.length));
  return history;
}

export default function TeacherChat({ subject, topic, messages, onMessagesChange }) {
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, isSending]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  async function sendQuestion(event) {
    event.preventDefault();
    const currentQuestion = question.trim();
    if (!API_BASE || !currentQuestion || isSending || currentQuestion.length > MAX_QUESTION_CHARS) return;

    const userMessage = createMessage('user', currentQuestion);
    const recentHistory = getRecentHistory(messages);
    setQuestion('');
    setError('');
    setIsSending(true);
    onMessagesChange([...messages, userMessage]);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE}/api/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            discipline: subject.name,
            topic: topic.title,
            summary: topic.summary || '',
            lessons: topic.subtopics.map((subtopic) => ({
              title: subtopic.title,
              content: subtopic.content,
            })),
          },
          history: recentHistory,
          question: currentQuestion,
        }),
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Não foi possível obter uma resposta agora.');
      }
      if (typeof payload.reply !== 'string' || !payload.reply.trim()) {
        throw new Error('O serviço não retornou uma resposta válida. Tente novamente.');
      }

      onMessagesChange([...messages, userMessage, createMessage('assistant', payload.reply.trim())]);
    } catch (sendError) {
      if (controller.signal.aborted) {
        onMessagesChange(messages);
        return;
      }
      onMessagesChange(messages);
      setQuestion(currentQuestion);
      setError(sendError instanceof Error && sendError.message
        ? sendError.message
        : 'Falha de conexão com o NEXUS TEACHER. Verifique a internet e tente novamente.');
    } finally {
      if (!controller.signal.aborted) setIsSending(false);
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }

  function clearConversation() {
    if (isSending) return;
    onMessagesChange([]);
    setError('');
    setQuestion('');
  }

  return (
    <section className="teacher-chat" aria-labelledby={`teacher-title-${subject.id}-${topic.id}`}>
      <div className="teacher-chat-head">
        <div className="teacher-chat-brand">
          <div className="teacher-chat-icon" aria-hidden="true"><Bot /></div>
          <div className="teacher-chat-copy">
            <span className="teacher-chat-kicker">NEXUS TEACHER</span>
            <h3 id={`teacher-title-${subject.id}-${topic.id}`}>Seu professor virtual</h3>
            <p>Ficou com alguma dúvida? Pergunte ao NEXUS TEACHER e aprofunde seu conhecimento sobre este assunto.</p>
          </div>
        </div>
        <button className="teacher-chat-reset" type="button" onClick={clearConversation} disabled={!messages.length || isSending} aria-label="Limpar conversa">
          <RotateCcw /><span>Reiniciar</span>
        </button>
      </div>

      <div className="teacher-chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text" aria-label={`Conversa sobre ${topic.title}`}>
        {messages.length === 0 && !isSending && (
          <div className="teacher-chat-empty"><Bot aria-hidden="true" /><span>Faça uma pergunta sobre <b>{topic.title}</b>. O assistente usará a teoria desta disciplina como contexto.</span></div>
        )}
        {messages.map((message) => (
          <div className={`teacher-message ${message.role === 'user' ? 'user' : 'assistant'}`} key={message.id}>
            <div className="teacher-message-icon" aria-hidden="true">{message.role === 'user' ? <UserRound /> : <Bot />}</div>
            <div className="teacher-message-body">{message.content}</div>
          </div>
        ))}
        {isSending && <div className="teacher-chat-processing" role="status"><LoaderCircle /> O NEXUS TEACHER está preparando a explicação…</div>}
      </div>

      {!API_BASE && <p className="teacher-chat-config" role="status">A integração ainda não está configurada. Depois de publicar a API, defina a variável pública <code>VITE_TEACHER_API_URL</code> e gere novamente o site.</p>}
      {error && <p className="teacher-chat-error" role="alert">{error}</p>}

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
          aria-label={`Pergunta sobre ${topic.title}`}
          maxLength={MAX_QUESTION_CHARS}
          rows={2}
          disabled={isSending}
        />
        <button className="teacher-chat-send" type="submit" aria-label="Enviar pergunta" disabled={!API_BASE || !question.trim() || isSending}>
          {isSending ? <LoaderCircle className="teacher-spin" /> : <Send />}
        </button>
      </form>
      <div className="teacher-chat-foot"><span>Perguntas e teoria são enviadas a um provedor externo de IA; a conversa fica só nesta sessão e não vai para o histórico.</span><span className="teacher-chat-count">{question.length}/{MAX_QUESTION_CHARS}</span></div>
    </section>
  );
}
