import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GOAL_POSITION_DEFAULTS,
  GOAL_STATUS,
  STORAGE_KEYS,
  UI_NUMBERS
} from '../constants';
import type { Goal, GoalFilter, GoalPosition, GoalStatus, NewGoalInput } from '../types';
import { clampPage, getTotalPages, slicePage } from '../utils/pagination';
import { useLocalStorageState } from './useLocalStorageState';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const buildRandomPosition = (): GoalPosition => ({
  x: randomBetween(GOAL_POSITION_DEFAULTS.minX, GOAL_POSITION_DEFAULTS.maxX),
  y: randomBetween(GOAL_POSITION_DEFAULTS.minY, GOAL_POSITION_DEFAULTS.maxY),
  rot: randomBetween(GOAL_POSITION_DEFAULTS.minRot, GOAL_POSITION_DEFAULTS.maxRot)
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getString = (value: unknown) => (typeof value === 'string' ? value : null);

const getNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const coerceStatus = (statusValue: unknown, completedValue: unknown): GoalStatus => {
  if (statusValue === GOAL_STATUS.completed || completedValue === true) {
    return GOAL_STATUS.completed;
  }
  return GOAL_STATUS.active;
};

const coercePosition = (record: Record<string, unknown>): GoalPosition => {
  const position = record.position;
  const positionRecord = isRecord(position) ? position : null;
  const x = getNumber(positionRecord?.x ?? record.x);
  const y = getNumber(positionRecord?.y ?? record.y);
  const rot = getNumber(positionRecord?.rot ?? record.rot);
  return {
    x: x ?? randomBetween(GOAL_POSITION_DEFAULTS.minX, GOAL_POSITION_DEFAULTS.maxX),
    y: y ?? randomBetween(GOAL_POSITION_DEFAULTS.minY, GOAL_POSITION_DEFAULTS.maxY),
    rot: rot ?? randomBetween(GOAL_POSITION_DEFAULTS.minRot, GOAL_POSITION_DEFAULTS.maxRot)
  };
};

const normalizeGoal = (raw: unknown): Goal | null => {
  if (!isRecord(raw)) return null;
  const id = getString(raw.id) ??
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()));
  const title = getString(raw.title) ?? '';
  const identitySentence =
    getString(raw.identitySentence) ?? getString(raw.identityPhrase) ?? '';
  const createdAt = getNumber(raw.createdAt) ?? Date.now();
  const status = coerceStatus(raw.status, raw.completed);
  const position = coercePosition(raw);
  return { id, title, identitySentence, status, createdAt, position };
};

const parseStoredGoals = (raw: string): Goal[] => {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeGoal)
      .filter((goal): goal is Goal => Boolean(goal));
  } catch {
    return [];
  }
};

const serializeGoals = (goals: Goal[]) => JSON.stringify(goals);

export function useGoalsManager() {
  const serializer = useMemo(
    () => ({ parse: parseStoredGoals, stringify: serializeGoals }),
    []
  );
  const [goals, setGoals] = useLocalStorageState<Goal[]>(
    STORAGE_KEYS.goals,
    [],
    serializer
  );
  const [filter, setFilter] = useState<GoalFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const filteredGoals = useMemo(() => {
    switch (filter) {
      case GOAL_STATUS.active:
        return goals.filter((g) => g.status === GOAL_STATUS.active);
      case GOAL_STATUS.completed:
        return goals.filter((g) => g.status === GOAL_STATUS.completed);
      default:
        return goals;
    }
  }, [filter, goals]);

  const totalPages = useMemo(
    () => getTotalPages(filteredGoals.length, UI_NUMBERS.pageSize),
    [filteredGoals.length]
  );
  const currentPage = clampPage(page, totalPages);

  const visibleGoals = useMemo(
    () => slicePage(filteredGoals, currentPage, UI_NUMBERS.pageSize),
    [filteredGoals, currentPage]
  );

  const counts = useMemo(
    () => ({
      active: goals.filter((g) => g.status === GOAL_STATUS.active).length,
      completed: goals.filter((g) => g.status === GOAL_STATUS.completed).length
    }),
    [goals]
  );

  const addGoal = useCallback((goal: NewGoalInput) => {
    const positioned: Goal = {
      ...goal,
      position: buildRandomPosition()
    };
    setGoals((prev) => [positioned, ...prev]);
    setSelectedId(goal.id);
    setPage(0);
  }, [setGoals]);

  const handleToggleComplete = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status:
                g.status === GOAL_STATUS.completed
                  ? GOAL_STATUS.active
                  : GOAL_STATUS.completed
            }
          : g
      )
    );
  }, [setGoals]);

  const handleDelete = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, [setGoals]);

  const handleUpdate = useCallback((next: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === next.id ? next : g)));
    setSelectedId(next.id);
  }, [setGoals]);

  const updateGoalPosition = useCallback((id: string, x: number, y: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, position: { ...g.position, x, y } } : g
      )
    );
  }, [setGoals]);

  const goToPrevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  }, [totalPages]);

  return {
    goals,
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
