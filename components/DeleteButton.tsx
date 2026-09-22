// components/DeleteButton.tsx
"use client";

import { useTransition, useState } from "react";
import { deleteTemplateAction, deleteRaffleAction } from "@/actions/delete";
import { Modal } from "@/components/Modal";

interface DeleteButtonProps {
  id: string;
  type: "template" | "raffle";
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    startTransition(async () => {
      if (type === "template") {
        await deleteTemplateAction(id);
      } else if (type === "raffle") {
        await deleteRaffleAction(id);
      }
      setIsModalOpen(false);
    });
  };

  // Estilos diferenciados según el contexto (tarjeta de plantilla vs fila de tabla)
  const isTemplate = type === "template";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        title="Eliminar"
        className={
          isTemplate
            ? // Botón secundario en tarjeta de plantilla (ancho completo del flex-1)
              `w-full inline-flex items-center justify-center gap-1 py-2 text-[11px] font-black
               rounded-lg border transition-all duration-150
               ${
                 isPending
                   ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                   : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 active:scale-95"
               }`
            : // Botón compacto en fila de tabla de historial
              `inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-150
               ${
                 isPending
                   ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                   : "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:border-red-300 active:scale-95"
               }`
        }
      >
        {isPending ? (
          /* Spinner minimalista */
          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          /* Ícono de papelera */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        )}
        {/* Texto solo en contexto de tarjeta */}
        {isTemplate && !isPending && (
          <span>Eliminar</span>
        )}
        {isTemplate && isPending && (
          <span>Eliminando…</span>
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        type="danger"
        title="¿Eliminar registro?"
        message={`¿Estás seguro de que deseas eliminar este ${
          type === "template" ? "diseño de plantilla" : "historial de rifa"
        }? Esta acción no se puede deshacer de la vista.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        isProcessing={isPending}
      />
    </>
  );
}