import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose(): void;
  onSubmit(values: { title: string; identityPhrase: string }): void;
}

export default function NewGoalModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [identityPhrase, setIdentityPhrase] = useState('');

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTitle('');
    setIdentityPhrase('');
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), identityPhrase: identityPhrase.trim() });
    onClose();
  };

  return createPortal(
    <div
      className="goal-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Nuevo objetivo"
      onClick={onClose}
    >
      <div className="goal-modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="goal-modal-title">NUEVO OBJETIVO</h2>
        <form className="goal-modal-form" onSubmit={handleSubmit}>
          <label className="goal-modal-field">
            <span className="goal-modal-label">Objetivo</span>
            <input
              className="goal-modal-input"
              type="text"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </label>
          <label className="goal-modal-field">
            <span className="goal-modal-label">Quién quiero ser respecto a este objetivo</span>
            <input
              className="goal-modal-input"
              type="text"
              name="identityPhrase"
              value={identityPhrase}
              onChange={(event) => setIdentityPhrase(event.target.value)}
            />
          </label>
          <div className="goal-modal-actions">
            <button
              className="goal-modal-btn goal-modal-btn-cancel"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="goal-modal-btn goal-modal-btn-primary"
              type="submit"
              disabled={!canSubmit}
            >
              Añadir
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
