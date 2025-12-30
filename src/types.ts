export type GoalFilter = 'all' | 'active' | 'completed';

export interface Goal {
  id: string;
  title: string;
  identityPhrase: string;
  completed: boolean;
  createdAt: number;
  x: number; // 0..1
  y: number; // 0..1
  rot: number; // degrees
}
