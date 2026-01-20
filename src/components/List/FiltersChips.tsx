import { GOAL_STATUS, UI_TEXT } from '../../constants';
import type { GoalFilter } from '../../types';
import Chip from '../UI/Chip';

interface Props {
  filter: GoalFilter;
  onChangeFilter(next: GoalFilter): void;
}

export default function FiltersChips({ filter, onChangeFilter }: Props) {
  return (
    <div className="filtersRow">
      <Chip
        className="filterChip"
        activeClassName="filterChip--active"
        isActive={filter === 'all'}
        onClick={() => onChangeFilter('all')}
      >
        {UI_TEXT.allFilter}
      </Chip>
      <Chip
        className="filterChip"
        activeClassName="filterChip--activeCompleted"
        isActive={filter === GOAL_STATUS.completed}
        onClick={() => onChangeFilter(GOAL_STATUS.completed)}
      >
        {UI_TEXT.completedFilter}
      </Chip>
      <Chip
        className="filterChip"
        activeClassName="filterChip--active"
        isActive={filter === GOAL_STATUS.active}
        onClick={() => onChangeFilter(GOAL_STATUS.active)}
      >
        {UI_TEXT.activeFilter}
      </Chip>
    </div>
  );
}
