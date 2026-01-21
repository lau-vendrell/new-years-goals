import { GOAL_STATUS, UI_NUMBERS, UI_TEXT } from '../../constants';
import type { Goal, GoalFilter } from '../../types';
import {
  formatCountsSummary,
  formatGoalIndex,
  formatGoalsCount
} from '../../utils/formatters';
import FiltersChips from './FiltersChips';
import Pagination from './Pagination';

interface Props {
  goals: Goal[];
  filter: GoalFilter;
  selectedId: string | null;
  onChangeFilter(next: GoalFilter): void;
  onSelect(id: string): void;
  onEdit(id: string): void;
  counts: { active: number; completed: number };
  onAddGoalClick(): void;
  currentPage: number;
  totalPages: number;
  onPrevPage(): void;
  onNextPage(): void;
}

export default function GoalsTable({
  goals,
  filter,
  selectedId,
  onChangeFilter,
  onSelect,
  onEdit,
  onAddGoalClick,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  counts
}: Props) {
  const totalCount = counts.active + counts.completed;

  return (
    <div className="listPanel">
      <div className="listHeader">
        <div className="filtersBlock">
          <FiltersChips filter={filter} onChangeFilter={onChangeFilter} />
          <div className="countsMobile">{formatGoalsCount(totalCount)}</div>
        </div>
        <div className="goalsCounter">
          <span className="countsDesktop">
            {formatCountsSummary(counts.active, counts.completed)}
          </span>
        </div>
      </div>

      <div className="listContent">
        <table className="goalsTable">
          <tbody>
            <tr className="addRow" onClick={onAddGoalClick}>
              <td className="colIndex">{UI_TEXT.addRowSymbol}</td>
              <td className="colTitle">{UI_TEXT.addGoal}</td>
              <td className="colStatus"></td>
            </tr>
            {goals.length === 0 && (
              <tr>
                <td className="colIndex muted">{UI_TEXT.emptyRowSymbol}</td>
                <td className="colTitle muted">{UI_TEXT.emptyList}</td>
                <td className="colStatus"></td>
              </tr>
            )}
            {goals.map((goal, idx) => {
              const isSelected = selectedId === goal.id;
              const rowClass = isSelected
                ? goal.status === GOAL_STATUS.completed
                  ? 'rowSelectedCompleted'
                  : 'rowSelectedActive'
                : '';
              const itemIndex = idx + 1 + currentPage * UI_NUMBERS.pageSize;
              return (
                <tr
                  key={goal.id}
                  className={rowClass}
                  onClick={() => onSelect(goal.id)}
                  onDoubleClick={() => onEdit(goal.id)}
                  role="listitem"
                >
                  <td className="colIndex">{formatGoalIndex(itemIndex)}</td>
                  <td className="colTitle">{goal.title}</td>
                  <td className="colStatus">
                    <span
                      className={
                        goal.status === GOAL_STATUS.completed
                          ? 'statusCompleted'
                          : 'statusActive'
                      }
                    >
                      {goal.status === GOAL_STATUS.completed
                        ? UI_TEXT.statusCompleted
                        : UI_TEXT.statusActive}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </div>
  );
}
