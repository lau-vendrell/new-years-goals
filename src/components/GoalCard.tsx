import { forwardRef, useEffect, useState, KeyboardEvent } from 'react';
import { Goal } from '../types';

interface Props {
  goal: Goal;
  selected: boolean;
  isFocused: boolean;
  selectionClass?: string;
  onToggleComplete(id: string): void;
  onDelete(id: string): void;
  onUpdate(next: Goal): void;
  onSelect(id: string): void;
  onDragStart?(e: React.PointerEvent): void;
}

const GoalCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      goal,
      selected,
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
    const [identity, setIdentity] = useState(goal.identityPhrase);

    useEffect(() => {
      if (!isEditing) {
        setTitle(goal.title);
        setIdentity(goal.identityPhrase);
      }
    }, [goal, isEditing]);

    const handleSave = () => {
      if (!title.trim()) {
        setTitle(goal.title);
        setIdentity(goal.identityPhrase);
        setIsEditing(false);
        return;
      }
      onUpdate({
        ...goal,
        title: title.trim(),
        identityPhrase: identity.trim()
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
        setIdentity(goal.identityPhrase);
        setIsEditing(false);
      }
    };

    const style = {
      left: `${goal.x * 100}%`,
      top: `${goal.y * 100}%`,
      transform: `rotate(${goal.rot}deg)`
    } as const;

    return (
      <article
        ref={ref}
        className={`note ${selectionClass || ''} ${goal.completed ? 'is-completed' : ''} ${
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
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => onToggleComplete(goal.id)}
              aria-label={`Marcar ${goal.title} como ${goal.completed ? 'no completado' : 'completado'}`}
            />
            <span className="pill tiny">{goal.completed ? 'Completado' : 'Activo'}</span>
          </label>
        </div>

        <div className="goal-card__body">
          {isEditing ? (
            <>
              <input
                className="inline-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                aria-label="Editar objetivo"
              />
              <input
                className="inline-input subtle"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Editar frase de identidad"
              />
            </>
          ) : (
            <>
              <h3 className="goal-title">{goal.title}</h3>
              <p className="identity">Quién quiero ser: {goal.identityPhrase || '...'}</p>
            </>
          )}
        </div>

        <div className="goal-card__footer" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <>
              <button className="pill-button" type="button" onClick={handleSave}>
                Guardar
              </button>
              <button className="link-button" type="button" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="link-button" type="button" onClick={() => setIsEditing(true)}>
                Editar
              </button>
              <button className="link-button danger" type="button" onClick={() => onDelete(goal.id)}>
                Eliminar
              </button>
            </>
          )}
        </div>
      </article>
    );
  }
);

GoalCard.displayName = 'GoalCard';

export default GoalCard;
