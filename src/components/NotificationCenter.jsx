import React, { useEffect, useRef, useState } from 'react';
import { Bell, BookOpen, Check, X } from 'lucide-react';

const NOTICE_READ_KEY = 'nexus-academy:notice:fullscreen-reader:v1';

function readNoticeState() {
  try { return window.localStorage.getItem(NOTICE_READ_KEY) === 'read'; }
  catch { return false; }
}

export default function NotificationCenter({ navigate }) {
  const [open, setOpen] = useState(false);
  const [isRead, setIsRead] = useState(readNoticeState);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const hasUnread = !isRead;

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

  function markRead() {
    try { window.localStorage.setItem(NOTICE_READ_KEY, 'read'); }
    catch { /* A notificação pode ser lida mesmo se o armazenamento estiver indisponível. */ }
    setIsRead(true);
  }

  function exploreDisciplines() {
    setOpen(false);
    navigate('Disciplinas');
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="notification-center" ref={rootRef}>
      <button ref={triggerRef} className={`bell ${hasUnread ? 'has-unread' : ''}`} type="button" aria-label={`Notificações${hasUnread ? ', 1 não lida' : ''}`} aria-expanded={open} aria-controls="nexus-notification-panel" onClick={() => setOpen((value) => !value)}>
        <Bell aria-hidden="true" />
        {hasUnread && <span className="bell-badge" aria-hidden="true">1</span>}
      </button>
      <section id="nexus-notification-panel" className="notification-panel" aria-label="Central de notificações" hidden={!open}>
        <div className="notification-panel-heading"><div><span>ATUALIZAÇÕES DO NEXUS</span><h2>Notificações</h2></div><button type="button" aria-label="Fechar notificações" onClick={closeAndReturnFocus}><X /></button></div>
        <article className={`notification-item ${hasUnread ? 'unread' : ''}`}>
          <div className="notification-item-icon"><BookOpen /></div>
          <div><span className="notification-label">{hasUnread ? 'NOVIDADE' : 'ATUALIZAÇÃO'}</span><h3>Leitura em tela cheia</h3><p>Abra um assunto em modo de foco, mostre ou recolha o roteiro e use rolagens independentes para cada painel.</p><small>NEXUS ACADEMY</small></div>
        </article>
        <button className="notification-explore" type="button" onClick={exploreDisciplines}>Explorar disciplinas</button>
        <div className="notification-panel-footer">{hasUnread ? <button type="button" onClick={markRead}><Check /> Marcar como lida</button> : <span>Tudo em dia</span>}</div>
      </section>
    </div>
  );
}
