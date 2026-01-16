import type { PointerEvent, RefObject } from 'react';
import { Goal } from '../types';
import CanvasEmptyState from './CanvasEmptyState';
import GoalCard from './GoalCard';

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

export default function GoalsCanvas({
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
        <CanvasEmptyState />
      ) : (
        <>
          {goals.map((goal) => {
            const selected = selectedId === goal.id;
            const selectionClass = selected
              ? goal.completed
                ? 'noteSelectedCompleted'
                : 'noteSelectedActive'
              : '';
            return (
              <GoalCard
                key={goal.id}
                ref={registerCardRef(goal.id)}
                goal={goal}
                selected={selected}
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
