import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CircleAlert,
  ListChecks,
  Play,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import { activeSubjects, availableQuestionTotal } from '../data/subjectRegistry.js';
import {
  distributeEvenly,
  generateSimulatedExam,
  gradeSimulatedExam,
  resolveFinishTiming,
  validateCustomQuotas,
} from '../lib/simulatedExam.js';
import './simulados.css';

const DEFAULT_TOTAL = 50;
const DURATION_LIMIT_MINUTES = 720;
const DEFAULT_SELECTED_IDS = activeSubjects.map((subject) => subject.id);

function formatNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR');
}

function formatDecimal(value) {
  return Number(value || 0).toFixed(1).replace('.', ',');
}

function formatClock(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const two = (number) => String(number).padStart(2, '0');
  return hours > 0 ? `${two(hours)}:${two(minutes)}:${two(seconds)}` : `${two(minutes)}:${two(seconds)}`;
}

function imageSource(image) {
  const source = image?.src || image?.path;
  if (!source) return '';
  if (/^(https?:|data:|blob:)/i.test(source) || source.startsWith('/')) return source;
  return `${import.meta.env.BASE_URL}${source.replace(/^\/+/, '')}`;
}

function optionText(value) {
  return typeof value === 'string' ? value : value?.text || '';
}

function SimuladosPage() {
  const [phase, setPhase] = useState('setup');
  const [totalQuestions, setTotalQuestions] = useState(DEFAULT_TOTAL);
  const [distributionMode, setDistributionMode] = useState('balanced');
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState(DEFAULT_SELECTED_IDS);
  const [customQuotas, setCustomQuotas] = useState(() => (
    distributeEvenly(activeSubjects, DEFAULT_TOTAL, DEFAULT_SELECTED_IDS).allocations
  ));
  const [customConfigured, setCustomConfigured] = useState(false);
  const [durationMode, setDurationMode] = useState('timed');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [customBalanceError, setCustomBalanceError] = useState('');
  const [startError, setStartError] = useState('');

  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jumpInput, setJumpInput] = useState('1');
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [endedByTimer, setEndedByTimer] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const finishedRef = useRef(false);
  const finishTriggerRef = useRef(null);
  const finishDialogRef = useRef(null);
  const continueExamRef = useRef(null);
  const resultHeadingRef = useRef(null);

  const numericTotal = Number(totalQuestions);
  const automaticPlan = useMemo(
    () => distributeEvenly(activeSubjects, numericTotal, selectedDisciplineIds),
    [numericTotal, selectedDisciplineIds],
  );
  const customPlan = useMemo(
    () => validateCustomQuotas(activeSubjects, numericTotal, customQuotas),
    [numericTotal, customQuotas],
  );
  const currentPlan = distributionMode === 'balanced' ? automaticPlan : customPlan;
  const displayedQuotas = currentPlan.allocations;
  const allocatedTotal = distributionMode === 'balanced'
    ? Object.values(automaticPlan.allocations).reduce((sum, amount) => sum + amount, 0)
    : customPlan.sum;
  const includedCount = activeSubjects.filter((subject) => Number(displayedQuotas[subject.id] || 0) > 0).length;

  const setupErrors = [];
  if (!Number.isInteger(numericTotal) || numericTotal < 1) {
    setupErrors.push('Informe um total inteiro de pelo menos 1 questão.');
  } else if (numericTotal > availableQuestionTotal) {
    setupErrors.push(`O acervo integrado tem ${formatNumber(availableQuestionTotal)} questões no total.`);
  }

  if (distributionMode === 'balanced') {
    if (selectedDisciplineIds.length === 0) {
      setupErrors.push('Selecione pelo menos uma disciplina.');
    } else if (Number.isInteger(numericTotal) && numericTotal > automaticPlan.available) {
      setupErrors.push(`As disciplinas selecionadas têm ${formatNumber(automaticPlan.available)} questões disponíveis para este simulado.`);
    }
  } else if (customPlan.reason === 'total-mismatch') {
    setupErrors.push(`A distribuição soma ${formatNumber(customPlan.sum)} questões; ajuste as quantidades para chegar a ${formatNumber(numericTotal)}.`);
  } else if (customPlan.reason === 'no-questions') {
    setupErrors.push('Informe pelo menos uma questão em alguma disciplina.');
  } else if (customPlan.reason === 'quantity-exceeds-availability') {
    setupErrors.push('Uma ou mais quantidades ultrapassam o banco disponível da disciplina.');
  } else if (customPlan.reason === 'invalid-quantity') {
    setupErrors.push('As quantidades por disciplina precisam ser números inteiros iguais ou maiores que zero.');
  } else if (customPlan.reason === 'invalid-discipline') {
    setupErrors.push('A configuração contém uma disciplina que não está disponível.');
  }

  if (durationMode === 'timed' && (!Number.isInteger(Number(durationMinutes)) || Number(durationMinutes) < 1 || Number(durationMinutes) > DURATION_LIMIT_MINUTES)) {
    setupErrors.push(`Escolha uma duração entre 1 e ${DURATION_LIMIT_MINUTES} minutos ou selecione “Sem limite”.`);
  }

  const canStart = setupErrors.length === 0;
  const runningQuestion = examQuestions[currentIndex];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const score = useMemo(() => gradeSimulatedExam(examQuestions, answers), [examQuestions, answers]);
  const reviewItems = useMemo(() => examQuestions.flatMap((entry, index) => {
    const chosen = answers[index] || '';
    return chosen === entry.question.answer ? [] : [{ entry, index, chosen }];
  }), [examQuestions, answers]);

  const deadline = startedAt && durationMode === 'timed'
    ? startedAt + Number(durationMinutes) * 60_000
    : null;
  const timeLeft = deadline ? Math.max(0, deadline - now) : null;
  const elapsed = startedAt ? Math.max(0, ((finishedAt || now) - startedAt)) : 0;

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!confirmFinish) return undefined;
    const dialog = finishDialogRef.current;
    (continueExamRef.current || dialog)?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeFinishDialog();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')];
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [confirmFinish]);

  useEffect(() => {
    if (phase === 'running' && deadline && now >= deadline) finishExam(deadline, true);
  }, [phase, deadline, now]);

  useEffect(() => {
    if (phase === 'result') window.requestAnimationFrame(() => resultHeadingRef.current?.focus());
  }, [phase]);

  function closeFinishDialog() {
    setConfirmFinish(false);
    window.setTimeout(() => finishTriggerRef.current?.focus(), 0);
  }

  function finishExam(completedAt = Date.now(), byTimer = false) {
    if (finishedRef.current) return;
    const timing = resolveFinishTiming(completedAt, startedAt, durationMinutes, durationMode === 'timed');
    completedAt = timing.finishedAt;
    byTimer = byTimer || timing.byTimer;
    finishedRef.current = true;
    setFinishedAt(completedAt);
    setEndedByTimer(byTimer);
    setConfirmFinish(false);
    setPhase('result');
  }

  function updateSelectedDiscipline(disciplineId, checked) {
    setSelectedDisciplineIds((current) => (
      checked
        ? [...new Set([...current, disciplineId])]
        : current.filter((id) => id !== disciplineId)
    ));
  }

  function enterDistributionMode(nextMode) {
    if (nextMode === 'custom' && distributionMode === 'balanced' && !customConfigured && automaticPlan.valid) {
      setCustomQuotas(automaticPlan.allocations);
      setCustomConfigured(true);
    }
    setDistributionMode(nextMode);
    setCustomBalanceError('');
  }

  function updateCustomQuota(disciplineId, rawValue) {
    const value = rawValue === '' ? 0 : Number(rawValue);
    setCustomQuotas((current) => ({ ...current, [disciplineId]: value }));
    setCustomConfigured(true);
    setCustomBalanceError('');
  }

  function balanceCustomQuotas() {
    const currentlyIncluded = activeSubjects
      .filter((subject) => Number(customQuotas[subject.id] || 0) > 0)
      .map((subject) => subject.id);
    const targetIds = currentlyIncluded.length > 0 ? currentlyIncluded : DEFAULT_SELECTED_IDS;
    const suggestion = distributeEvenly(activeSubjects, numericTotal, targetIds);
    if (!suggestion.valid) {
      setCustomBalanceError('Não há questões suficientes nas disciplinas atuais. Inclua mais disciplinas ou reduza o total.');
      return;
    }
    setCustomQuotas(suggestion.allocations);
    setCustomConfigured(true);
    setCustomBalanceError('');
  }

  function startExam() {
    setStartError('');
    if (!canStart) return;
    try {
      const generated = generateSimulatedExam(activeSubjects, displayedQuotas);
      if (generated.length !== numericTotal) throw new Error('O número de questões geradas não corresponde ao total escolhido.');
      const start = Date.now();
      finishedRef.current = false;
      setExamQuestions(generated);
      setAnswers({});
      setCurrentIndex(0);
      setJumpInput('1');
      setStartedAt(start);
      setFinishedAt(null);
      setNow(start);
      setConfirmFinish(false);
      setEndedByTimer(false);
      setReviewOpen(false);
      setPhase('running');
    } catch (error) {
      setStartError(error.message || 'Não foi possível montar este simulado. Revise a distribuição e tente novamente.');
    }
  }

  function goToQuestion(index) {
    if (!examQuestions.length) return;
    const nextIndex = Math.min(Math.max(index, 0), examQuestions.length - 1);
    setCurrentIndex(nextIndex);
    setJumpInput(String(nextIndex + 1));
  }

  function goToEnteredQuestion() {
    const requested = Number(jumpInput);
    if (!Number.isInteger(requested) || requested < 1 || requested > examQuestions.length) {
      setJumpInput(String(currentIndex + 1));
      return;
    }
    goToQuestion(requested - 1);
  }

  function createAnotherExam() {
    finishedRef.current = false;
    setPhase('setup');
    setExamQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setJumpInput('1');
    setStartedAt(null);
    setFinishedAt(null);
    setNow(Date.now());
    setConfirmFinish(false);
    setEndedByTimer(false);
    setReviewOpen(false);
    setStartError('');
  }

  if (phase === 'running' && runningQuestion) {
    const question = runningQuestion.question;
    const promptImages = (question.images || []).filter((image) => image.location !== 'option' && imageSource(image));
    const selectedOption = answers[currentIndex] || '';
    const progressPercent = (answeredCount / examQuestions.length) * 100;

    return (
      <div className="simulados-page simulated-session">
        <div className="sim-session-heading">
          <div>
            <span className="sim-eyebrow">SIMULADO EM ANDAMENTO</span>
            <h1>Concentre-se na prova</h1>
            <p>{formatNumber(answeredCount)} de {formatNumber(examQuestions.length)} questões respondidas · respostas não são reveladas até finalizar.</p>
          </div>
          <div className={`sim-clock ${timeLeft !== null && timeLeft <= 5 * 60_000 ? 'sim-clock-warning' : ''}`} aria-label={timeLeft === null ? `Tempo decorrido ${formatClock(elapsed)}` : `Tempo restante ${formatClock(timeLeft)}`}>
            <Clock3 />
            <span>{timeLeft === null ? 'Tempo decorrido' : 'Tempo restante'}</span>
            <strong aria-live="off">{formatClock(timeLeft === null ? elapsed : timeLeft)}</strong>
          </div>
        </div>

        <div className="sim-overall-progress" aria-label={`${Math.round(progressPercent)}% das questões respondidas`}>
          <div><span>Progresso</span><b>{Math.round(progressPercent)}%</b></div>
          <i><span style={{ width: `${progressPercent}%` }} /></i>
        </div>

        <div className="sim-session-layout">
          <section className="sim-question-card" aria-labelledby="sim-question-prompt">
            <div className="sim-question-meta">
              <span>QUESTÃO {formatNumber(currentIndex + 1)} <i>DE</i> {formatNumber(examQuestions.length)}</span>
              <span className="sim-discipline-chip"><BookOpen />{runningQuestion.disciplineName}</span>
            </div>
            <div className="sim-question-progress"><i style={{ width: `${((currentIndex + 1) / examQuestions.length) * 100}%` }} /></div>
            {(question.answerStatus || question.legalUpdateNote) && (
              <aside className={`sim-provenance ${question.legalUpdateNote ? 'has-warning' : ''}`}>
                {question.answerStatus && <p><strong>Gabarito informado:</strong> {question.answerStatus}</p>}
                {question.legalUpdateNote && <p role="note"><strong>Aviso de atualização legislativa:</strong> {question.legalUpdateNote}</p>}
              </aside>
            )}
            <h2 id="sim-question-prompt">{question.prompt}</h2>
            {promptImages.length > 0 && <div className="sim-question-images" aria-label="Figuras e diagramas da questão">{promptImages.map((image, imageIndex) => <figure key={`${image.src || image.path || imageIndex}-${imageIndex}`}><img src={imageSource(image)} alt={image.alt || `Imagem ${imageIndex + 1} da questão`} loading="lazy" decoding="async" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>}
            <div className="sim-answer-options" role="group" aria-label="Alternativas">
              {Object.entries(question.options || {}).map(([key, value]) => {
                const optionImages = (question.images || []).filter((image) => image.location === 'option' && image.optionKey === key && imageSource(image));
                return <button key={key} type="button" aria-pressed={selectedOption === key} className={`sim-answer-option ${selectedOption === key ? 'chosen' : ''} ${optionImages.length > 0 ? 'has-image' : ''}`} onClick={() => setAnswers((current) => ({ ...current, [currentIndex]: key }))}>
                  <span className="sim-option-letter">{key}</span>
                  <span className="sim-option-copy">{optionText(value)}{optionImages.length > 0 && <span className="sim-option-images">{optionImages.map((image, imageIndex) => <img key={`${image.src || image.path || imageIndex}-${imageIndex}`} src={imageSource(image)} alt={image.alt || `Figura da alternativa ${key}`} loading="lazy" decoding="async" />)}</span>}</span>
                  {selectedOption === key && <CheckCircle2 aria-hidden="true" />}
                </button>;
              })}
            </div>
            <p className="sim-selection-status" aria-live="polite">{selectedOption ? `Alternativa ${selectedOption} marcada. Você pode alterá-la antes de finalizar.` : 'Nenhuma alternativa marcada nesta questão.'}</p>
            <div className="sim-question-controls">
              <button type="button" className="sim-secondary-button" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}><ArrowLeft />Anterior</button>
              <span>{selectedOption ? 'Resposta marcada' : 'Em branco'}</span>
              <button type="button" className="sim-secondary-button" onClick={() => goToQuestion(currentIndex + 1)} disabled={currentIndex === examQuestions.length - 1}>Próxima<ArrowRight /></button>
            </div>
          </section>

          <aside className="sim-session-tools">
            <section className="sim-session-panel">
              <div className="sim-session-panel-heading"><span><ListChecks />NAVEGAÇÃO</span><small>{formatNumber(answeredCount)} respondidas</small></div>
              <p>Use os botões para percorrer a prova ou vá direto a uma questão.</p>
              <form className="sim-jump-form" onSubmit={(event) => { event.preventDefault(); goToEnteredQuestion(); }}>
                <label htmlFor="sim-jump-question">Ir para questão</label>
                <div><input id="sim-jump-question" type="number" min="1" max={examQuestions.length} step="1" value={jumpInput} onChange={(event) => setJumpInput(event.target.value)} /><button type="submit">Ir</button></div>
                <small>De 1 a {formatNumber(examQuestions.length)}</small>
              </form>
              <div className="sim-answered-summary"><span><i className="answered-dot" />Respondidas</span><b>{formatNumber(answeredCount)}</b><span><i className="blank-dot" />Em branco</span><b>{formatNumber(examQuestions.length - answeredCount)}</b></div>
            </section>
            <section className="sim-finish-panel">
              <ShieldCheck />
              <h2>Pronto para encerrar?</h2>
              <p>Ao finalizar, suas respostas serão corrigidas e a nota aparecerá na tela de resultado.</p>
              <button ref={finishTriggerRef} className="sim-finish-button" type="button" onClick={() => setConfirmFinish(true)}>Finalizar simulado</button>
            </section>
          </aside>
        </div>

        {confirmFinish && <div className="sim-dialog-backdrop">
          <section ref={finishDialogRef} className="sim-finish-dialog" role="dialog" aria-modal="true" aria-labelledby="sim-finish-title" tabIndex={-1}>
            <button className="sim-dialog-close" type="button" aria-label="Continuar o simulado" onClick={closeFinishDialog}><X /></button>
            <div className="sim-dialog-icon"><CircleAlert /></div>
            <span className="sim-eyebrow">CONFIRMAÇÃO</span>
            <h2 id="sim-finish-title">Finalizar agora?</h2>
            <p>Você respondeu {formatNumber(answeredCount)} de {formatNumber(examQuestions.length)} questões. As {formatNumber(examQuestions.length - answeredCount)} restantes ficarão em branco.</p>
            <div className="sim-dialog-actions">
              <button ref={continueExamRef} type="button" className="sim-secondary-button" onClick={closeFinishDialog}>Continuar prova</button>
              <button type="button" className="sim-finish-button" onClick={() => finishExam()}>Ver minha nota</button>
            </div>
          </section>
        </div>}
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="simulados-page simulated-result-page">
        <header className="sim-result-heading">
          <span className="sim-eyebrow">RESULTADO FINAL</span>
          <h1 ref={resultHeadingRef} tabIndex={-1}>{endedByTimer ? 'O tempo acabou' : 'Simulado concluído'}</h1>
          <p>{endedByTimer ? 'Seu resultado foi calculado com as respostas marcadas até o fim do tempo.' : 'Veja sua nota, os acertos e o desempenho por disciplina.'}</p>
        </header>
        <section className="sim-result-overview">
          <div className="sim-grade-card">
            <div className="sim-grade-icon"><Trophy /></div>
            <span>NOTA DO SIMULADO</span>
            <strong>{formatDecimal(score.grade)}<small> / 10</small></strong>
            <div className="sim-grade-meter"><i style={{ width: `${score.accuracy}%` }} /></div>
            <b>{formatDecimal(score.accuracy)}% de aproveitamento</b>
          </div>
          <div className="sim-result-stats">
            <div><span><ListChecks />Questões</span><strong>{formatNumber(score.total)}</strong></div>
            <div><span><CheckCircle2 />Acertos</span><strong className="sim-stat-correct">{formatNumber(score.correct)}</strong></div>
            <div><span><CircleAlert />Erros</span><strong className="sim-stat-wrong">{formatNumber(score.incorrect)}</strong></div>
            <div><span><Clock3 />Em branco</span><strong>{formatNumber(score.unanswered)}</strong></div>
            <div className="sim-elapsed-stat"><span>Tempo utilizado</span><strong>{formatClock(elapsed)}</strong></div>
          </div>
        </section>

        <section className="sim-result-breakdown">
          <div className="sim-result-section-heading"><div><span>DESEMPENHO</span><h2>Resultado por disciplina</h2></div><Target /></div>
          <div className="sim-breakdown-list">{score.byDiscipline.map((item) => <article className="sim-breakdown-row" key={item.disciplineId}>
            <div className="sim-breakdown-title"><strong>{item.disciplineName}</strong><span>{item.correct} de {item.total} acertos · {formatDecimal(item.accuracy)}%</span></div>
            <i><b style={{ width: `${item.accuracy}%` }} /></i>
          </article>)}</div>
        </section>

        {reviewItems.length > 0 && <section className="sim-review-section">
          <button className="sim-review-toggle" type="button" aria-expanded={reviewOpen} onClick={() => setReviewOpen((value) => !value)}>
            <span><CircleAlert />Revisar questões erradas ou em branco <small>{formatNumber(reviewItems.length)}</small></span>
            <span>{reviewOpen ? 'Ocultar' : 'Abrir revisão'}</span>
          </button>
          {reviewOpen && <div className="sim-review-list">{reviewItems.map(({ entry, index, chosen }) => {
            const question = entry.question;
            return <details className="sim-review-item" key={`${entry.disciplineId}:${question.id}`}>
              <summary><span>Questão {formatNumber(index + 1)} · {entry.disciplineName}</span><b className={chosen ? 'review-wrong' : 'review-blank'}>{chosen ? 'Errada' : 'Em branco'}</b></summary>
              <p className="sim-review-prompt">{question.prompt}</p>
              <p>Sua resposta: <strong>{chosen || 'Não respondida'}</strong> · Correta: <strong>{question.answer}</strong></p>
              {question.comment && <p className="sim-review-comment">{question.comment}</p>}
              {question.source && <small>Fonte: {question.source}</small>}
            </details>;
          })}</div>}
        </section>}

        <div className="sim-result-actions"><button type="button" className="sim-restart-button" onClick={createAnotherExam}><RotateCcw />Criar outro simulado</button></div>
        <p className="sim-privacy-note"><ShieldCheck />Resultado calculado nesta sessão; as respostas não foram adicionadas ao histórico persistente de questões.</p>
      </div>
    );
  }

  return (
    <div className="simulados-page">
      <header className="sim-hero">
        <div className="sim-hero-copy">
          <span className="sim-eyebrow">TREINO PERSONALIZADO · {formatNumber(availableQuestionTotal)} QUESTÕES INTEGRADAS</span>
          <h1>Monte um simulado<br /><em>do seu jeito.</em></h1>
          <p>Escolha o tamanho da prova, distribua questões entre as disciplinas e defina seu tempo. A nota aparece quando você finalizar.</p>
        </div>
        <div className="sim-hero-mark" aria-hidden="true"><div><Target /><b>N</b></div><span>PROVA</span></div>
      </header>

      <div className="sim-builder-layout">
        <div className="sim-builder-main">
          <section className="sim-config-card sim-total-card">
            <div className="sim-card-title"><div className="sim-card-icon"><ListChecks /></div><div><span>01 · TAMANHO DA PROVA</span><h2>Quantas questões?</h2></div></div>
            <label className="sim-total-field" htmlFor="sim-total-questions"><span>Total de questões</span><div><input id="sim-total-questions" type="number" min="1" max={availableQuestionTotal} step="1" value={totalQuestions} onChange={(event) => setTotalQuestions(event.target.value === '' ? '' : Number(event.target.value))} /><small>máx. {formatNumber(availableQuestionTotal)}</small></div></label>
            <div className="sim-quick-totals" aria-label="Atalhos de total de questões">{[10, 20, 50, 100].map((amount) => <button type="button" key={amount} className={Number(totalQuestions) === amount ? 'selected' : ''} onClick={() => setTotalQuestions(amount)}>{amount} questões</button>)}</div>
          </section>

          <section className="sim-config-card sim-duration-card">
            <div className="sim-card-title"><div className="sim-card-icon"><Clock3 /></div><div><span>02 · TEMPO</span><h2>Quanto tempo você terá?</h2></div></div>
            <div className="sim-duration-modes" role="group" aria-label="Modo de duração do simulado">
              <button type="button" className={durationMode === 'timed' ? 'selected' : ''} aria-pressed={durationMode === 'timed'} onClick={() => setDurationMode('timed')}><Clock3 /><span>Com tempo</span><small>Relógio regressivo</small></button>
              <button type="button" className={durationMode === 'unlimited' ? 'selected' : ''} aria-pressed={durationMode === 'unlimited'} onClick={() => setDurationMode('unlimited')}><ShieldCheck /><span>Sem limite</span><small>Faça no seu ritmo</small></button>
            </div>
            {durationMode === 'timed' && <div className="sim-duration-input-wrap">
              <label htmlFor="sim-duration-minutes">Duração em minutos</label>
              <div className="sim-duration-input"><input id="sim-duration-minutes" type="number" min="1" max={DURATION_LIMIT_MINUTES} step="1" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value === '' ? '' : Number(event.target.value))} /><span>min</span></div>
              <div className="sim-duration-presets">{[30, 60, 90, 120].map((minutes) => <button type="button" key={minutes} className={Number(durationMinutes) === minutes ? 'selected' : ''} onClick={() => setDurationMinutes(minutes)}>{minutes} min</button>)}</div>
              <small>Personalize de 1 a {DURATION_LIMIT_MINUTES} minutos ou use um dos tempos sugeridos.</small>
            </div>}
          </section>

          <section className="sim-config-card sim-disciplines-card">
            <div className="sim-card-title sim-disciplines-title"><div className="sim-card-icon"><BookOpen /></div><div><span>03 · DISTRIBUIÇÃO</span><h2>Escolha as disciplinas</h2><p>Use uma divisão equilibrada ou determine a quantidade exata por matéria.</p></div></div>
            <div className="sim-distribution-modes" role="group" aria-label="Tipo de distribuição das questões">
              <button type="button" className={distributionMode === 'balanced' ? 'selected' : ''} aria-pressed={distributionMode === 'balanced'} onClick={() => enterDistributionMode('balanced')}><strong>Equilibrada</strong><small>Distribui o total igualmente entre as disciplinas marcadas.</small></button>
              <button type="button" className={distributionMode === 'custom' ? 'selected' : ''} aria-pressed={distributionMode === 'custom'} onClick={() => enterDistributionMode('custom')}><strong>Personalizada</strong><small>Defina quantas questões deseja em cada disciplina.</small></button>
            </div>

            {distributionMode === 'balanced' ? <>
              <div className="sim-discipline-list">{activeSubjects.map((subject) => {
                const checked = selectedDisciplineIds.includes(subject.id);
                const count = automaticPlan.allocations[subject.id] || 0;
                return <label className={`sim-discipline-option ${checked ? 'included' : ''}`} key={subject.id}>
                  <input type="checkbox" checked={checked} onChange={(event) => updateSelectedDiscipline(subject.id, event.target.checked)} />
                  <span className="sim-discipline-check" aria-hidden="true"><CheckCircle2 /></span>
                  <span className="sim-discipline-copy"><strong>{subject.name}</strong><small>{formatNumber(subject.questions.length)} questões no banco</small></span>
                  <span className="sim-allocation-badge"><b>{formatNumber(count)}</b><small>{count === 1 ? 'questão' : 'questões'}</small></span>
                </label>;
              })}</div>
              <p className="sim-distribution-hint">Os números são uma sugestão equilibrada para o total atual; a seleção é feita sem repetir questões.</p>
            </> : <>
              <div className="sim-custom-toolbar"><span>Informe a quantidade desejada em cada disciplina.</span><button type="button" onClick={balanceCustomQuotas}><RotateCcw />Distribuir igualmente</button></div>
              <div className="sim-custom-list">{activeSubjects.map((subject) => {
                const amount = Number(customQuotas[subject.id] || 0);
                return <div className={`sim-custom-discipline ${amount > 0 ? 'included' : ''}`} key={subject.id}>
                  <div className="sim-discipline-copy"><strong>{subject.name}</strong><small>{formatNumber(subject.questions.length)} questões disponíveis</small></div>
                  <label className="sim-quota-input" htmlFor={`quota-${subject.id}`}><span className="sr-only">Quantidade de questões de {subject.name}</span><input id={`quota-${subject.id}`} type="number" min="0" max={subject.questions.length} step="1" value={customQuotas[subject.id] ?? 0} onChange={(event) => updateCustomQuota(subject.id, event.target.value)} /></label>
                </div>;
              })}</div>
              <div className={`sim-quota-total ${customPlan.sum === numericTotal ? 'matches' : 'mismatch'}`}>
                <span>Soma das disciplinas</span><strong>{formatNumber(customPlan.sum)} <i>/</i> {formatNumber(Number.isFinite(numericTotal) ? numericTotal : 0)}</strong>
                {Number.isInteger(numericTotal) && customPlan.sum !== numericTotal && <button type="button" onClick={() => setTotalQuestions(customPlan.sum)}>Usar {formatNumber(customPlan.sum)} como total</button>}
              </div>
              {customBalanceError && <p className="sim-inline-error" role="alert">{customBalanceError}</p>}
            </>}
          </section>
        </div>

        <aside className="sim-builder-summary">
          <div className="sim-summary-kicker"><Target />RESUMO DA PROVA</div>
          <h2>Seu simulado</h2>
          <div className="sim-summary-stat"><span>Questões</span><strong>{Number.isInteger(numericTotal) && numericTotal > 0 ? formatNumber(numericTotal) : '—'}</strong></div>
          <div className="sim-summary-stat"><span>Disciplinas incluídas</span><strong>{formatNumber(includedCount)}</strong></div>
          <div className="sim-summary-stat"><span>Distribuição</span><strong>{distributionMode === 'balanced' ? 'Equilibrada' : 'Personalizada'}</strong></div>
          <div className="sim-summary-stat"><span>Tempo</span><strong>{durationMode === 'unlimited' ? 'Sem limite' : Number(durationMinutes) > 0 ? `${formatNumber(durationMinutes)} min` : '—'}</strong></div>
          <div className="sim-summary-divider" />
          <div className="sim-summary-question-total"><span>Questões distribuídas</span><strong>{formatNumber(allocatedTotal)}</strong></div>
          {setupErrors.length > 0 && <div className="sim-validation-errors" role="alert"><strong><CircleAlert />Revise a configuração</strong><ul>{setupErrors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
          {startError && <p className="sim-inline-error" role="alert">{startError}</p>}
          <button type="button" className="sim-start-button" onClick={startExam} disabled={!canStart}><Play />Iniciar simulado</button>
          <p className="sim-summary-note"><ShieldCheck />A nota é calculada ao finalizar. As respostas não alteram seu histórico de estudo.</p>
        </aside>
      </div>
      <p className="sim-source-note">As questões são sorteadas dos bancos integrados do NEXUS ACADEMY, sem repetição dentro do simulado. O resultado permanece nesta sessão.</p>
    </div>
  );
}

export default SimuladosPage;
