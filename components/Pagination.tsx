// components/Pagination.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    // Navega siempre a la ruta actual, no hardcodeada
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--accent)]/20 bg-white">
      <span className="text-sm text-[var(--navy)]/70">
        Página{" "}
        <span className="font-bold text-[var(--navy)]">{currentPage}</span> de{" "}
        <span className="font-bold text-[var(--navy)]">{totalPages}</span>
      </span>

      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-bold text-[var(--navy)] bg-[var(--surface)] border border-[var(--accent)]/20 rounded-lg
                     hover:bg-[var(--background)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-bold text-[var(--navy)] bg-[var(--surface)] border border-[var(--accent)]/20 rounded-lg
                     hover:bg-[var(--background)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}