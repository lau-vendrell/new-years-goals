import { forwardRef } from 'react';
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
  onEdit(id: string): void;
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
      onEdit,
      onSelect,
      onDragStart
    },
    ref
  ) => {
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
          if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
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
          <h3 className="goal-title">{goal.title}</h3>
          <p className="identity">{formatIdentitySentence(goal.identitySentence)}</p>
        </div>

        <div className="goal-card__footer" onClick={(e) => e.stopPropagation()}>
          <Button className="link-button" onClick={() => onEdit(goal.id)}>
            {UI_TEXT.edit}
          </Button>
          <Button className="link-button danger" onClick={() => onDelete(goal.id)}>
            {UI_TEXT.delete}
          </Button>
        </div>
      </article>
    );
  }
);

NoteCard.displayName = 'NoteCard';

export default NoteCard;
