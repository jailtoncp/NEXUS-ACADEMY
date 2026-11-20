import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, CircleHelp, Clock3, ListChecks, Maximize2, Minimize2, RotateCcw, Star, X, ZoomIn, ZoomOut } from 'lucide-react';
import { appendAnswerAttempt, readAnswerHistory } from '../lib/answerHistory.js';
import { isQuestionFavorite, readFavoriteItems, toggleQuestionFavorite } from '../lib/favorites.js';
import './discipline-module.css';

function getSubtopic(subject, topicId, subtopicId) {
  const topic = subject.topics.find((item) => item.id === topicId);
  return topic?.subtopics.find((item) => item.id === subtopicId);
}

export default function DisciplineModule({ subject, defaultSection = 'content', initialTarget = null }) {
  const initialSection = initialTarget?.mode || defaultSection;
  const [section, setSection] = useState(initialSection);
  const [topicId, setTopicId] = useState(initialTarget?.topicId || (initialSection === 'questions' ? '' : subject.topics[0]?.id));
  const [history, setHistory] = useState(readAnswerHistory);
  const [historyError, setHistoryError] = useState('');
  const [pendingLesson, setPendingLesson] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenOutlineOpen, setFullscreenOutlineOpen] = useState(false);
  const fullscreenTriggerRef = useRef(null);
  const fullscreenCloseRef = useRef(null);
  const fullscreenContentRef = useRef(null);

  useEffect(() => {
    const nextSection = initialTarget?.mode || defaultSection;
    setSection(nextSection);
    setTopicId(initialTarget?.topicId || (nextSection === 'questions' ? '' : subject.topics[0]?.id));
    setPendingLesson(initialTarget?.subtopicId ? { topicId: initialTarget.topicId, subtopicId: initialTarget.subtopicId } : null);
  }, [defaultSection, subject.id, initialTarget]);

  useEffect(() => {
    if (!isFullscreen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fullscreenCloseRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      window.requestAnimationFrame(() => fullscreenTriggerRef.current?.focus());
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen && fullscreenContentRef.current) fullscreenContentRef.current.scrollTop = 0;
  }, [isFullscreen, topicId]);

  useEffect(() => {
    const refresh = () => setHistory(readAnswerHistory());
    window.addEventListener('nexus-history-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nexus-history-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    if (section !== 'content' || !pendingLesson || topicId !== pendingLesson.topicId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`lesson-${subject.id}-${pendingLesson.subtopicId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingLesson(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [section, subject.id, topicId, pendingLesson]);

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
    setHistoryError('');
    try {
      setHistory(appendAnswerAttempt(attempt));
      return true;
    } catch {
      setHistoryError('Não foi possível salvar a resposta neste navegador. Seu histórico anterior foi mantido; libere espaço e tente novamente.');
      return false;
    }
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
        <>
        <div className="study-layout" aria-hidden={isFullscreen}>
          <aside className="topic-list" tabIndex={0} aria-label="Roteiro de estudo">
            <div className="topic-list-heading">ROTEIRO DE ESTUDO</div>
            {subject.topics.map((item) => (
              <button key={item.id} className={topicId === item.id ? 'topic-link active' : 'topic-link'} onClick={() => setTopicId(item.id)}>
                <span>{String(item.order).padStart(2, '0')}</span>{item.title}
                <small>{item.subtopics.length} {item.subtopics.length === 1 ? 'subassunto' : 'subassuntos'}</small>
              </button>
            ))}
          </aside>
          <main className="topic-content">
            <TopicMaterial
              subject={subject}
              topic={topic}
              onPractice={() => setSection('questions')}
              onNextTopic={() => setTopicId(subject.topics[topic.order % subject.topics.length].id)}
              onEnterFullscreen={() => { setFullscreenOutlineOpen(false); setIsFullscreen(true); }}
              fullscreenButtonRef={fullscreenTriggerRef}
            />
          </main>
        </div>
        {isFullscreen && (
          <div className="fullscreen-reader-backdrop">
            <section className="fullscreen-reader" role="dialog" aria-modal="true" aria-label={`Leitura em tela cheia: ${subject.name}`}>
              <header className="fullscreen-reader-toolbar">
                <div className="fullscreen-reader-heading"><span>LEITURA EM FOCO</span><h2>{subject.name}</h2></div>
                <div className="fullscreen-reader-actions">
                  <button type="button" className="small-action" aria-expanded={fullscreenOutlineOpen} aria-controls="fullscreen-study-outline" onClick={() => setFullscreenOutlineOpen((open) => !open)}><ListChecks /> {fullscreenOutlineOpen ? 'Ocultar roteiro' : 'Mostrar roteiro'}</button>
                  <button type="button" className="small-action" ref={fullscreenCloseRef} onClick={() => setIsFullscreen(false)}><Minimize2 /> Sair da tela cheia</button>
                </div>
              </header>
              <div className={`fullscreen-reader-body ${fullscreenOutlineOpen ? 'outline-open' : 'outline-closed'}`}>
                <aside id="fullscreen-study-outline" className="topic-list fullscreen-topic-list" tabIndex={0} aria-label="Roteiro de estudo em tela cheia" hidden={!fullscreenOutlineOpen}>
                  <div className="topic-list-heading">ROTEIRO DE ESTUDO</div>
                  {subject.topics.map((item) => (
                    <button key={item.id} className={topicId === item.id ? 'topic-link active' : 'topic-link'} onClick={() => setTopicId(item.id)}>
                      <span>{String(item.order).padStart(2, '0')}</span>{item.title}
                      <small>{item.subtopics.length} {item.subtopics.length === 1 ? 'subassunto' : 'subassuntos'}</small>
                    </button>
                  ))}
                </aside>
                <main className="topic-content fullscreen-topic-content" ref={fullscreenContentRef} tabIndex={0} aria-label={`Material de estudo: ${topic.title}`}>
                  <TopicMaterial
                    subject={subject}
                    topic={topic}
                    onPractice={() => { setIsFullscreen(false); setSection('questions'); }}
                    onNextTopic={() => setTopicId(subject.topics[topic.order % subject.topics.length].id)}
                  />
                </main>
              </div>
            </section>
          </div>
        )}
        </>
      )}

      {section === 'questions' && (
        <div className="question-layout">
          <aside className="question-filters">
            <label htmlFor="question-topic">Filtrar por assunto</label>
            <div className="select-wrap"><select id="question-topic" value={topicId} onChange={(event) => setTopicId(event.target.value)}><option value="">Todos os assuntos</option>{subject.topics.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select><ChevronDown /></div>
            <div className="filter-note"><CircleHelp /><span>{subject.questionNotice || 'Questões estruturadas a partir dos materiais do acervo. A origem e o ano, quando identificados, acompanham cada item.'}{subject.reviewCount > 0 && <> {subject.reviewCount} questão(ões) foram preservadas no inventário de auditoria para revisão de OCR, gabarito, classificação ou possível duplicidade e não entram no treino interativo.</>}</span></div>
            <button className="text-action" onClick={() => setSection('content')}><ArrowLeft /> Voltar ao conteúdo</button>
          </aside>
          <QuestionRunner key={`${topicId || 'all'}-${initialTarget?.questionId || ''}-${initialTarget?.navigationKey || ''}`} questions={questions} topic={topicId ? topic : null} topics={subject.topics} subjectName={subject.name} disciplineId={subject.id} history={history} onAnswer={recordAnswer} initialQuestionId={initialTarget?.questionId} historyError={historyError} />
        </div>
      )}

      {section === 'history' && (
        <section className="history-panel">
          <div className="history-heading"><div><span>REGISTROS LOCAIS</span><h2>Seu histórico de respostas</h2></div><button className="small-action" onClick={() => setHistory(readHistory())}><RotateCcw /> Atualizar</button></div>
          {history.filter((item) => item.discipline === subject.id).length === 0 ? <div className="history-empty"><Clock3 /><h3>Nenhuma resposta registrada ainda</h3><p>Responda a uma questão para começar seu histórico de {subject.name}.</p><button className="primary-action" onClick={() => setSection('questions')}>Ir para questões</button></div> : (
            <div className="history-table-wrap"><table className="history-table"><thead><tr><th>Data e hora</th><th>Assunto</th><th>Escolhida</th><th>Gabarito</th><th>Resultado</th><th>Tempo</th></tr></thead><tbody>{history.filter((item) => item.discipline === subject.id).slice().reverse().map((item, index) => { const st = getSubtopic(subject, item.topicId, item.subtopicId); return <tr key={`${item.answeredAt}-${index}`}><td>{new Date(item.answeredAt).toLocaleString('pt-BR')}</td><td>{st?.title || item.topicId}</td><td>{item.chosenOption}</td><td>{item.correctOption}</td><td><span className={item.isCorrect ? 'result-good' : 'result-bad'}>{item.isCorrect ? 'Acerto' : 'Erro'}</span></td><td>{item.responseTimeMs ? `${Math.round(item.responseTimeMs / 1000)} s` : '—'}</td></tr>; })}</tbody></table></div>
          )}
        </section>
      )}
    </div>
  );
}

function TopicMaterial({ subject, topic, onPractice, onNextTopic, onEnterFullscreen, fullscreenButtonRef }) {
  return (
    <>
      <div className="topic-title-row">
        <div><span>ASSUNTO {String(topic.order).padStart(2, '0')}</span><h2>{topic.title}</h2><p>{topic.summary}</p></div>
        <div className="topic-actions">
          {onEnterFullscreen && <button type="button" className="small-action" ref={fullscreenButtonRef} onClick={onEnterFullscreen} aria-label={`Abrir ${topic.title} em tela cheia`}><Maximize2 /> Tela cheia</button>}
          <button type="button" className="small-action" onClick={onPractice}><ListChecks /> Praticar assunto</button>
        </div>
      </div>
      {topic.subtopics.map((subtopic) => (
        <article className="lesson-card" id={`lesson-${subject.id}-${subtopic.id}`} key={subtopic.id}>
          <div className="lesson-number">{String(topic.order).padStart(2, '0')}.{String(subtopic.order).padStart(2, '0')}</div>
          <div>
            <h3>{subtopic.title}</h3>
            {subtopic.content.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {subtopic.truthTable && (
              <div className="lesson-table-scroll" role="region" aria-label={subtopic.truthTable.ariaLabel} tabIndex={0}>
                <table className="lesson-truth-table">
                  <caption>{subtopic.truthTable.caption}</caption>
                  <thead><tr>{subtopic.truthTable.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
                  <tbody>{subtopic.truthTable.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, columnIndex) => <td key={`${rowIndex}-${columnIndex}`}>{value}</td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
            {subtopic.references?.length > 0 && (
              <div className="lesson-references">
                <strong>Fontes oficiais e documentação</strong>
                <ul>{subtopic.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.label}<ArrowUpRight /></a></li>)}</ul>
              </div>
            )}
          </div>
        </article>
      ))}
      <div className="lesson-footer"><span>Próximo assunto</span><button type="button" onClick={onNextTopic}>{subject.topics[topic.order % subject.topics.length].title}<ArrowRight /></button></div>
    </>
  );
}

function imageSrc(image) {
  const src = image?.src || image?.path;
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src) || src.startsWith('/')) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`;
}

function QuestionRunner({ questions, topic, topics, subjectName, disciplineId, history, onAnswer, initialQuestionId, historyError }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [pinnedQuestionId, setPinnedQuestionId] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(() => {
    const initialQuestion = questions.find((item) => String(item.id) === String(initialQuestionId));
    return initialQuestion?.id ?? questions[0]?.id ?? null;
  });
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [favorites, setFavorites] = useState(readFavoriteItems);
  const [favoriteError, setFavoriteError] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const imageZoomTriggerRef = useRef(null);
  const imageZoomCloseRef = useRef(null);

  useEffect(() => {
    const refresh = () => setFavorites(readFavoriteItems());
    window.addEventListener('nexus-favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nexus-favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    if (!zoomedImage) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    imageZoomCloseRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      window.requestAnimationFrame(() => imageZoomTriggerRef.current?.focus());
    };
  }, [zoomedImage]);

  const answeredIds = new Set(history.filter((item) => item.discipline === disciplineId).map((item) => String(item.questionId)));
  const answeredCount = questions.filter((item) => answeredIds.has(String(item.id))).length;
  const matchesStatus = (item, filter) => filter === 'all' || (filter === 'answered' ? answeredIds.has(String(item.id)) : !answeredIds.has(String(item.id)));
  const filteredQuestions = questions.filter((item) => matchesStatus(item, statusFilter) || String(item.id) === pinnedQuestionId);
  const index = Math.max(0, filteredQuestions.findIndex((item) => String(item.id) === String(currentQuestionId)));
  const question = filteredQuestions[index];
  const questionIsFavorite = question ? isQuestionFavorite(disciplineId, question.id, favorites) : false;
  const statusOptions = [
    { id: 'all', label: 'Todas', count: questions.length },
    { id: 'answered', label: 'Respondidas', count: answeredCount },
    { id: 'unanswered', label: 'Não respondidas', count: questions.length - answeredCount },
  ];
  const statusControls = (
    <fieldset className="question-status-filter">
      <legend>Andamento das questões</legend>
      <div className="question-status-options" role="group" aria-label="Filtrar questões pelo andamento">
        {statusOptions.map((option) => <button key={option.id} type="button" className={statusFilter === option.id ? 'selected' : ''} aria-pressed={statusFilter === option.id} onClick={() => {
          const firstQuestion = questions.find((item) => String(item.id) === String(currentQuestionId) && matchesStatus(item, option.id)) || questions.find((item) => matchesStatus(item, option.id));
          setStatusFilter(option.id);
          setPinnedQuestionId('');
          setCurrentQuestionId(firstQuestion?.id ?? null);
          setSelected(''); setSubmitted(false); setStartedAt(Date.now());
        }}>{option.label}<span>{option.count}</span></button>)}
      </div>
      <p>Uma questão é considerada respondida após pelo menos uma tentativa salva neste navegador.</p>
    </fieldset>
  );

  if (!question) return <div className="question-runner">{statusControls}<section className="question-card empty-questions"><CircleHelp /><h2>{statusFilter === 'answered' ? 'Nenhuma questão respondida neste filtro' : statusFilter === 'unanswered' ? 'Nenhuma questão não respondida' : 'Não há questões neste assunto'}</h2><p>{statusFilter === 'answered' ? 'Responda a uma questão para ela aparecer neste filtro.' : statusFilter === 'unanswered' ? 'Todas as questões deste filtro já têm uma resposta salva.' : 'Escolha outro assunto no filtro para continuar.'}</p></section></div>;
  const promptImages = (question.images || []).filter((image) => image.location !== 'option' && imageSrc(image));

  function toggleCurrentFavorite() {
    setFavoriteError('');
    try {
      setFavorites(toggleQuestionFavorite(disciplineId, question.id));
    } catch (cause) {
      setFavoriteError(cause.message || 'Não foi possível atualizar os favoritos.');
    }
  }

  function openImageZoom(image, event) {
    const src = imageSrc(image);
    if (!src) return;
    imageZoomTriggerRef.current = event.currentTarget;
    setImageZoom(1);
    setZoomedImage({ src, alt: image.alt || 'Imagem do enunciado', caption: image.caption || image.alt || '' });
  }

  function adjustImageZoom(amount) {
    setImageZoom((current) => Math.max(1, Math.min(3, Number((current + amount).toFixed(2)))));
  }

  function submit() {
    if (!selected || submitted) return;
    if (onAnswer(question, selected, Date.now() - startedAt)) {
      setSubmitted(true);
      if (statusFilter === 'unanswered') setPinnedQuestionId(String(question.id));
    }
  }

  function move(delta) {
    const nextQuestion = filteredQuestions[index + delta];
    if (!nextQuestion) return;
    setCurrentQuestionId(nextQuestion.id);
    setPinnedQuestionId('');
    setSelected(''); setSubmitted(false); setStartedAt(Date.now());
  }

  return (
    <div className="question-runner">
      {statusControls}
    <section className="question-card">
      <div className="question-meta">
        <span>QUESTÃO {index + 1} DE {filteredQuestions.length}</span>
        <span>{question.origin === 'authorial' ? 'Questão autoral · NEXUS ACADEMY' : question.year || 'Ano não informado'}{question.difficulty ? ` · ${question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Média' : 'Difícil'}` : ''}</span>
        <button className={`question-favorite-toggle ${questionIsFavorite ? 'is-saved' : ''}`} type="button" aria-pressed={questionIsFavorite} aria-label={questionIsFavorite ? 'Remover questão dos favoritos' : 'Salvar questão nos favoritos'} onClick={toggleCurrentFavorite}><Star fill={questionIsFavorite ? 'currentColor' : 'none'} />{questionIsFavorite ? 'Salva' : 'Favoritar'}</button>
      </div>
      <div className="question-progress"><i style={{ width: `${((index + 1) / filteredQuestions.length) * 100}%` }} /></div>
      {favoriteError && <p className="question-favorite-error" role="alert">{favoriteError}</p>}
      {statusFilter === 'unanswered' && pinnedQuestionId === String(question.id) && <p className="question-status-saved" aria-live="polite">Resposta registrada. Avance para continuar pelas questões não respondidas.</p>}
      <div className="question-topic">{topics.find((item) => item.id === question.topicId)?.title || topic?.title || subjectName}</div>
      <h2>{question.prompt}</h2>
      {(question.answerStatus || question.legalUpdateNote) && (
        <aside className={`question-provenance ${question.legalUpdateNote ? 'has-warning' : ''}`}>
          {question.answerStatus && <p><strong>Gabarito informado:</strong> {question.answerStatus}</p>}
          {question.legalUpdateNote && <p role="note"><strong>Aviso de atualização legislativa:</strong> {question.legalUpdateNote}</p>}
        </aside>
      )}
      {promptImages.length > 0 && (
        <div className="question-figures" aria-label="Figuras e diagramas da questão">
          {promptImages.map((image, imageIndex) => {
            const alt = image.alt || `Imagem ${imageIndex + 1} da questão`;
            return (
              <figure className="question-figure" key={`${image.src || image.imageIndex || imageIndex}-${imageIndex}`}>
                <button type="button" className="question-image-trigger" aria-haspopup="dialog" aria-label={`Ampliar imagem do enunciado para facilitar a leitura: ${alt}`} onClick={(event) => openImageZoom(image, event)}>
                  <img src={imageSrc(image)} alt={alt} loading="lazy" decoding="async" />
                  <span className="question-image-zoom-hint"><ZoomIn aria-hidden="true" /> Ampliar para ler</span>
                </button>
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      )}
      <div className="answer-options" role="radiogroup" aria-label="Alternativas">
        {Object.entries(question.options).map(([key, text]) => {
          const isCorrect = submitted && key === question.answer;
          const isWrong = submitted && key === selected && key !== question.answer;
          const optionImages = (question.images || []).filter((image) => image.location === 'option' && image.optionKey === key && imageSrc(image));
          const optionText = typeof text === 'string' ? text : text?.text || '';
          return <button key={key} disabled={submitted} className={`answer-option ${optionImages.length ? 'has-image' : ''} ${selected === key ? 'chosen' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`} role="radio" aria-checked={selected === key} onClick={() => setSelected(key)}><span>{key}</span><span>{optionText}</span>{optionImages.length > 0 && <span className="answer-option-images">{optionImages.map((image, imageIndex) => <img key={`${image.src || image.imageIndex || imageIndex}-${imageIndex}`} src={imageSrc(image)} alt={image.alt || `Figura da alternativa ${key}`} loading="lazy" decoding="async" />)}</span>}{isCorrect && <Check />}</button>;
        })}
      </div>
      {historyError && <p className="history-save-error" role="alert">{historyError}</p>}
      {!submitted ? <button className="primary-action confirm-answer" disabled={!selected} onClick={submit}>Confirmar resposta</button> : (
        <div className={`answer-feedback ${selected === question.answer ? 'success' : 'failure'}`} role="status">
          <strong>{selected === question.answer ? 'Você acertou!' : 'Você errou.'}</strong>
          {selected !== question.answer && <p>Você escolheu <b>{selected}</b>. A alternativa correta é <b>{question.answer}</b>.</p>}
          <p>{question.comment}</p>
          {question.source && <small>Fonte: {question.source}</small>}
        </div>
      )}
      <div className="question-navigation"><button onClick={() => move(-1)} disabled={index === 0}><ArrowLeft /> Anterior</button><button onClick={() => move(1)} disabled={index === filteredQuestions.length - 1}>Próxima <ArrowRight /></button></div>
    </section>
    {zoomedImage && (
      <div className="question-image-zoom-backdrop" onClick={() => setZoomedImage(null)}>
        <section className="question-image-zoom-dialog" role="dialog" aria-modal="true" aria-label={`Imagem ampliada: ${zoomedImage.alt}`} onClick={(event) => event.stopPropagation()}>
          <header className="question-image-zoom-toolbar">
            <div className="question-image-zoom-heading"><span>LEITURA DA IMAGEM</span><h2>Imagem ampliada</h2></div>
            <div className="question-image-zoom-controls">
              <button type="button" className="small-action" aria-label="Diminuir zoom" title="Diminuir zoom" disabled={imageZoom <= 1} onClick={() => adjustImageZoom(-0.25)}><ZoomOut /></button>
              <span className="question-image-zoom-level" aria-live="polite">{Math.round(imageZoom * 100)}%</span>
              <button type="button" className="small-action" aria-label="Aumentar zoom" title="Aumentar zoom" disabled={imageZoom >= 3} onClick={() => adjustImageZoom(0.25)}><ZoomIn /></button>
              <button type="button" className="small-action" onClick={() => setImageZoom(1)}><RotateCcw /> Ajustar</button>
              <button type="button" className="small-action" ref={imageZoomCloseRef} onClick={() => setZoomedImage(null)}><X /> Fechar</button>
            </div>
          </header>
          <div className="question-image-zoom-stage">
            <img src={zoomedImage.src} alt={zoomedImage.alt} style={{ transform: `scale(${imageZoom})` }} />
          </div>
          {zoomedImage.caption && <p className="question-image-zoom-caption">{zoomedImage.caption}</p>}
        </section>
      </div>
    )}
    </div>
  );
}
