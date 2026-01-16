import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import AboutModal from './components/AboutModal';
import GoalsCanvas from './components/GoalsCanvas';
import GoalsTableSidebar from './components/GoalsTableSidebar';
import Header from './components/Header';
import NewGoalModal from './components/NewGoalModal';
import { useGoalsManager } from './hooks/useGoalsManager';
import { Goal } from './types';
import './styles/layout.css';
import './styles/canvas.css';
import './styles/sidebar.css';
import './styles/modal.css';

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

const DRAG_THRESHOLD_PX = 8;

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
      window.setTimeout(() => el.classList.remove('flash'), 600);
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

  const handleCreateGoal = (values: { title: string; identityPhrase: string }) => {
    addGoal({
      id: crypto.randomUUID(),
      title: values.title,
      identityPhrase: values.identityPhrase,
      completed: false,
      createdAt: Date.now()
    });
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
        if (Math.hypot(dx, dy) <= DRAG_THRESHOLD_PX) {
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
        } catch {
          // Ignore if capture was already released.
        }
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
      window.removeEventListener('pointermove', handleMove, listenerOptions);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [dragging, updateGoalPosition]);

  return (
    <div className="page">
      <Header onOpenAbout={() => setAboutOpen(true)} />
      <div className="appShell layoutGrid">
        <div className="canvasColumn">
          <GoalsCanvas
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
          <GoalsTableSidebar
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
