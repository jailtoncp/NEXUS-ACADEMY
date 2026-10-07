import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Clock3, ListChecks, RotateCcw } from 'lucide-react';
import './discipline-module.css';

const HISTORY_KEY = 'nexus-academy:answer-history:v1';

function readHistory() {
  try {
    const value = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveAttempt(attempt) {
  const history = readHistory();
  history.push(attempt);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

function getSubtopic(subject, topicId, subtopicId) {
  const topic = subject.topics.find((item) => item.id === topicId);
  return topic?.subtopics.find((item) => item.id === subtopicId);
}

export default function DisciplineModule({ subject, defaultSection = 'content' }) {
  const [section, setSection] = useState(defaultSection);
  const [topicId, setTopicId] = useState(defaultSection === 'questions' ? '' : subject.topics[0]?.id);
  const [history, setHistory] = useState(readHistory);

  useEffect(() => {
    setSection(defaultSection);
    if (defaultSection === 'questions') setTopicId('');
  }, [defaultSection]);

  const questions = useMemo(
    () => subject.questions.filter((question) => !topicId || question.topicId === topicId),
    [subject.questions, topicId],
  );
  const topic = subject.topics.find((item) => item.id === topicId) || subject.topics[0];

  function recordAnswer(question, chosen, elapsedMs) {
    const attempt = {
      questionId: question.id,
      discipline: subject.id,
      disciplineName: subject.name,
      topicId: question.topicId,
      subtopicId: question.subtopicId,
      chosenOption: chosen,
      correctOption: question.answer,
      isCorrect: chosen === question.answer,
      answeredAt: new Date().toISOString(),
      responseTimeMs: elapsedMs,
      source: question.source,
    };
    setHistory(saveAttempt(attempt));
  }

  return (
    <div className="study-module">
      <section className="study-heading">
        <div>
          <span className="study-kicker">DISCIPLINA · {subject.abbreviation}</span>
          <h1>{subject.name}</h1>
          <p>{subject.description}</p>
        </div>
        <div className="study-total"><BookOpen /><b>{subject.questions.length}</b><span>questões disponíveis</span></div>
      </section>

      <nav className="study-tabs" aria-label="Seções da disciplina">
        <button className={section === 'content' ? 'selected' : ''} onClick={() => setSection('content')}><BookOpen /> Conteúdo</button>
        <button className={section === 'questions' ? 'selected' : ''} onClick={() => setSection('questions')}><ListChecks /> Questões <span>{subject.questions.length}</span></button>
        <button className={section === 'history' ? 'selected' : ''} onClick={() => setSection('history')}><Clock3 /> Histórico <span>{history.filter((item) => item.discipline === subject.id).length}</span></button>
      </nav>

      {section === 'content' && (
        <div className="study-layout">
          <aside className="topic-list">
            <div className="topic-list-heading">ROTEIRO DE ESTUDO</div>
            {subject.topics.map((item) => (
              <button key={item.id} className={topicId === item.id ? 'topic-link active' : 'topic-link'} onClick={() => setTopicId(item.id)}>
                <span>{String(item.order).padStart(2, '0')}</span>{item.title}
                <small>{item.subtopics.length} {item.subtopics.length === 1 ? 'subassunto' : 'subassuntos'}</small>
              </button>
            ))}
          </aside>
          <main className="topic-content">
            <div className="topic-title-row"><div><span>ASSUNTO {String(topic.order).padStart(2, '0')}</span><h2>{topic.title}</h2><p>{topic.summary}</p></div><button className="small-action" onClick={() => setSection('questions')}><ListChecks /> Praticar assunto</button></div>
            {topic.subtopics.map((subtopic) => (
              <article className="lesson-card" key={subtopic.id}>
                <div className="lesson-number">{String(topic.order).padStart(2, '0')}.{String(subtopic.order).padStart(2, '0')}</div>
                <div><h3>{subtopic.title}</h3>{subtopic.content.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              </article>
            ))}
            <div className="lesson-footer"><span>Próximo assunto</span><button onClick={() => setTopicId(subject.topics[(topic.order) % subject.topics.length].id)}>{subject.topics[(topic.order) % subject.topics.length].title}<ArrowRight /></button></div>
          </main>
        </div>
      )}

      {section === 'questions' && (
        <div className="question-layout">
          <aside className="question-filters">
            <label htmlFor="question-topic">Filtrar por assunto</label>
            <div className="select-wrap"><select id="question-topic" value={topicId} onChange={(event) => setTopicId(event.target.value)}><option value="">Todos os assuntos</option>{subject.topics.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select><ChevronDown /></div>
            <div className="filter-note"><CircleHelp /><span>Questões estruturadas a partir dos materiais do acervo. A origem e o ano, quando identificados, acompanham cada item.{subject.reviewCount > 0 && <> {subject.reviewCount} questão(ões) foram preservadas no inventário de auditoria para revisão por OCR ou gabarito e não entram no treino interativo.</>}</span></div>
            <button className="text-action" onClick={() => setSection('content')}><ArrowLeft /> Voltar ao conteúdo</button>
          </aside>
          <QuestionRunner key={topicId || 'all'} questions={questions} topic={topicId ? topic : null} topics={subject.topics} onAnswer={recordAnswer} />
        </div>
      )}

      {section === 'history' && (
        <section className="history-panel">
          <div className="history-heading"><div><span>REGISTROS LOCAIS</span><h2>Seu histórico de respostas</h2></div><button className="small-action" onClick={() => setHistory(readHistory())}><RotateCcw /> Atualizar</button></div>
          {history.filter((item) => item.discipline === subject.id).length === 0 ? <div className="history-empty"><Clock3 /><h3>Nenhuma resposta registrada ainda</h3><p>Responda a uma questão para começar seu histórico de Raciocínio Lógico.</p><button className="primary-action" onClick={() => setSection('questions')}>Ir para questões</button></div> : (
            <div className="history-table-wrap"><table className="history-table"><thead><tr><th>Data e hora</th><th>Assunto</th><th>Escolhida</th><th>Gabarito</th><th>Resultado</th><th>Tempo</th></tr></thead><tbody>{history.filter((item) => item.discipline === subject.id).slice().reverse().map((item, index) => { const st = getSubtopic(subject, item.topicId, item.subtopicId); return <tr key={`${item.answeredAt}-${index}`}><td>{new Date(item.answeredAt).toLocaleString('pt-BR')}</td><td>{st?.title || item.topicId}</td><td>{item.chosenOption}</td><td>{item.correctOption}</td><td><span className={item.isCorrect ? 'result-good' : 'result-bad'}>{item.isCorrect ? 'Acerto' : 'Erro'}</span></td><td>{item.responseTimeMs ? `${Math.round(item.responseTimeMs / 1000)} s` : '—'}</td></tr>; })}</tbody></table></div>
          )}
        </section>
      )}
    </div>
  );
}

function QuestionRunner({ questions, topic, topics, onAnswer }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const question = questions[index];

  useEffect(() => { setIndex(0); setSelected(''); setSubmitted(false); setStartedAt(Date.now()); }, [questions.length]);

  if (!question) return <section className="question-card empty-questions"><CircleHelp /><h2>Não há questões neste assunto</h2><p>Escolha outro assunto no filtro para continuar.</p></section>;

  function submit() {
    if (!selected || submitted) return;
    onAnswer(question, selected, Date.now() - startedAt);
    setSubmitted(true);
  }

  function move(delta) {
    setIndex((current) => Math.min(Math.max(current + delta, 0), questions.length - 1));
    setSelected(''); setSubmitted(false); setStartedAt(Date.now());
  }

  return (
    <section className="question-card">
      <div className="question-meta"><span>QUESTÃO {index + 1} DE {questions.length}</span><span>{question.year || 'Ano não informado'}{question.difficulty ? ` · ${question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Média' : 'Difícil'}` : ''}</span></div>
      <div className="question-progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      <div className="question-topic">{topics.find((item) => item.id === question.topicId)?.title || topic?.title || 'Raciocínio Lógico'}</div>
      <h2>{question.prompt}</h2>
      <div className="answer-options" role="radiogroup" aria-label="Alternativas">
        {Object.entries(question.options).map(([key, text]) => {
          const isCorrect = submitted && key === question.answer;
          const isWrong = submitted && key === selected && key !== question.answer;
          return <button key={key} disabled={submitted} className={`answer-option ${selected === key ? 'chosen' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`} role="radio" aria-checked={selected === key} onClick={() => setSelected(key)}><span>{key}</span><span>{text}</span>{isCorrect && <Check />}</button>;
        })}
      </div>
      {!submitted ? <button className="primary-action confirm-answer" disabled={!selected} onClick={submit}>Confirmar resposta</button> : (
        <div className={`answer-feedback ${selected === question.answer ? 'success' : 'failure'}`} role="status">
          <strong>{selected === question.answer ? 'Você acertou!' : 'Você errou.'}</strong>
          {selected !== question.answer && <p>Você escolheu <b>{selected}</b>. A alternativa correta é <b>{question.answer}</b>.</p>}
          <p>{question.comment}</p>
          {question.source && <small>Fonte: {question.source}</small>}
        </div>
      )}
      <div className="question-navigation"><button onClick={() => move(-1)} disabled={index === 0}><ArrowLeft /> Anterior</button><button onClick={() => move(1)} disabled={index === questions.length - 1}>Próxima <ArrowRight /></button></div>
    </section>
  );
}
