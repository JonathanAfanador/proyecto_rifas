"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener la página actual de la URL, por defecto es 1
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/dashboard?${params.toString()}`);
  };

  if (totalPages <= 1) return null; // No mostrar paginación si solo hay 1 página

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--accent)]/20 bg-white">
      <span className="text-sm text-[var(--navy)]/70">
        Página <span className="font-bold text-[var(--navy)]">{currentPage}</span> de <span className="font-bold text-[var(--navy)]">{totalPages}</span>
      </span>
      
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-bold text-[var(--navy)] bg-[var(--surface)] border border-[var(--accent)]/20 rounded hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-bold text-[var(--navy)] bg-[var(--surface)] border border-[var(--accent)]/20 rounded hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}