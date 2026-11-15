import React, { useRef, useState } from 'react';
import { Download, FileUp, ShieldCheck } from 'lucide-react';
import { createHistoryExport, readAnswerHistory, replaceAnswerHistory, validateHistoryImport } from '../lib/answerHistory.js';

export default function HistoryTools() {
  const inputRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const history = readAnswerHistory();

  function exportHistory() {
    try {
      const backup = createHistoryExport(history);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus-academy-historico-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: `Backup JSON exportado com ${history.length} resposta(s).` });
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível exportar o histórico neste navegador.' });
    }
  }

  async function importHistory(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'O arquivo excede o limite de 10 MB. Nenhum dado foi alterado.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const text = await file.text();
      let payload;
      try { payload = JSON.parse(text); }
      catch { setMessage({ type: 'error', text: 'O arquivo não contém JSON válido. Nenhum dado foi alterado.' }); return; }
      const validation = validateHistoryImport(payload);
      if (!validation.valid) { setMessage({ type: 'error', text: validation.message }); return; }
      if (!window.confirm(`O backup contém ${validation.attempts.length} resposta(s). Deseja substituir o histórico atual de ${history.length} resposta(s)? Essa ação só será executada após a validação integral do arquivo.`)) return;
      replaceAnswerHistory(validation.attempts);
      setMessage({ type: 'success', text: `Histórico restaurado: ${validation.attempts.length} resposta(s) validadas.` });
    } catch (error) {
      setMessage({ type: 'error', text: error?.name === 'QuotaExceededError' ? 'O navegador não tem espaço suficiente. O histórico anterior foi preservado.' : 'Falha ao restaurar o arquivo. O histórico anterior foi preservado.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="tools-page">
      <div className="tools-heading">
        <span>ARMAZENAMENTO LOCAL</span>
        <h1>Histórico e proteção dos dados</h1>
        <p>Suas respostas ficam neste navegador e neste dispositivo. Exporte um backup JSON para guardar ou restaurar seu histórico; não há envio para servidor.</p>
      </div>
      <div className="tools-card">
        <div className="tools-card-icon"><ShieldCheck /></div>
        <div className="tools-card-copy">
          <h2>Respostas registradas</h2>
          <p>{history.length} tentativa(s) válida(s) no histórico local.</p>
          <small>O backup inclui disciplina, questão, assunto, alternativa escolhida, gabarito, resultado, horário e duração.</small>
        </div>
        <div className="tools-actions">
          <button type="button" className="primary-action" onClick={exportHistory}><Download /> Exportar JSON</button>
          <button type="button" className="small-action" disabled={busy} onClick={() => inputRef.current?.click()}><FileUp /> {busy ? 'Validando…' : 'Restaurar JSON'}</button>
          <input ref={inputRef} type="file" accept="application/json,.json" className="visually-hidden" onChange={importHistory} aria-label="Selecionar arquivo JSON de histórico" />
        </div>
      </div>
      {message && <p className={`tools-message ${message.type}`} role="status">{message.text}</p>}
      <div className="tools-note"><ShieldCheck /><span><b>Validação antes de restaurar:</b> o arquivo inteiro é verificado — incluindo formato, disciplinas, questões conhecidas, alternativas, gabaritos e datas. Se houver qualquer item inválido, nada é substituído. Restaurar um backup válido substitui o histórico atual somente após sua confirmação.</span></div>
    </section>
  );
}
