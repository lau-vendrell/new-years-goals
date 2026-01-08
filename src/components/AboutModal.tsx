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
      className="goal-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Acerca de"
      onClick={onClose}
    >
      <div className="goal-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="goal-modal-header">
          <h2 className="goal-modal-title">ABOUT</h2>
          <button
            className="goal-modal-close"
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="goal-modal-content text-body">
          <p>Página creada por Laura Vendrell 🦦</p>
          <p>
            Nace de un experimento de desarrollo con Visual Studio, Codex y ChatGPT. Hecha con React, Vite,
            Typescript y mucho amor.
          </p>
          <p>
            La idea del proyecto fue crear una web donde guardar objetivos de forma ágil y sencilla para poder
            acceder siempre que quieras. Puedes guardar tu web como marcador o crear un acceso directo.
          </p>
          <p>
            Además, la doble visualización de objetivos viene de la idea de cómo se siente marcar y querer abarcar
            muchos objetivos a la vez.
          </p>
          <p>
            Para cotillear otros proyectos, podéis acceder a la{" "}
            <a
              href="https://fractales.substack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              newsletter
            </a>{" "}
            donde cuento en lo que estoy trabajando 2 veces por mes.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
