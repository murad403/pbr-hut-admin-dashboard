"use client";

import { cn } from "@/lib/utils";

type CustomPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

const CustomPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: CustomPaginationProps) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-title disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "h-9 min-w-9 rounded-full border px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                page === pageNumber
                  ? "border-[#D94906] bg-[#D94906] text-white"
                  : "border-black/10 bg-white text-title hover:border-[#D94906]/40"
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-title disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
