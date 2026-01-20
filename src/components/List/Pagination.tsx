import { UI_TEXT } from '../../constants';
import { formatPaginationLabel } from '../../utils/formatters';
import IconButton from '../UI/IconButton';

interface Props {
  currentPage: number;
  totalPages: number;
  onPrevPage(): void;
  onNextPage(): void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage
}: Props) {
  return (
    <div className="pagination">
      <IconButton
        onClick={onPrevPage}
        disabled={currentPage === 0}
        className="paginationBtn"
        aria-label={UI_TEXT.prevPageAria}
      >
        {UI_TEXT.paginationPrevGlyph}
      </IconButton>
      <span className="paginationInfo">
        {formatPaginationLabel(currentPage + 1, totalPages)}
      </span>
      <IconButton
        onClick={onNextPage}
        disabled={currentPage >= totalPages - 1}
        className="paginationBtn"
        aria-label={UI_TEXT.nextPageAria}
      >
        {UI_TEXT.paginationNextGlyph}
      </IconButton>
    </div>
  );
}
