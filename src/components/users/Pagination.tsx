"use client";

type Props = { page: number; pages: number; onPage: (p: number) => void };
export default function Pagination({ page, pages, onPage }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        className="px-2 py-1 rounded border"
        disabled={page === 1}>
        Prev
      </button>
      <span className="text-sm">
        Page {page} / {pages}
      </span>
      <button
        onClick={() => onPage(Math.min(pages, page + 1))}
        className="px-2 py-1 rounded border"
        disabled={page === pages}>
        Next
      </button>
    </div>
  );
}
