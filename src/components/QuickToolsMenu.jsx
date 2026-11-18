import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, ChevronDown, ChevronRight, Settings, UserRound, X } from 'lucide-react';
import { readAnswerHistory, summarizeAnswerHistory } from '../lib/answerHistory.js';
import { getUserInitials, readUserProfile } from '../lib/userProfile.js';

export default function QuickToolsMenu({ navigate, active }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(readAnswerHistory);
  const [profile, setProfile] = useState(readUserProfile);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const count = summarizeAnswerHistory(history).attempts;
  const displayName = profile.displayName.trim() || 'Meu perfil';

  useEffect(() => {
    const refreshHistory = () => setHistory(readAnswerHistory());
    const refreshProfile = () => setProfile(readUserProfile());
    window.addEventListener('nexus-history-updated', refreshHistory);
    window.addEventListener('nexus-profile-updated', refreshProfile);
    window.addEventListener('storage', refreshHistory);
    window.addEventListener('storage', refreshProfile);
    return () => {
      window.removeEventListener('nexus-history-updated', refreshHistory);
      window.removeEventListener('nexus-profile-updated', refreshProfile);
      window.removeEventListener('storage', refreshHistory);
      window.removeEventListener('storage', refreshProfile);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  function closeAndReturnFocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function goTo(page) {
    setOpen(false);
    navigate(page);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="header-tools" ref={rootRef}>
      <button ref={triggerRef} className={`header-tools-toggle ${open ? 'is-open' : ''}`} type="button" title="Meu espaço" aria-label={open ? 'Fechar menu pessoal' : 'Abrir menu pessoal'} aria-expanded={open} aria-controls="nexus-personal-menu" onClick={() => setOpen((value) => !value)}>
        <span className="header-tools-avatar">{profile.photoDataUrl ? <img src={profile.photoDataUrl} alt="" /> : <UserRound aria-hidden="true" />}</span>
        <span className="header-tools-indicator"><ChevronDown aria-hidden="true" /></span>
      </button>
      <section id="nexus-personal-menu" className="header-tools-popover" aria-label="Atalhos pessoais" hidden={!open}>
        <div className="floating-tools-heading">
          <div className="floating-tools-avatar large">{profile.photoDataUrl ? <img src={profile.photoDataUrl} alt="" /> : <span>{getUserInitials(profile.displayName)}</span>}</div>
          <div><span>SEU ESPAÇO</span><strong>{displayName}</strong><small>{profile.targetExam.trim() || 'Dados salvos neste dispositivo'}</small></div>
          <button type="button" aria-label="Fechar menu pessoal" onClick={closeAndReturnFocus}><X /></button>
        </div>
        <div className="floating-tools-list">
          <button className={`floating-tool-item ${active === 'Desempenho' ? 'selected' : ''}`} type="button" onClick={() => goTo('Desempenho')}>
            <span className="floating-tool-icon"><BarChart3 /></span><span><b>Respostas registradas</b><small>{count.toLocaleString('pt-BR')} {count === 1 ? 'resposta' : 'respostas'} neste dispositivo</small></span><ChevronRight />
          </button>
          <button className={`floating-tool-item ${active === 'Configurações' ? 'selected' : ''}`} type="button" onClick={() => goTo('Configurações')}>
            <span className="floating-tool-icon"><Settings /></span><span><b>Configurações</b><small>Backup e restauração do histórico</small></span><ChevronRight />
          </button>
          <button className={`floating-tool-item ${active === 'Meu perfil' ? 'selected' : ''}`} type="button" onClick={() => goTo('Meu perfil')}>
            <span className="floating-tool-icon"><UserRound /></span><span><b>Meu perfil</b><small>Foto, objetivo e meta de estudo</small></span><ChevronRight />
          </button>
        </div>
        <p className="floating-tools-note">Seu histórico e perfil permanecem neste navegador.</p>
      </section>
    </div>
  );
}
