import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardList,
  Download,
  LayoutDashboard,
  Library,
  Menu,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from 'lucide-react';
import DisciplineModule from './components/DisciplineModule.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import HistoryTools from './components/HistoryTools.jsx';
import InstallPwaButton from './components/InstallPwaButton.jsx';
import { activeSubjects, availableQuestionTotal, developmentDisciplines, plannedDisciplines, subjectByName } from './data/subjectRegistry.js';
import { readAnswerHistory, summarizeAnswerHistory } from './lib/answerHistory.js';
import './styles.css';
import './readability.css';
import './features.css';

const studyFeatures = [
  [Brain, 'Flashcards'],
  [RotateCcw, 'Revisão'],
  [Target, 'Simulados'],
  [Library, 'Biblioteca'],
  [BarChart3, 'Desempenho'],
  [Star, 'Favoritos'],
];

function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const register = () => {
    const workerUrl = `${import.meta.env.BASE_URL}sw.js?v=${__NEXUS_BUILD_ID__}`;
    navigator.serviceWorker.register(workerUrl, {
      scope: import.meta.env.BASE_URL,
      updateViaCache: 'none',
    }).catch(() => {});
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

function App() {
  const [disciplinesOpen, setDisciplinesOpen] = useState(true);
  const [developmentOpen, setDevelopmentOpen] = useState(false);
  const [plannedOpen, setPlannedOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(true);
  const [active, setActive] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  function navigate(page) {
    setActive(page);
    setViewTarget(null);
    setMobileMenuOpen(false);
    setSearchExpanded(false);
  }

  function openSearchResult(result) {
    setActive(result.mode === 'questions' ? `Q:${result.subjectName}` : result.subjectName);
    setViewTarget({
      id: result.id,
      navigationKey: `${result.id}-${Date.now()}`,
      mode: result.mode,
      topicId: result.topicId,
      subtopicId: result.subtopicId,
      questionId: result.questionId,
    });
    setMobileMenuOpen(false);
    setSearchExpanded(false);
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">N</div>
          <div><b>NEXUS</b><small>ACADEMY</small></div>
          <button className="close-mobile" type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu"><X size={19} /></button>
        </div>

        <div className="side-scroll">
          <div className="nav-label">NÚCLEO</div>
          <button className={`nav-item ${active === 'Dashboard' ? 'active' : ''}`} type="button" onClick={() => navigate('Dashboard')}><LayoutDashboard />Dashboard</button>
          <button className="nav-parent" type="button" onClick={() => setDisciplinesOpen(!disciplinesOpen)} aria-expanded={disciplinesOpen}>
            <span><BookOpen />Disciplinas</span>{disciplinesOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {disciplinesOpen && <div className="submenu">
            {activeSubjects.map((subject, index) => (
              <button key={subject.id} className={active === subject.name ? 'sub-active' : ''} type="button" onClick={() => navigate(subject.name)}>
                <span className="num">{String(index + 1).padStart(2, '0')}</span>{subject.name}<span className="nav-status available">Disponível</span>
              </button>
            ))}
          </div>}
          {developmentDisciplines.length > 0 && <>
          <button className="nav-parent secondary-parent" type="button" onClick={() => setDevelopmentOpen(!developmentOpen)} aria-expanded={developmentOpen}>
            <span><Sparkles />Em desenvolvimento</span>{developmentOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {developmentOpen && <div className="submenu">
            {developmentDisciplines.map((name) => <button key={name} className={active === name ? 'sub-active' : ''} type="button" onClick={() => navigate(name)}><span className="num">—</span>{name}<span className="nav-status development">Em desenvolvimento</span></button>)}
          </div>}
          </>}
          <button className="nav-parent secondary-parent" type="button" onClick={() => setPlannedOpen(!plannedOpen)} aria-expanded={plannedOpen}>
            <span><Library />Planejadas</span>{plannedOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {plannedOpen && <div className="submenu">
            {plannedDisciplines.map((name) => <button key={name} className={active === name ? 'sub-active' : ''} type="button" onClick={() => navigate(name)}><span className="num">—</span>{name}<span className="nav-status planned">Planejada</span></button>)}
          </div>}

          <button className="nav-parent" type="button" onClick={() => setQuestionsOpen(!questionsOpen)} aria-expanded={questionsOpen}>
            <span><ClipboardList />Questões</span>{questionsOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {questionsOpen && <div className="submenu">
            {activeSubjects.map((subject) => <button key={subject.id} className={active === `Q:${subject.name}` ? 'sub-active' : ''} type="button" onClick={() => navigate(`Q:${subject.name}`)}><span className="qnum">{subject.questions.length}</span>{subject.name}</button>)}
          </div>}

          <div className="nav-label second">ESTUDO</div>
          {studyFeatures.map(([Icon, label]) => (
            <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} type="button" onClick={() => navigate(label)}>
              <Icon />{label}{label !== 'Desempenho' && <span className="nav-status planned">Planejado</span>}
            </button>
          ))}
        </div>

        <div className="side-bottom">
          <StudySessionStatus />
          <button className={`nav-item ${active === 'Configurações' ? 'active' : ''}`} type="button" onClick={() => navigate('Configurações')}><Settings />Configurações</button>
          <div className="profile"><div>JP</div><span><b>Meu perfil</b><small>Dados apenas neste dispositivo</small></span></div>
        </div>
      </aside>

      <main className="main">
        <header>
          <button className="mobile-menu" type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <div className="crumb"><span>NEXUS ACADEMY</span><ChevronRight /><b>{active.startsWith('Q:') ? `Questões · ${active.slice(2)}` : active}</b></div>
          <div className="actions">
            <InstallPwaButton />
            <GlobalSearch subjects={activeSubjects} developmentDisciplines={developmentDisciplines} plannedDisciplines={plannedDisciplines} value={query} onChange={setQuery} onSelect={openSearchResult} expanded={searchExpanded} onToggleExpanded={() => setSearchExpanded((value) => !value)} />
            <button className="bell" type="button" disabled aria-label="Notificações ainda não disponíveis" title="Notificações ainda não disponíveis"><span aria-hidden="true">•</span></button>
          </div>
        </header>

        <div className="content">
          {active === 'Dashboard' || active === 'Desempenho'
            ? <Dashboard navigate={navigate} active={active} />
            : <Generic active={active} initialTarget={viewTarget} navigate={navigate} />}
        </div>
      </main>
    </div>
  );
}

function StudySessionStatus() {
  const [history, setHistory] = useState(readAnswerHistory);
  useEffect(() => {
    const refresh = () => setHistory(readAnswerHistory());
    window.addEventListener('nexus-history-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nexus-history-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const count = summarizeAnswerHistory(history).attempts;
  return <div className="status"><div><span><Zap />Respostas registradas</span><b>{count}</b></div><div className="progress"><i style={{ width: count ? '100%' : '0%' }} /></div><small>{count ? 'Histórico local deste dispositivo' : 'Responda questões para iniciar'}</small></div>;
}

function Dashboard({ navigate, active }) {
  const [history, setHistory] = useState(readAnswerHistory);
  useEffect(() => {
    const refresh = () => setHistory(readAnswerHistory());
    window.addEventListener('nexus-history-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nexus-history-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const summary = summarizeAnswerHistory(history);
  const ranked = summary.byDiscipline.filter((item) => item.attempts).sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts);
  const best = ranked[0] || null;
  const attention = ranked.length ? ranked[ranked.length - 1] : null;
  const lastActivity = summary.lastActivity ? new Date(summary.lastActivity).toLocaleString('pt-BR') : null;

  return (
    <div className="dashboard">
      <section className="hero">
        <div>
          <span className="eyebrow"><i />AMBIENTE DE ESTUDOS · {activeSubjects.length} DISCIPLINAS INTEGRADAS</span>
          <h1>Seu conhecimento.<br /><em>Seu próximo nível.</em></h1>
          <p>Estude conteúdos e resolva questões das disciplinas conectadas. Seu desempenho é calculado a partir das respostas registradas neste dispositivo.</p>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={() => navigate('Disciplinas')}><BookOpen />Explorar disciplinas</button>
            <button className="ghost" type="button" onClick={() => navigate('Simulados')}>Simulados · planejado<ArrowUpRight /></button>
          </div>
        </div>
        <div className="orbit" aria-hidden="true"><div className="ring a" /><div className="ring b" /><div className="core"><Sparkles /><b>N</b></div><span className="node na">FOCO</span><span className="node nb">CONTEÚDO</span><span className="node nc">QUESTÕES</span></div>
      </section>

      <div className="section-head"><div><span>VISÃO GERAL</span><h2>{active === 'Desempenho' ? 'Seu desempenho' : 'Painel de estudos'}</h2></div><b><ShieldCheck />DADOS LOCAIS · {activeSubjects.length} MÓDULOS DISPONÍVEIS</b></div>

      <section className="metrics" aria-label="Indicadores de estudo">
        <Metric Icon={BookOpen} title="Disciplinas integradas" value={String(activeSubjects.length)} note={`${developmentDisciplines.length} em desenvolvimento · ${plannedDisciplines.length} planejadas`} />
        <Metric Icon={ClipboardList} title="Questões disponíveis" value={availableQuestionTotal.toLocaleString('pt-BR')} note="em módulos integrados" />
        <Metric Icon={Target} title="Questões respondidas" value={summary.attempts.toLocaleString('pt-BR')} note="tentativas locais registradas" />
        <Metric Icon={BarChart3} title="Percentual de acertos" value={summary.accuracy === null ? '—' : `${summary.accuracy.toFixed(1).replace('.', ',')}%`} note={summary.attempts ? `${summary.correct} acertos · ${summary.errors} erros` : 'responda questões para calcular'} />
      </section>

      <section className="dashboard-insights">
        <div className="panel">
          <PanelHeading kicker="DESEMPENHO POR DISCIPLINA" title="Acertos e pontos de atenção" />
          {ranked.length === 0 ? <div className="data-empty"><Circle /><p>Ainda não há respostas registradas. Depois de praticar, os resultados por disciplina aparecerão aqui.</p><button className="small-action" type="button" onClick={() => navigate(`Q:${activeSubjects[0].name}`)}>Começar pela primeira disciplina</button></div> : <>
            <div className="performance-highlight"><span><b>Melhor resultado</b><strong>{best.name}</strong><small>{best.accuracy.toFixed(1).replace('.', ',')}% de acertos · {best.attempts} resposta(s)</small></span><span><b>Precisa de mais atenção</b><strong>{attention.name}</strong><small>{attention.accuracy.toFixed(1).replace('.', ',')}% de acertos · {attention.attempts} resposta(s)</small></span></div>
            <div className="performance-list">{summary.byDiscipline.filter((item) => item.attempts).map((item) => <div className="performance-row" key={item.id}><span>{item.name}</span><i><b style={{ width: `${item.accuracy}%` }} /></i><strong>{item.accuracy.toFixed(1).replace('.', ',')}%</strong><small>{item.correct} acertos · {item.errors} erros</small></div>)}</div>
          </>}
          <div className="last-activity"><ClockLabel />Última atividade: <b>{lastActivity || 'nenhuma resposta registrada'}</b></div>
        </div>
        <div className="panel">
          <PanelHeading kicker="ACESSO E STATUS" title="Continuar estudo" />
          <QuickAccess Icon={BookOpen} title="Disciplinas disponíveis" subtitle={`${activeSubjects.length} módulos integrados`} onClick={() => navigate('Disciplinas')} />
          {activeSubjects.map((subject) => <QuickAccess key={subject.id} Icon={ClipboardList} title={subject.name} subtitle={`${subject.questions.length.toLocaleString('pt-BR')} questões integradas`} onClick={() => navigate(`Q:${subject.name}`)} />)}
          <div className="planned-summary"><Sparkles /><span><b>Próximas etapas</b><small>Flashcards, revisão, simulados e outras disciplinas ainda estão planejados.</small></span></div>
          <button className="history-shortcut" type="button" onClick={() => navigate('Configurações')}><Download />Exportar ou restaurar histórico</button>
        </div>
      </section>
    </div>
  );
}

function ClockLabel() {
  return <span className="clock-label" aria-hidden="true">◷</span>;
}

function Metric({ Icon, title, value, note }) {
  return <div className="metric"><div><Icon /></div><span>{title}</span><strong>{value}</strong><small>{note}</small></div>;
}

function PanelHeading({ kicker, title }) {
  return <div className="panel-head"><div><span>{kicker}</span><h3>{title}</h3></div><i>LOCAL</i></div>;
}

function QuickAccess({ Icon, title, subtitle, onClick }) {
  return <button className="quick" type="button" onClick={onClick}><div><Icon /></div><span><b>{title}</b><small>{subtitle}</small></span><ArrowUpRight /></button>;
}

function DisciplineCatalog({ navigate }) {
  return <section className="catalog-page">
    <div className="catalog-heading"><span>CATÁLOGO DE ESTUDO</span><h1>Disciplinas</h1><p>Os status refletem apenas os conteúdos e bancos de questões atualmente conectados ao aplicativo.</p></div>
    <h2>Disponíveis para estudar <small>{activeSubjects.length}</small></h2>
    <div className="catalog-grid">{activeSubjects.map((subject) => <article className="catalog-card" key={subject.id}><span className="catalog-status available">Disponível</span><h3>{subject.name}</h3><p>{subject.description}</p><div><b>{subject.questions.length.toLocaleString('pt-BR')}</b><span> questões · {subject.topics.length} assuntos</span></div><button className="primary-action" type="button" onClick={() => navigate(subject.name)}>Abrir disciplina<ArrowUpRight /></button></article>)}</div>
    {developmentDisciplines.length > 0 && <>
    <h2 className="planned-title">Em desenvolvimento <small>{developmentDisciplines.length}</small></h2>
    <p className="planned-description">O projeto registra este módulo em andamento, mas ainda não há conteúdo ou banco de questões conectado. Ele não entra nas estatísticas de estudo.</p>
    <div className="planned-grid">{developmentDisciplines.map((name) => <div className="planned-card development-card" key={name}><Sparkles /><span>{name}</span><small>Em desenvolvimento</small></div>)}</div>
    </>}
    <h2 className="planned-title">Planejadas <small>{plannedDisciplines.length}</small></h2>
    <p className="planned-description">Estas disciplinas ainda não têm conteúdo e banco de questões conectados. Não entram nas contagens de estudo.</p>
    <div className="planned-grid">{plannedDisciplines.map((name) => <div className="planned-card" key={name}><BookOpen /><span>{name}</span><small>Planejada</small></div>)}</div>
  </section>;
}

function PlannedModule({ title }) {
  const inDevelopment = developmentDisciplines.includes(title);
  return <section className="planned-module"><span>STATUS DO MÓDULO</span><div><Sparkles /></div><h1>{title}</h1><b>{inDevelopment ? 'Em desenvolvimento' : 'Planejado'}</b><p>{inDevelopment ? 'O projeto registra esta disciplina em andamento, mas ainda não há conteúdo ou banco de questões conectado. Ela não é contabilizada como disponível para estudo.' : 'Esta área ainda não está integrada para estudo. Nenhuma questão ou dado de desempenho é contabilizado aqui. Os conteúdos serão adicionados em uma etapa futura.'}</p></section>;
}

function Generic({ active, initialTarget, navigate }) {
  const isQuestionBank = active.startsWith('Q:');
  const title = isQuestionBank ? active.slice(2) : active;
  const subject = subjectByName.get(title);
  if (subject) return <DisciplineModule subject={subject} defaultSection={isQuestionBank ? 'questions' : 'content'} initialTarget={initialTarget} />;
  if (title === 'Disciplinas') return <DisciplineCatalog navigate={navigate} />;
  if (title === 'Configurações') return <HistoryTools />;
  return <PlannedModule title={title} />;
}

createRoot(document.getElementById('root')).render(<App />);
registerServiceWorker();
