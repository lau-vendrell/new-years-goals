import type { PointerEvent, RefObject } from 'react';
import { GOAL_STATUS } from '../../constants';
import type { Goal } from '../../types';
import EmptyState from './EmptyState';
import NoteCard from './NoteCard';

interface Props {
  goals: Goal[];
  canvasRef: RefObject<HTMLDivElement>;
  selectedId: string | null;
  focusedId: string | null;
  registerCardRef(id: string): (el: HTMLDivElement | null) => void;
  onCardSelect(id: string): void;
  onToggleComplete(id: string): void;
  onDelete(id: string): void;
  onUpdate(goal: Goal): void;
  onDragStart(event: PointerEvent, goal: Goal): void;
}

export default function Canvas({
  goals,
  canvasRef,
  selectedId,
  focusedId,
  registerCardRef,
  onCardSelect,
  onToggleComplete,
  onDelete,
  onUpdate,
  onDragStart
}: Props) {
  return (
    <div className="goalsCanvas" ref={canvasRef}>
      {goals.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {goals.map((goal) => {
            const selected = selectedId === goal.id;
            const selectionClass = selected
              ? goal.status === GOAL_STATUS.completed
                ? 'noteSelectedCompleted'
                : 'noteSelectedActive'
              : '';
            return (
              <NoteCard
                key={goal.id}
                ref={registerCardRef(goal.id)}
                goal={goal}
                selectionClass={selectionClass}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onSelect={onCardSelect}
                isFocused={focusedId === goal.id}
                onDragStart={(event) => onDragStart(event, goal)}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
