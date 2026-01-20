import { useEffect, useMemo, useRef, useState } from 'react';
import { GOAL_STATUS, UI_TEXT } from '../../constants';
import type { NewGoalInput } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import ModalShell from './ModalShell';

interface Props {
  open: boolean;
  onClose(): void;
  onSubmit(values: NewGoalInput): void;
}

export default function NewGoalModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [identitySentence, setIdentitySentence] = useState('');
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setIdentitySentence('');
  }, [open]);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      id: crypto.randomUUID(),
      title: title.trim(),
      identitySentence: identitySentence.trim(),
      status: GOAL_STATUS.active,
      createdAt: Date.now()
    });
    onClose();
  };

  return (
    <ModalShell
      open={open}
      ariaLabel={UI_TEXT.newGoalAria}
      onClose={onClose}
      initialFocusRef={titleRef}
    >
      <div className="goal-modal-header">
        <h2 className="goal-modal-title">{UI_TEXT.newGoalTitle}</h2>
      </div>
      <form className="goal-modal-form" onSubmit={handleSubmit}>
        <label className="goal-modal-field">
          <span className="goal-modal-label">{UI_TEXT.newGoalLabel}</span>
          <Input
            className="goal-modal-input"
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={UI_TEXT.newGoalPlaceholder}
            ref={titleRef}
          />
        </label>
        <label className="goal-modal-field">
          <span className="goal-modal-label">{UI_TEXT.identityLabel}</span>
          <Input
            className="goal-modal-input"
            type="text"
            name="identitySentence"
            value={identitySentence}
            onChange={(event) => setIdentitySentence(event.target.value)}
            placeholder={UI_TEXT.identityPlaceholder}
          />
        </label>
        <div className="goal-modal-actions">
          <Button className="goal-modal-btn goal-modal-btn-cancel" onClick={onClose}>
            {UI_TEXT.cancel}
          </Button>
          <Button
            className="goal-modal-btn goal-modal-btn-primary"
            type="submit"
            disabled={!canSubmit}
          >
            {UI_TEXT.add}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
