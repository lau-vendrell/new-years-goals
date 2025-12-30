import { Goal } from '../types';

const STORAGE_KEY = 'goals_v1';

export function loadGoals(): Goal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Goal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('No se pudieron cargar los objetivos', err);
    return [];
  }
}

export function saveGoals(goals: Goal[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (err) {
    console.warn('No se pudieron guardar los objetivos', err);
  }
}
