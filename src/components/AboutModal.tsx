import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose(): void;
}

export default function AboutModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Acerca de"
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sobre esta página</h2>
          <button className="link-button" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <p>
          Una página ligera para diseñar y sostener tus objetivos del año. Guarda automáticamente en tu
          navegador, edita en línea y revisa el estado en la tabla lateral.
        </p>
        <p className="muted">Hecha con React + Vite. Sin backend, tus datos viven en localStorage.</p>
      </div>
    </div>,
    document.body
  );
}
