import { useEffect, useMemo, useRef, useState } from 'react';
import { UI_TEXT } from '../../constants';
import Button from '../UI/Button';
import Input from '../UI/Input';
import ModalShell from './ModalShell';

type Mode = 'create' | 'edit';

type GoalFormValues = {
  title: string;
  identitySentence: string;
};

interface Props {
  open: boolean;
  mode: Mode;
  initialValues?: GoalFormValues;
  onClose(): void;
  onSubmit(values: GoalFormValues): void;
}

export default function GoalModal({ open, mode, initialValues, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [identitySentence, setIdentitySentence] = useState('');
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialValues) {
      setTitle(initialValues.title);
      setIdentitySentence(initialValues.identitySentence);
      return;
    }
    setTitle('');
    setIdentitySentence('');
  }, [open, mode, initialValues?.title, initialValues?.identitySentence]);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      identitySentence: identitySentence.trim()
    });
    onClose();
  };

  const modalTitle = mode === 'edit' ? UI_TEXT.editGoalTitle : UI_TEXT.newGoalTitle;
  const primaryLabel = mode === 'edit' ? UI_TEXT.save : UI_TEXT.add;
  const modalAriaLabel = mode === 'edit' ? UI_TEXT.editGoalAria : UI_TEXT.newGoalAria;

  return (
    <ModalShell
      open={open}
      ariaLabel={modalAriaLabel}
      onClose={onClose}
      initialFocusRef={titleRef}
    >
      <div className="goal-modal-header">
        <h2 className="goal-modal-title">{modalTitle}</h2>
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
            {primaryLabel}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
