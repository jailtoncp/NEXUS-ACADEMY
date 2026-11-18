import React, { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Layers3, Search } from 'lucide-react';
import { activeSubjects } from '../data/subjectRegistry.js';

function normalizeText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function excerpt(value, maxLength = 190) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

const libraryEntries = activeSubjects.flatMap((subject) => subject.topics.flatMap((topic) => topic.subtopics.map((subtopic) => ({
  id: `${subject.id}:${topic.id}:${subtopic.id}`,
  subject,
  topic,
  subtopic,
  searchText: normalizeText([subject.name, subject.description, topic.title, topic.summary, subtopic.title, subtopic.content].join(' ')),
}))));

const totalTopics = activeSubjects.reduce((total, subject) => total + subject.topics.length, 0);

function openSubtopic(onOpenResult, subject, topic, subtopic) {
  onOpenResult({
    id: subtopic.id,
    mode: 'content',
    subjectName: subject.name,
    topicId: topic.id,
    subtopicId: subtopic.id,
  });
}

export default function LibraryPage({ onOpenResult }) {
  const [query, setQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const searching = Boolean(query.trim()) || disciplineFilter !== 'all';

  const results = useMemo(() => {
    const terms = normalizeText(query).trim().split(/\s+/).filter(Boolean);
    return libraryEntries.filter((entry) => {
      if (disciplineFilter !== 'all' && entry.subject.id !== disciplineFilter) return false;
      return terms.every((term) => entry.searchText.includes(term));
    });
  }, [query, disciplineFilter]);

  return (
    <section className="study-tool-page library-page">
      <div className="study-tool-heading">
        <div>
          <span>CONTEÚDO CONECTADO · BUSCA LOCAL</span>
          <h1>Biblioteca</h1>
          <p>Encontre a teoria por disciplina, assunto ou palavra-chave e continue a leitura exatamente de onde o material começa.</p>
        </div>
        <div className="study-tool-total"><span><Layers3 /></span><strong>{libraryEntries.length.toLocaleString('pt-BR')}</strong><small>subassuntos no acervo</small></div>
      </div>

      <div className="study-tool-toolbar library-toolbar">
        <label className="study-tool-search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">Buscar na Biblioteca</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar disciplina, assunto ou conceito" />
        </label>
        <label className="study-tool-select">
          <span className="visually-hidden">Filtrar por disciplina</span>
          <select value={disciplineFilter} onChange={(event) => setDisciplineFilter(event.target.value)}>
            <option value="all">Todas as disciplinas</option>
            {activeSubjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}
          </select>
        </label>
        <span className="study-tool-result-count">{activeSubjects.length} disciplinas · {totalTopics} assuntos</span>
      </div>

      {searching ? (
        <>
          <div className="study-tool-section-heading"><div><span>RESULTADOS</span><h2>Materiais encontrados</h2></div><small>{results.length.toLocaleString('pt-BR')} {results.length === 1 ? 'subassunto' : 'subassuntos'}</small></div>
          {results.length > 0 ? (
            <div className="library-result-grid">
              {results.slice(0, 60).map(({ id, subject, topic, subtopic }) => (
                <article className="library-result-card" key={id}>
                  <div className="library-result-path"><span>{subject.name}</span><i>›</i><span>{topic.title}</span></div>
                  <h3>{subtopic.title}</h3>
                  <p>{excerpt(subtopic.content || topic.summary)}</p>
                  <button className="small-action" type="button" onClick={() => openSubtopic(onOpenResult, subject, topic, subtopic)}>Abrir na teoria <ArrowUpRight /></button>
                </article>
              ))}
            </div>
          ) : (
            <div className="study-tool-empty compact"><div><Search /></div><h2>Não encontramos esse material</h2><p>Tente outra palavra ou remova o filtro de disciplina.</p><button className="small-action" type="button" onClick={() => { setQuery(''); setDisciplineFilter('all'); }}>Limpar busca</button></div>
          )}
          {results.length > 60 && <p className="library-result-limit">Exibindo os primeiros 60 resultados. Refine a busca para localizar um trecho específico.</p>}
        </>
      ) : (
        <>
          <div className="study-tool-section-heading"><div><span>EXPLORE O ACERVO</span><h2>Disciplinas disponíveis</h2></div><small>{activeSubjects.length} módulos integrados</small></div>
          <div className="library-subject-grid">
            {activeSubjects.map((subject) => {
              const subtopicCount = subject.topics.reduce((total, topic) => total + topic.subtopics.length, 0);
              const firstTopic = subject.topics[0];
              const firstSubtopic = firstTopic?.subtopics[0];
              return (
                <article className="library-subject-card" key={subject.id}>
                  <div className="library-subject-icon"><BookOpen /></div>
                  <span className="library-subject-label">MÓDULO INTEGRADO</span>
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                  <div className="library-subject-stats"><span><b>{subject.topics.length}</b> assuntos</span><span><b>{subtopicCount}</b> subassuntos</span><span><b>{subject.questions.length.toLocaleString('pt-BR')}</b> questões</span></div>
                  <div className="library-subject-topics">
                    {subject.topics.slice(0, 3).map((topic) => {
                      const subtopic = topic.subtopics[0];
                      return subtopic ? <button type="button" key={topic.id} onClick={() => openSubtopic(onOpenResult, subject, topic, subtopic)}>{topic.title}<ArrowUpRight /></button> : null;
                    })}
                  </div>
                  {firstTopic && firstSubtopic && <button className="library-open-subject" type="button" onClick={() => openSubtopic(onOpenResult, subject, firstTopic, firstSubtopic)}>Abrir conteúdo <ArrowUpRight /></button>}
                </article>
              );
            })}
          </div>
        </>
      )}

      <p className="study-tool-privacy"><BookOpen /> A busca consulta apenas os materiais já integrados ao NEXUS. Nenhum conteúdo é enviado a um serviço externo.</p>
    </section>
  );
}
