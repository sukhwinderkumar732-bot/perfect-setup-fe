import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
};

export function Pagination({ page, totalPages, total, onPageChange, isFetching }: PaginationProps) {
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="pagination">
      <span className="muted">
        Page {page} of {Math.max(totalPages, 1)} · {total} total
      </span>
      <div className="actions-row">
        <Button type="button" variant="secondary" disabled={!hasPrevious || isFetching} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} /> Previous
        </Button>
        <Button type="button" variant="secondary" disabled={!hasNext || isFetching} onClick={() => onPageChange(page + 1)}>
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
