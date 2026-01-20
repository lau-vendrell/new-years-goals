export type GoalStatus = 'active' | 'completed';

export type GoalFilter = 'all' | GoalStatus;

export type GoalPosition = {
  x: number;
  y: number;
  rot: number;
};

export type Goal = {
  id: string;
  title: string;
  identitySentence: string;
  status: GoalStatus;
  createdAt: number;
  position: GoalPosition;
};

export type NewGoalInput = Omit<Goal, 'position'>;
