import { GOAL_STATUS, UI_NUMBERS, UI_TEXT } from '../constants';
import type { GoalStatus } from '../types';

export const formatGoalIndex = (index: number) =>
  String(index).padStart(UI_NUMBERS.indexPadLength, '0');

export const formatGoalsCount = (count: number) =>
  `${count} ${UI_TEXT.goalCountLabel}`;

export const formatCountsSummary = (active: number, completed: number) =>
  `${active} ${UI_TEXT.activeFilter} ${UI_TEXT.countsSeparator} ${completed} ${UI_TEXT.completedFilter}`;

export const formatPaginationLabel = (currentPage: number, totalPages: number) =>
  `${currentPage}/${totalPages}`;

export const formatIdentitySentence = (sentence: string) => {
  const trimmed = sentence.trim();
  const value = trimmed.length > 0 ? trimmed : UI_TEXT.identityFallback;
  return `${UI_TEXT.identityPrefix} ${value}`;
};

export const formatToggleGoalStatusAria = (title: string, status: GoalStatus) => {
  const nextLabel =
    status === GOAL_STATUS.completed ? UI_TEXT.statusNotCompleted : UI_TEXT.statusCompletedLower;
  return `${UI_TEXT.togglePrefix} ${title} ${UI_TEXT.toggleConnector} ${nextLabel}`;
};
