import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { fa, faNumber } from '@/lib/i18n';

interface IProps {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination controls with page-boundary handling.
 *
 * @component
 * @param {PaginationProps} props - Pagination state and callback.
 * @param {number} props.page - Current one-based page.
 * @param {number} props.totalItems - Total number of records.
 * @param {number} props.pageSize - Records per page.
 * @param {(page: number) => void} props.onPageChange - Page change callback.
 * @returns {JSX.Element} Previous/next pagination controls.
 */

export function Pagination({ page, totalItems, pageSize, onPageChange }: IProps) {
  const pages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), pages);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </Button>
      <span>
        {fa.common.page} {faNumber(currentPage)} {fa.common.of} {faNumber(pages)}
      </span>
      <Button
        variant="ghost"
        disabled={currentPage === pages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="rotate-180" size={15} />
      </Button>
    </div>
  );
}
