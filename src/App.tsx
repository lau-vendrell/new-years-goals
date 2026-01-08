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
};

function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [dragging, setDragging] = useState<DragState | null>(null);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cardRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - cardRect.left;
    const offsetY = e.clientY - cardRect.top;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging({
      id: goal.id,
      offsetX,
      offsetY,
      noteWidth: cardRect.width,
      noteHeight: cardRect.height
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
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

    const handleUp = () => {
      setDragging(null);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
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
