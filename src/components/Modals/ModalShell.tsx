import { useEffect } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  ariaLabel: string;
  onClose(): void;
  initialFocusRef?: RefObject<HTMLElement>;
  children: ReactNode;
}

export default function ModalShell({
  open,
  ariaLabel,
  onClose,
  initialFocusRef,
  children
}: Props) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  return createPortal(
    <div
      className="goal-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div className="goal-modal-card" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
