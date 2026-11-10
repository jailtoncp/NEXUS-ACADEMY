import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export default function InstallPwaButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(isRunningStandalone);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function captureInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function markInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
      setShowHelp(false);
    }

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    window.addEventListener('appinstalled', markInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  useEffect(() => {
    if (!showHelp) return undefined;
    function closeOnEscape(event) {
      if (event.key === 'Escape') setShowHelp(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showHelp]);

  async function install() {
    if (!installPrompt) {
      setShowHelp(true);
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (installed) return null;

  return (
    <>
      <button className="install-button" type="button" onClick={install} aria-label="Instalar o NEXUS ACADEMY">
        <Download aria-hidden="true" />
        <span>Instalar app</span>
      </button>

      {showHelp && (
        <div className="install-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowHelp(false)}>
          <section className="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title">
            <button className="install-close" type="button" onClick={() => setShowHelp(false)} aria-label="Fechar instruções">
              <X aria-hidden="true" />
            </button>
            <span className="install-kicker">NEXUS ACADEMY NO SEU DISPOSITIVO</span>
            <h2 id="install-title">Instale para acessar mais rápido</h2>
            <p>O navegador oferece a opção de adicionar o NEXUS ACADEMY à tela inicial ou à área de trabalho.</p>
            <ul>
              <li><strong>Chrome ou Edge no computador:</strong> selecione o ícone de instalação na barra de endereço ou abra o menu do navegador e escolha “Instalar NEXUS ACADEMY”.</li>
              <li><strong>Android:</strong> no Chrome, abra o menu ⋮ e escolha “Instalar app” ou “Adicionar à tela inicial”.</li>
              <li><strong>iPhone ou iPad:</strong> no Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.</li>
            </ul>
            <button className="install-dismiss" type="button" onClick={() => setShowHelp(false)}>Entendi</button>
          </section>
        </div>
      )}
    </>
  );
}
