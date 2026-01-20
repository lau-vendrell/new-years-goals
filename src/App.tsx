import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Canvas } from './components/Canvas';
import { Header } from './components/Header';
import { GoalsTable } from './components/List';
import { AboutModal, NewGoalModal } from './components/Modals';
import { UI_NUMBERS } from './constants';
import { useGoalsManager } from './hooks/useGoalsManager';
import type { Goal, NewGoalInput } from './types';
import './styles/layout.css';
import './styles/components/canvas.css';
import './styles/components/list.css';
import './styles/components/modal.css';
import './styles/components/ui.css';

type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
  noteWidth: number;
  noteHeight: number;
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  isActive: boolean;
  target: HTMLElement | null;
};

function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const bodyOverflowRef = useRef<string | null>(null);

  const {
    filter,
    setFilter,
    selectedId,
    setSelectedId,
    focusedId,
    setFocusedId,
    filteredGoals,
    visibleGoals,
    counts,
    pagination: { currentPage, totalPages, goToPrevPage, goToNextPage },
    addGoal,
    handleToggleComplete,
    handleDelete,
    handleUpdate,
    updateGoalPosition
  } = useGoalsManager();

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const scrollToCard = (id: string) => {
    setSelectedId(id);
    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('flash');
      window.setTimeout(() => el.classList.remove('flash'), UI_NUMBERS.flashDurationMs);
    }
  };

  const handleSidebarSelect = (id: string) => {
    setFocusedId(null);
    scrollToCard(id);
  };

  const handleCardSelect = (id: string) => {
    setFocusedId(id);
    scrollToCard(id);
  };

  const registerCardRef = (id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el;
  };

  const handleCreateGoal = (values: NewGoalInput) => {
    addGoal(values);
  };

  const startDrag = (e: ReactPointerEvent, goal: Goal) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const target = e.currentTarget as HTMLElement;
    const cardRect = target.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - cardRect.left;
    const offsetY = e.clientY - cardRect.top;
    target.setPointerCapture(e.pointerId);
    setDragging({
      id: goal.id,
      offsetX,
      offsetY,
      noteWidth: cardRect.width,
      noteHeight: cardRect.height,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      isActive: e.pointerType === 'mouse',
      target
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: PointerEvent) => {
      if (e.pointerId !== dragging.pointerId) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      let isActive = dragging.isActive;
      if (!isActive) {
        const dx = e.clientX - dragging.startX;
        const dy = e.clientY - dragging.startY;
        if (Math.hypot(dx, dy) <= UI_NUMBERS.dragThreshold) {
          return;
        }
        isActive = true;
        setDragging((prev) => (prev ? { ...prev, isActive: true } : prev));
        if (dragging.pointerType === 'touch' && bodyOverflowRef.current === null) {
          bodyOverflowRef.current = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
        }
      }
      if (!isActive) return;
      e.preventDefault();
      const canvasRect = canvas.getBoundingClientRect();
      const left = e.clientX - canvasRect.left - dragging.offsetX;
      const top = e.clientY - canvasRect.top - dragging.offsetY;
      const maxX = Math.max(canvasRect.width - dragging.noteWidth, 0);
      const maxY = Math.max(canvasRect.height - dragging.noteHeight, 0);
      const clampedX = Math.min(Math.max(left, 0), maxX);
      const clampedY = Math.min(Math.max(top, 0), maxY);
      const relX = canvasRect.width ? clampedX / canvasRect.width : 0;
      const relY = canvasRect.height ? clampedY / canvasRect.height : 0;
      updateGoalPosition(dragging.id, relX, relY);
    };

    const handleUp = (e: PointerEvent) => {
      if (e.pointerId !== dragging.pointerId) return;
      setDragging(null);
      if (dragging.target && dragging.target.hasPointerCapture(dragging.pointerId)) {
        try {
          dragging.target.releasePointerCapture(dragging.pointerId);
        } catch {}
      }
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      }
    };

    const listenerOptions = { passive: false } as const;
    window.addEventListener('pointermove', handleMove, listenerOptions);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove, false);
      window.removeEventListener('pointerup', handleUp, false);
      window.removeEventListener('pointercancel', handleUp, false);
    };
  }, [dragging, updateGoalPosition]);

  return (
    <div className="page">
      <Header onOpenAbout={() => setAboutOpen(true)} />
      <main className="mainContainer layoutGrid">
        <div className="mainInner appShell">
          <div className="canvasColumn">
            <Canvas
              goals={filteredGoals}
              canvasRef={canvasRef}
              selectedId={selectedId}
              focusedId={focusedId}
              registerCardRef={registerCardRef}
              onCardSelect={handleCardSelect}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onDragStart={startDrag}
            />
          </div>
          <aside className="listColumn">
            <GoalsTable
              goals={visibleGoals}
              filter={filter}
              onChangeFilter={setFilter}
              selectedId={selectedId}
              onSelect={handleSidebarSelect}
              onAddGoalClick={() => setNewGoalOpen(true)}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={goToPrevPage}
              onNextPage={goToNextPage}
              counts={counts}
            />
          </aside>
        </div>
      </main>
      <NewGoalModal
        open={newGoalOpen}
        onClose={() => setNewGoalOpen(false)}
        onSubmit={handleCreateGoal}
      />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}

export default App;
