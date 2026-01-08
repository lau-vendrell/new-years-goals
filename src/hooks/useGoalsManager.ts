import { useCallback, useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from '../constants';
import { Goal, GoalFilter } from '../types';
const STORAGE_KEY = 'nygoals:goals:v1';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const withPositionDefaults = (goal: Goal): Goal => ({
  ...goal,
  x: goal.x ?? randomBetween(0.05, 0.85),
  y: goal.y ?? randomBetween(0.05, 0.75),
  rot: goal.rot ?? randomBetween(-3, 3)
});

export function useGoalsManager() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Goal[]).map(withPositionDefaults) : [];
    } catch (e) {
      console.error('Error reading goals from localStorage', e);
      return [];
    }
  });
  const [filter, setFilter] = useState<GoalFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {
      console.error('Error saving goals to localStorage', e);
    }
  }, [goals]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const filteredGoals = useMemo(() => {
    switch (filter) {
      case 'active':
        return goals.filter((g) => !g.completed);
      case 'completed':
        return goals.filter((g) => g.completed);
      default:
        return goals;
    }
  }, [filter, goals]);

  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);

  const visibleGoals = useMemo(
    () =>
      filteredGoals.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE
      ),
    [filteredGoals, currentPage]
  );

  const counts = useMemo(
    () => ({
      active: goals.filter((g) => !g.completed).length,
      completed: goals.filter((g) => g.completed).length
    }),
    [goals]
  );

  const addGoal = useCallback((goal: Omit<Goal, 'x' | 'y' | 'rot'>) => {
    const positioned: Goal = {
      ...goal,
      x: randomBetween(0.05, 0.85),
      y: randomBetween(0.05, 0.75),
      rot: randomBetween(-3, 3)
    };
    setGoals((prev) => [positioned, ...prev]);
    setSelectedId(goal.id);
    setPage(0);
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const handleUpdate = useCallback((next: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === next.id ? next : g)));
    setSelectedId(next.id);
  }, []);

  const updateGoalPosition = useCallback((id: string, x: number, y: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, x, y } : g)));
  }, []);

  const goToPrevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  }, [totalPages]);

  return {
    filter,
    setFilter,
    selectedId,
    setSelectedId,
    focusedId,
    setFocusedId,
    filteredGoals,
    visibleGoals,
    counts,
    pagination: {
      currentPage,
      totalPages,
      goToPrevPage,
      goToNextPage
    },
    addGoal,
    handleToggleComplete,
    handleDelete,
    handleUpdate,
    updateGoalPosition
  };
}
