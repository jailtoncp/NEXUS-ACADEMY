import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, Search, X, ZoomIn, ZoomOut } from 'lucide-react';
import './question-image-zoom.css';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

export default function QuestionImageZoom({ src, alt, caption, figureClassName = 'question-figure' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const previewRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const hasOpenedRef = useRef(false);
  const titleId = useId();
  const accessibleAlt = alt || 'Imagem da questão';

  const openViewer = () => {
    hasOpenedRef.current = true;
    setZoom(MIN_ZOOM);
    setIsOpen(true);
  };

  const closeViewer = () => {
    setIsOpen(false);
    setZoom(MIN_ZOOM);
  };

  useEffect(() => {
    if (!isOpen) {
      if (hasOpenedRef.current) {
        previewRef.current?.focus();
        hasOpenedRef.current = false;
      }
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const updateStageSize = () => {
      const stage = stageRef.current;
      if (stage) setStageSize({ width: stage.clientWidth, height: stage.clientHeight });
    };

    updateStageSize();
    const observer = typeof ResizeObserver !== 'undefined' && stageRef.current
      ? new ResizeObserver(updateStageSize)
      : null;
    observer?.observe(stageRef.current);
    window.addEventListener('resize', updateStageSize);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeViewer();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), [tabindex="0"]');
      if (!focusable?.length) return;
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

    window.addEventListener('keydown', handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      observer?.disconnect();
      window.removeEventListener('resize', updateStageSize);
      window.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !stageRef.current) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.scrollTo({
        left: Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2),
        top: Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2),
        behavior: 'smooth',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, zoom, naturalSize, stageSize]);

  const fitScale = naturalSize.width > 0 && naturalSize.height > 0 && stageSize.width > 0 && stageSize.height > 0
    ? Math.min(stageSize.width / naturalSize.width, stageSize.height / naturalSize.height)
    : 0;
  const fittedWidth = fitScale ? naturalSize.width * fitScale : stageSize.width;
  const fittedHeight = fitScale ? naturalSize.height * fitScale : stageSize.height;
  const renderedWidth = fittedWidth * zoom;
  const renderedHeight = fittedHeight * zoom;
  const canvasStyle = fitScale
    ? { width: `${Math.max(stageSize.width, renderedWidth)}px`, height: `${Math.max(stageSize.height, renderedHeight)}px` }
    : { width: '100%', height: '100%' };
  const imageStyle = fitScale
    ? { width: `${renderedWidth}px`, height: `${renderedHeight}px` }
    : { width: '100%', height: '100%' };

  const viewer = isOpen && createPortal(
    <div className="question-image-zoom-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeViewer();
    }}>
      <section
        ref={dialogRef}
        className="question-image-zoom-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="question-image-zoom-header">
          <div>
            <h2 id={titleId}>Ampliar foto do texto</h2>
            <p>{caption || accessibleAlt}</p>
          </div>
          <button ref={closeButtonRef} type="button" className="question-image-zoom-close" aria-label="Fechar imagem ampliada" onClick={closeViewer}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div ref={stageRef} className="question-image-zoom-stage" role="region" aria-label="Imagem ampliada. Use a rolagem para percorrer toda a imagem.">
          <div className="question-image-zoom-canvas" style={canvasStyle}>
            <img
              className="question-image-zoom-full-image"
              src={src}
              alt={accessibleAlt}
              style={imageStyle}
              onLoad={(event) => setNaturalSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
            />
          </div>
        </div>
        <div className="question-image-zoom-toolbar" role="group" aria-label="Controles de ampliação da imagem">
          <button type="button" aria-label="Diminuir ampliação" title="Diminuir ampliação" disabled={zoom <= MIN_ZOOM} onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP))}>
            <ZoomOut aria-hidden="true" />
          </button>
          <output aria-live="polite" aria-label="Ampliação atual">{Math.round(zoom * 100)}%</output>
          <button type="button" aria-label="Aumentar ampliação" title="Aumentar ampliação" disabled={zoom >= MAX_ZOOM} onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP))}>
            <ZoomIn aria-hidden="true" />
          </button>
          <button type="button" className="question-image-zoom-fit" aria-label="Ajustar imagem inteira à tela" title="Ajustar imagem inteira à tela" disabled={zoom === MIN_ZOOM} onClick={() => setZoom(MIN_ZOOM)}>
            <RotateCcw aria-hidden="true" />
            <span>Ajustar à tela</span>
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );

  return (
    <>
      <figure className={`question-image-zoom-figure ${figureClassName}`}>
        <button
          ref={previewRef}
          type="button"
          className="question-image-zoom-preview"
          aria-label={`Ampliar imagem: ${accessibleAlt}`}
          onClick={openViewer}
        >
          <img src={src} alt={accessibleAlt} loading="lazy" decoding="async" />
          <span className="question-image-zoom-icon" aria-hidden="true"><Search /></span>
        </button>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
      {viewer}
    </>
  );
}
