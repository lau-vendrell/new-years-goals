import { useRef } from 'react';
import { ABOUT_CONTENT, UI_TEXT } from '../../constants';
import IconButton from '../UI/IconButton';
import ModalShell from './ModalShell';

interface Props {
  open: boolean;
  onClose(): void;
}

export default function AboutModal({ open, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <ModalShell
      open={open}
      ariaLabel={UI_TEXT.aboutAria}
      onClose={onClose}
      initialFocusRef={closeButtonRef}
    >
      <div className="goal-modal-header">
        <h2 className="goal-modal-title">{UI_TEXT.about}</h2>
        <IconButton
          className="goal-modal-close"
          aria-label={UI_TEXT.close}
          onClick={onClose}
          ref={closeButtonRef}
        >
          {UI_TEXT.closeGlyph}
        </IconButton>
      </div>

      <div className="goal-modal-content text-body">
        <p>{ABOUT_CONTENT.intro}</p>
        <p>{ABOUT_CONTENT.stack}</p>
        <p>{ABOUT_CONTENT.purpose}</p>
        <p>{ABOUT_CONTENT.dualView}</p>
        <p>
          {ABOUT_CONTENT.newsletter.prefix}
          <a
            href={ABOUT_CONTENT.newsletter.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ABOUT_CONTENT.newsletter.label}
          </a>
          {ABOUT_CONTENT.newsletter.suffix}
        </p>
      </div>
    </ModalShell>
  );
}
