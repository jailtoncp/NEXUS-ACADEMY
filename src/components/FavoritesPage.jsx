import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, CircleHelp, Search, Star, Trash2 } from 'lucide-react';
import { activeSubjects } from '../data/subjectRegistry.js';
import { readFavoriteItems, resolveFavoriteItems, toggleQuestionFavorite } from '../lib/favorites.js';

function normalizeText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function savedDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Data indisponível' : parsed.toLocaleDateString('pt-BR');
}

function openQuestion(onOpenResult, subject, question) {
  onOpenResult({
    id: question.id,
    mode: 'questions',
    subjectName: subject.name,
    topicId: question.topicId,
    subtopicId: question.subtopicId,
    questionId: question.id,
  });
}

export default function FavoritesPage({ onOpenResult }) {
  const [favorites, setFavorites] = useState(readFavoriteItems);
  const [query, setQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const refresh = () => setFavorites(readFavoriteItems());
    window.addEventListener('nexus-favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nexus-favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const resolved = useMemo(() => resolveFavoriteItems(favorites), [favorites]);
  const filtered = useMemo(() => {
    const terms = normalizeText(query).trim().split(/\s+/).filter(Boolean);
    return resolved
      .filter(({ subject }) => disciplineFilter === 'all' || subject.id === disciplineFilter)
      .filter(({ subject, question }) => {
        if (!terms.length) return true;
        const haystack = normalizeText([
          subject.name,
          question.prompt,
          question.source,
          subject.topics.find((item) => item.id === question.topicId)?.title,
          subject.topics.flatMap((item) => item.subtopics).find((item) => item.id === question.subtopicId)?.title,
        ].join(' '));
        return terms.every((term) => haystack.includes(term));
      })
      .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
  }, [resolved, query, disciplineFilter]);

  function removeFavorite(item) {
    setError('');
    try {
      setFavorites(toggleQuestionFavorite(item.disciplineId, item.questionId));
    } catch (cause) {
      setError(cause.message || 'Não foi possível atualizar os favoritos.');
    }
  }

  const firstQuestion = activeSubjects.find((subject) => subject.questions.length)?.questions[0];
  const firstSubject = firstQuestion ? activeSubjects.find((subject) => subject.questions.includes(firstQuestion)) : null;

  return (
    <section className="study-tool-page favorites-page">
      <div className="study-tool-heading">
        <div>
          <span>SEU ACERVO · DADOS LOCAIS</span>
          <h1>Favoritos</h1>
          <p>Guarde questões importantes para encontrá-las e praticá-las de novo quando quiser.</p>
        </div>
        <div className="study-tool-total"><span><Star /></span><strong>{favorites.length.toLocaleString('pt-BR')}</strong><small>{favorites.length === 1 ? 'questão salva' : 'questões salvas'}</small></div>
      </div>

      <div className="study-tool-toolbar">
        <label className="study-tool-search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">Buscar nos favoritos</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar questão, assunto ou disciplina" />
        </label>
        <label className="study-tool-select">
          <span className="visually-hidden">Filtrar por disciplina</span>
          <select value={disciplineFilter} onChange={(event) => setDisciplineFilter(event.target.value)}>
            <option value="all">Todas as disciplinas</option>
            {activeSubjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}
          </select>
        </label>
        <span className="study-tool-result-count">{filtered.length.toLocaleString('pt-BR')} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
      </div>

      {error && <p className="study-tool-message error" role="alert">{error}</p>}

      {filtered.length > 0 ? (
        <div className="favorite-list">
          {filtered.map(({ disciplineId, questionId, savedAt, subject, question }) => {
            const topic = subject.topics.find((item) => item.id === question.topicId);
            const subtopic = topic?.subtopics.find((item) => item.id === question.subtopicId);
            return (
              <article className="favorite-card" key={`${disciplineId}:${questionId}`}>
                <div className="favorite-card-topline">
                  <span className="favorite-discipline">{subject.name}</span>
                  <button className="favorite-remove" type="button" onClick={() => removeFavorite({ disciplineId, questionId })} aria-label={`Remover questão de ${subject.name} dos favoritos`} title="Remover dos favoritos"><Trash2 /> Remover</button>
                </div>
                <p className="favorite-topic">{topic?.title || 'Assunto'}{subtopic?.title ? ` · ${subtopic.title}` : ''}</p>
                <h2>{question.prompt}</h2>
                {question.source && <p className="favorite-source">Fonte: {question.source}</p>}
                <div className="favorite-card-footer"><small>Salva em {savedDate(savedAt)}</small><button className="small-action" type="button" onClick={() => openQuestion(onOpenResult, subject, question)}>Abrir questão <ArrowUpRight /></button></div>
              </article>
            );
          })}
        </div>
      ) : favorites.length === 0 ? (
        <div className="study-tool-empty">
          <div><Star /></div>
          <span>SEU ESPAÇO DE REVISÃO</span>
          <h2>Seus favoritos começam aqui</h2>
          <p>Nas questões, toque na estrela para guardar um item. Ele ficará salvo apenas neste navegador e não altera seu histórico de respostas.</p>
          {firstSubject && firstQuestion && <button className="primary-action" type="button" onClick={() => openQuestion(onOpenResult, firstSubject, firstQuestion)}>Explorar questões <BookOpen /></button>}
        </div>
      ) : (
        <div className="study-tool-empty compact">
          <div><CircleHelp /></div>
          <h2>Nenhum favorito encontrado</h2>
          <p>Tente outro termo ou selecione uma disciplina diferente.</p>
          <button className="small-action" type="button" onClick={() => { setQuery(''); setDisciplineFilter('all'); }}>Limpar filtros</button>
        </div>
      )}

      <p className="study-tool-privacy"><Star /> Favoritos são armazenados neste navegador, separados do histórico de respostas. Eles não são enviados a um serviço externo.</p>
    </section>
  );
}
