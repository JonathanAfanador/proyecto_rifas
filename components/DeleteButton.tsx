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
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  const handleConfirmDelete = () => {
    startTransition(async () => {
      if (type === "template") {
        await deleteTemplateAction(id);
      } else if (type === "raffle") {
        await deleteRaffleAction(id);
      }
      setIsModalOpen(false); // Cierra el modal cuando termina
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)} // Abre el modal en lugar de alert
        disabled={isPending}
        className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
          isPending 
            ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
            : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
        }`}
      >
        {isPending ? "Borrando..." : "Eliminar"}
      </button>

      {/* Renderizamos el Modal */}
      <Modal
        isOpen={isModalOpen}
        type="danger"
        title="¿Eliminar registro?"
        message={`¿Estás seguro de que deseas eliminar este ${type === "template" ? "diseño de plantilla" : "historial de rifa"}? Esta acción no se puede deshacer de la vista.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        isProcessing={isPending}
      />
    </>
  );
}