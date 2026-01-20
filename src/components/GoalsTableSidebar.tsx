import { PAGE_SIZE } from '../constants';
import { Goal, GoalFilter } from '../types';

interface Props {
  goals: Goal[];
  filter: GoalFilter;
  selectedId: string | null;
  onChangeFilter(next: GoalFilter): void;
  onSelect(id: string): void;
  counts: { active: number; completed: number };
  onAddGoalClick(): void;
  currentPage: number;
  totalPages: number;
  onPrevPage(): void;
  onNextPage(): void;
}

export default function GoalsTableSidebar({
  goals,
  filter,
  selectedId,
  onChangeFilter,
  onSelect,
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
        <div className="filtersRow">
          <button
            className={`filterChip ${filter === 'all' ? 'filterChip--active' : ''}`}
            onClick={() => onChangeFilter('all')}
            type="button"
          >
            Todos
          </button>
          <button
            className={`filterChip ${filter === 'completed' ? 'filterChip--activeCompleted' : ''}`}
            onClick={() => onChangeFilter('completed')}
            type="button"
          >
            Completados
          </button>
          <button
            className={`filterChip ${filter === 'active' ? 'filterChip--active' : ''}`}
            onClick={() => onChangeFilter('active')}
            type="button"
          >
            Activos
          </button>
        </div>
        <div className="goalsCounter">
          <span className="countsDesktop">
            {counts.active} Activos · {counts.completed} Completados
          </span>
          <span className="countsMobile">{totalCount} Objetivos</span>
        </div>
      </div>

      <div className="listContent">
        <table className="goalsTable">
          <tbody>
            <tr className="addRow" onClick={onAddGoalClick}>
              <td className="colIndex">+</td>
              <td className="colTitle">Añadir objetivo</td>
              <td className="colStatus"></td>
            </tr>
            {goals.length === 0 && (
              <tr>
                <td className="colIndex muted">–</td>
                <td className="colTitle muted">Nada por aquí todavía</td>
                <td className="colStatus"></td>
              </tr>
            )}
            {goals.map((goal, idx) => {
              const isSelected = selectedId === goal.id;
              const rowClass = isSelected
                ? goal.completed
                  ? 'rowSelectedCompleted'
                  : 'rowSelectedActive'
                : '';
              return (
                <tr
                  key={goal.id}
                  className={rowClass}
                  onClick={() => onSelect(goal.id)}
                  role="listitem"
                >
                  <td className="colIndex">
                    {String(idx + 1 + currentPage * PAGE_SIZE).padStart(2, '0')}
                  </td>
                  <td className="colTitle">{goal.title}</td>
                  <td className="colStatus">
                    <span className={goal.completed ? 'statusCompleted' : 'statusActive'}>
                      {goal.completed ? 'Completado' : 'Activo'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={currentPage === 0}
          className="paginationBtn"
        >
          ‹
        </button>
        <span className="paginationInfo">{`${currentPage + 1}/${totalPages}`}</span>
        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage >= totalPages - 1}
          className="paginationBtn"
        >
          ›
        </button>
      </div>
    </div>
  );
}
