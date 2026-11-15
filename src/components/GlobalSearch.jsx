import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, FileText, Search, X } from 'lucide-react';

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function optionText(option) {
  return typeof option === 'string' ? option : option?.text || '';
}

function makeIndex(subjects, developmentDisciplines, plannedDisciplines) {
  const entries = [];
  for (const name of developmentDisciplines) {
    entries.push({
      kind: 'development-discipline', group: 'Disciplinas', title: name,
      detail: 'Em desenvolvimento · nenhum conteúdo conectado ainda',
      searchText: `${name} disciplina em desenvolvimento`, subjectName: name, mode: 'planned',
      id: `development-${normalize(name)}`,
    });
  }
  for (const name of plannedDisciplines) {
    entries.push({
      kind: 'planned-discipline', group: 'Disciplinas', title: name,
      detail: 'Disciplina planejada · conteúdo ainda não integrado',
      searchText: `${name} disciplina planejada`, subjectName: name, mode: 'planned',
      id: `planned-${normalize(name)}`,
    });
  }
  for (const subject of subjects) {
    entries.push({
      kind: 'discipline',
      group: 'Disciplinas',
      title: subject.name,
      detail: `${subject.questions.length} questões integradas`,
      searchText: `${subject.name} ${subject.description}`,
      subjectName: subject.name,
      mode: 'content',
      id: `discipline-${subject.id}`,
    });
    for (const topic of subject.topics) {
      entries.push({
        kind: 'topic', group: 'Assuntos', title: topic.title, detail: `${subject.name} · ${topic.summary || ''}`,
        searchText: `${subject.name} ${topic.title} ${topic.summary}`, subjectName: subject.name,
        mode: 'content', topicId: topic.id, id: `topic-${subject.id}-${topic.id}`,
      });
      for (const subtopic of topic.subtopics || []) {
        entries.push({
          kind: 'subtopic', group: 'Subassuntos', title: subtopic.title, detail: `${subject.name} · ${topic.title}`,
          searchText: `${subject.name} ${topic.title} ${subtopic.title}`, subjectName: subject.name,
          mode: 'content', topicId: topic.id, subtopicId: subtopic.id,
          content: subtopic.content, id: `subtopic-${subject.id}-${subtopic.id}`,
        });
        const paragraphs = String(subtopic.content || '').split(/\n\n+/).filter(Boolean);
        paragraphs.forEach((paragraph, index) => entries.push({
          kind: 'content', group: 'Conteúdo teórico', title: subtopic.title,
          detail: `${subject.name} · ${topic.title}`,
          searchText: `${subject.name} ${topic.title} ${subtopic.title} ${paragraph}`,
          excerpt: paragraph, subjectName: subject.name, mode: 'content', topicId: topic.id,
          subtopicId: subtopic.id, id: `content-${subject.id}-${subtopic.id}-${index}`,
        }));
      }
    }
    for (const question of subject.questions) {
      const topic = subject.topics.find((item) => item.id === question.topicId);
      entries.push({
        kind: 'question', group: 'Questões', title: question.prompt,
        detail: `${subject.name}${topic ? ` · ${topic.title}` : ''}${question.year ? ` · ${question.year}` : ''}`,
        searchText: `${subject.name} ${topic?.title || ''} ${question.prompt} ${Object.values(question.options || {}).map(optionText).join(' ')}`,
        excerpt: question.prompt, subjectName: subject.name, mode: 'questions',
        topicId: question.topicId, subtopicId: question.subtopicId, questionId: String(question.id),
        id: `question-${subject.id}-${question.id}`,
      });
    }
  }
  return entries.map((entry) => ({ ...entry, normalized: normalize(entry.searchText) }));
}

const GROUP_ORDER = ['Disciplinas', 'Assuntos', 'Subassuntos', 'Conteúdo teórico', 'Questões'];

export default function GlobalSearch({ subjects, developmentDisciplines = [], plannedDisciplines = [], value, onChange, onSelect, expanded, onToggleExpanded }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const index = useMemo(() => makeIndex(subjects, developmentDisciplines, plannedDisciplines), [subjects, developmentDisciplines, plannedDisciplines]);
  const normalizedQuery = normalize(value);
  const matching = useMemo(() => {
    if (normalizedQuery.length < 2) return [];
    return index.filter((entry) => entry.normalized.includes(normalizedQuery));
  }, [index, normalizedQuery]);

  const groups = GROUP_ORDER.map((group) => ({
    name: group,
    entries: matching.filter((entry) => entry.group === group).slice(0, group === 'Questões' ? 5 : 4),
    total: matching.filter((entry) => entry.group === group).length,
  })).filter((item) => item.entries.length);
  const visible = groups.flatMap((group) => group.entries);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (!expanded) onToggleExpanded();
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [expanded, onToggleExpanded]);

  function select(entry) {
    onSelect(entry);
    setOpen(false);
    onChange('');
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false);
      onChange('');
      inputRef.current?.blur();
    }
    if (event.key === 'Enter' && visible[0]) {
      event.preventDefault();
      select(visible[0]);
    }
  }

  return (
    <div className={`global-search ${expanded ? 'expanded' : ''}`}>
      <div className="global-search-field">
        <button
          className="search-toggle"
          type="button"
          aria-label={expanded ? 'Fechar campo de pesquisa' : 'Abrir pesquisa'}
          aria-expanded={expanded}
          onClick={() => {
            onToggleExpanded();
            window.setTimeout(() => inputRef.current?.focus(), 0);
          }}
        ><Search /></button>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => { onChange(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar no NEXUS..."
          aria-label="Pesquisar disciplinas, conteúdos e questões"
          aria-expanded={open && normalizedQuery.length >= 2}
          aria-controls="nexus-search-results"
        />
        <kbd>⌘ K</kbd>
        {value && <button className="search-clear" type="button" aria-label="Limpar pesquisa" onClick={() => { onChange(''); setOpen(true); inputRef.current?.focus(); }}><X /></button>}
      </div>
      {open && normalizedQuery.length >= 2 && (
        <div className="search-results" id="nexus-search-results" role="listbox" aria-label="Resultados da pesquisa">
          {groups.length === 0 ? <p className="search-empty">Nenhum resultado para “{value.trim()}”.</p> : groups.map((group) => (
            <section className="search-group" key={group.name} aria-label={group.name}>
              <h3>{group.name}<span>{group.total}</span></h3>
              {group.entries.map((entry) => (
                <button className="search-result" type="button" role="option" key={entry.id} onClick={() => select(entry)}>
                  <span className="search-result-icon">{entry.kind === 'discipline' ? <BookOpen /> : <FileText />}</span>
                  <span className="search-result-copy"><b>{entry.title}</b><small>{entry.detail}</small>{entry.excerpt && <em>{entry.excerpt}</em>}</span>
                </button>
              ))}
              {group.total > group.entries.length && <p className="search-more">+ {group.total - group.entries.length} resultados nesta categoria; refine a busca.</p>}
            </section>
          ))}
          <div className="search-footer">{matching.length} resultado(s) · Enter abre o primeiro · Esc fecha</div>
        </div>
      )}
    </div>
  );
}
