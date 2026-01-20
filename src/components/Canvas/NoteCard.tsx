import { forwardRef, useEffect, useState, KeyboardEvent } from 'react';
import { GOAL_STATUS, UI_TEXT } from '../../constants';
import type { Goal } from '../../types';
import { formatIdentitySentence, formatToggleGoalStatusAria } from '../../utils/formatters';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface Props {
  goal: Goal;
  isFocused: boolean;
  selectionClass?: string;
  onToggleComplete(id: string): void;
  onDelete(id: string): void;
  onUpdate(next: Goal): void;
  onSelect(id: string): void;
  onDragStart?(e: React.PointerEvent): void;
}

const NoteCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      goal,
      isFocused,
      selectionClass,
      onToggleComplete,
      onDelete,
      onUpdate,
      onSelect,
      onDragStart
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(goal.title);
    const [identity, setIdentity] = useState(goal.identitySentence);

    useEffect(() => {
      if (!isEditing) {
        setTitle(goal.title);
        setIdentity(goal.identitySentence);
      }
    }, [goal, isEditing]);

    const handleSave = () => {
      if (!title.trim()) {
        setTitle(goal.title);
        setIdentity(goal.identitySentence);
        setIsEditing(false);
        return;
      }
      onUpdate({
        ...goal,
        title: title.trim(),
        identitySentence: identity.trim()
      });
      setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setTitle(goal.title);
        setIdentity(goal.identitySentence);
        setIsEditing(false);
      }
    };

    const style = {
      left: `${goal.position.x * 100}%`,
      top: `${goal.position.y * 100}%`,
      transform: `rotate(${goal.position.rot}deg)`
    } as const;

    const isCompleted = goal.status === GOAL_STATUS.completed;

    return (
      <article
        ref={ref}
        className={`note ${selectionClass || ''} ${isCompleted ? 'is-completed' : ''} ${
          isFocused ? 'is-focused' : ''
        }`}
        style={style}
        onClick={() => onSelect(goal.id)}
        onPointerDown={(e) => {
          const target = e.target as HTMLElement;
          if (isEditing || target.closest('button') || target.closest('input') || target.closest('textarea')) {
            return;
          }
          onDragStart?.(e);
        }}
      >
        <div className="goal-card__header">
          <label className="checkbox-line" onClick={(e) => e.stopPropagation()}>
            <Input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onToggleComplete(goal.id)}
              aria-label={formatToggleGoalStatusAria(goal.title, goal.status)}
            />
            <span className="pill tiny">
              {isCompleted ? UI_TEXT.statusCompleted : UI_TEXT.statusActive}
            </span>
          </label>
        </div>

        <div className="goal-card__body">
          {isEditing ? (
            <>
              <Input
                className="inline-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                aria-label={UI_TEXT.editGoalAria}
              />
              <Input
                className="inline-input subtle"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={UI_TEXT.editIdentityAria}
              />
            </>
          ) : (
            <>
              <h3 className="goal-title">{goal.title}</h3>
              <p className="identity">{formatIdentitySentence(goal.identitySentence)}</p>
            </>
          )}
        </div>

        <div className="goal-card__footer" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <>
              <Button className="pill-button" onClick={handleSave}>
                {UI_TEXT.save}
              </Button>
              <Button className="link-button" onClick={() => setIsEditing(false)}>
                {UI_TEXT.cancel}
              </Button>
            </>
          ) : (
            <>
              <Button className="link-button" onClick={() => setIsEditing(true)}>
                {UI_TEXT.edit}
              </Button>
              <Button className="link-button danger" onClick={() => onDelete(goal.id)}>
                {UI_TEXT.delete}
              </Button>
            </>
          )}
        </div>
      </article>
    );
  }
);

NoteCard.displayName = 'NoteCard';

export default NoteCard;
