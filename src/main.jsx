import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardList,
  LayoutDashboard,
  Library,
  Menu,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from 'lucide-react';
import DisciplineModule from './components/DisciplineModule.jsx';
import InstallPwaButton from './components/InstallPwaButton.jsx';
import rlmSubject from './data/subjects/raciocinio-logico.js';
import informaticaSubject from './data/subjects/informatica.js';
import portuguesSubject from './data/subjects/portugues.js';
import './styles.css';
import './readability.css';

const disciplines = [
  'Português',
  'Informática',
  'Raciocínio Lógico',
  'Criminologia',
  'Direito Penal',
  'Processo Penal',
  'Direito Constitucional',
  'Direito Administrativo',
  'Direitos Humanos',
  'Ciências Forenses',
];

const subjectsByName = {
  Português: portuguesSubject,
  'Raciocínio Lógico': rlmSubject,
  Informática: informaticaSubject,
};

const questionCounts = Object.fromEntries(
  disciplines.map((discipline) => [discipline, subjectsByName[discipline]?.questions.length || 0]),
);

function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  const register = () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch(() => {});
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
}

function App() {
  const [disciplinesOpen, setDisciplinesOpen] = useState(true);
  const [questionsOpen, setQuestionsOpen] = useState(true);
  const [active, setActive] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  function navigate(page) {
    setActive(page);
    setMobileMenuOpen(false);
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">N</div>
          <div>
            <b>NEXUS</b>
            <small>ACADEMY</small>
          </div>
          <button
            className="close-mobile"
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="side-scroll">
          <div className="nav-label">NÚCLEO</div>
          <button
            className={`nav-item ${active === 'Dashboard' ? 'active' : ''}`}
            type="button"
            onClick={() => navigate('Dashboard')}
          >
            <LayoutDashboard />Dashboard
          </button>
          <button className="nav-parent" type="button" onClick={() => setDisciplinesOpen(!disciplinesOpen)}>
            <span><BookOpen />Disciplinas</span>
            {disciplinesOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {disciplinesOpen && (
            <div className="submenu">
              {disciplines.map((discipline, index) => (
                <button
                  key={discipline}
                  className={active === discipline ? 'sub-active' : ''}
                  type="button"
                  onClick={() => navigate(discipline)}
                >
                  <span className="num">{String(index + 1).padStart(2, '0')}</span>
                  {discipline}
                </button>
              ))}
            </div>
          )}

          <button className="nav-parent" type="button" onClick={() => setQuestionsOpen(!questionsOpen)}>
            <span><ClipboardList />Questões</span>
            {questionsOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {questionsOpen && (
            <div className="submenu">
              {disciplines.map((discipline) => (
                <button
                  key={discipline}
                  className={active === `Q:${discipline}` ? 'sub-active' : ''}
                  type="button"
                  onClick={() => navigate(`Q:${discipline}`)}
                >
                  <span className="qnum">{questionCounts[discipline]}</span>
                  {discipline}
                </button>
              ))}
            </div>
          )}

          <div className="nav-label second">ESTUDO</div>
          {[
            [Brain, 'Flashcards'],
            [RotateCcw, 'Revisão'],
            [Target, 'Simulados'],
            [Library, 'Biblioteca'],
            [BarChart3, 'Desempenho'],
            [Star, 'Favoritos'],
          ].map(([Icon, label]) => (
            <button
              key={label}
              className={`nav-item ${active === label ? 'active' : ''}`}
              type="button"
              onClick={() => navigate(label)}
            >
              <Icon />{label}
            </button>
          ))}
        </div>

        <div className="side-bottom">
          <div className="status">
            <div>
              <span><Zap />Sessão de estudo</span>
              <b>0%</b>
            </div>
            <div className="progress"><i /></div>
            <small>Seu progresso aparecerá aqui</small>
          </div>
          <button className="nav-item" type="button" onClick={() => navigate('Configurações')}>
            <Settings />Configurações
          </button>
          <div className="profile">
            <div>JP</div>
            <span><b>Meu perfil</b><small>Conta pessoal</small></span>
            <ChevronRight />
          </div>
        </div>
      </aside>

      <main className="main">
        <header>
          <button
            className="mobile-menu"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu />
          </button>
          <div className="crumb">
            <span>NEXUS ACADEMY</span>
            <ChevronRight />
            <b>{active.startsWith('Q:') ? 'Questões' : active}</b>
          </div>
          <div className="actions">
            <InstallPwaButton />
            <label>
              <Search />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no NEXUS..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="bell" type="button" aria-label="Notificações">
              <Bell />
              <i />
            </button>
          </div>
        </header>

        <div className="content">
          {active === 'Dashboard' ? <Dashboard navigate={navigate} /> : <Generic active={active} />}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ navigate }) {
  return (
    <div className="dashboard">
      <section className="hero">
        <div>
          <span className="eyebrow"><i />AMBIENTE DE ESTUDOS</span>
          <h1>Seu conhecimento.<br /><em>Seu próximo nível.</em></h1>
          <p>Uma central inteligente para organizar disciplinas, questões, revisões e sua evolução nos concursos.</p>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={() => navigate('Disciplinas')}>
              <BookOpen />Explorar disciplinas
            </button>
            <button className="ghost" type="button" onClick={() => navigate('Simulados')}>
              Começar um simulado<ArrowUpRight />
            </button>
          </div>
        </div>
        <div className="orbit" aria-hidden="true">
          <div className="ring a" />
          <div className="ring b" />
          <div className="core"><Sparkles /><b>N</b></div>
          <span className="node na">FOCO</span>
          <span className="node nb">REVISÃO</span>
          <span className="node nc">QUESTÕES</span>
        </div>
      </section>

      <div className="section-head">
        <div><span>VISÃO GERAL</span><h2>Painel de estudos</h2></div>
        <b><ShieldCheck />SISTEMA PRONTO PARA EXPANSÃO</b>
      </div>

      <section className="metrics">
        <Metric Icon={BookOpen} title="Disciplinas" value="10" note="áreas cadastradas" />
        <Metric Icon={ClipboardList} title="Questões" value={String(rlmSubject.questions.length)} note="questões de RLM integradas" />
        <Metric Icon={Target} title="Simulados" value="0" note="nenhum realizado" />
        <Metric Icon={BarChart3} title="Aproveitamento" value="—" note="aguardando dados" />
      </section>

      <section className="lower">
        <div className="panel">
          <PanelHeading kicker="ARQUITETURA" title="Seu ambiente de estudos" />
          {[
            ['01', 'Disciplinas', 'Conteúdo organizado por matéria e tópico.', 'Em expansão'],
            ['02', 'Questões', 'Banco separado por disciplina, tema e origem.', 'RLM integrado'],
            ['03', 'Revisão inteligente', 'Flashcards, erros e ciclos de revisão.', 'Próxima fase'],
            ['04', 'Desempenho', 'Métricas para descobrir onde evoluir.', 'Próxima fase'],
          ].map(([number, title, description, status]) => (
            <div className="road" key={number}>
              <strong>{number}</strong>
              <div><b>{title}</b><p>{description}</p></div>
              <small>{status}</small>
            </div>
          ))}
        </div>

        <div className="panel">
          <PanelHeading kicker="ACESSO RÁPIDO" title="Continuar estudo" />
          <QuickAccess Icon={BookOpen} title="Escolher disciplina" subtitle="Navegue pelas matérias" onClick={() => navigate('Raciocínio Lógico')} />
          <QuickAccess Icon={ClipboardList} title="Resolver questões" subtitle="Banco de Raciocínio Lógico" onClick={() => navigate('Q:Raciocínio Lógico')} />
          <QuickAccess Icon={Brain} title="Flashcards" subtitle="Revisões rápidas e direcionadas" onClick={() => navigate('Flashcards')} />
          <div className="empty"><Circle />Conteúdo e histórico ficam disponíveis na área da disciplina.</div>
        </div>
      </section>
    </div>
  );
}

function Metric({ Icon, title, value, note }) {
  return (
    <div className="metric">
      <div><Icon /></div>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function PanelHeading({ kicker, title }) {
  return <div className="panel-head"><div><span>{kicker}</span><h3>{title}</h3></div><i>BASE</i></div>;
}

function QuickAccess({ Icon, title, subtitle, onClick }) {
  return (
    <button className="quick" type="button" onClick={onClick}>
      <div><Icon /></div>
      <span><b>{title}</b><small>{subtitle}</small></span>
      <ArrowUpRight />
    </button>
  );
}

function Generic({ active }) {
  const isQuestionBank = active.startsWith('Q:');
  const title = isQuestionBank ? active.slice(2) : active;

  if (title === 'Raciocínio Lógico') {
    return <DisciplineModule subject={rlmSubject} defaultSection={isQuestionBank ? 'questions' : 'content'} />;
  }
  if (title === 'Informática') {
    return <DisciplineModule subject={informaticaSubject} defaultSection={isQuestionBank ? 'questions' : 'content'} />;
  }
  if (title === 'Português') {
    return <DisciplineModule subject={portuguesSubject} defaultSection={isQuestionBank ? 'questions' : 'content'} />;
  }

  return (
    <div className="generic">
      <div className="generic-icon">{isQuestionBank ? <ClipboardList /> : <BookOpen />}</div>
      <span>{isQuestionBank ? 'BANCO DE QUESTÕES' : 'MÓDULO'}</span>
      <h1>{title}</h1>
      <p>A interface desta área já está preparada. O conteúdo e as funcionalidades serão conectados nas próximas etapas do NEXUS ACADEMY.</p>
      <div><Sparkles />Estrutura visual pronta para receber conteúdo</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
registerServiceWorker();
