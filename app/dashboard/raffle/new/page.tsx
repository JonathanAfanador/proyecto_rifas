// app/dashboard/raffle/new/page.tsx
"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { createRaffleAction } from "@/actions/raffle";
import Link from "next/link";
import { Modal } from "@/components/Modal"; // IMPORTAMOS EL MODAL

export default function NewRafflePage({ searchParams }: { searchParams: Promise<{ templateId?: string }> }) {
  const router = useRouter();
  
  const resolvedParams = use(searchParams);
  const templateId = resolvedParams.templateId;

  const [isSaving, setIsSaving] = useState(false);
  
  // ESTADOS PARA EL MODAL DE ÉXITO/ERROR
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warning" | "success" | "danger";
    isSuccessRedirect?: boolean;
  }>({ isOpen: false, title: "", message: "", type: "warning" });

  if (!templateId) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-sm border border-[var(--accent)]/20 text-center">
        <p className="text-[var(--navy)] font-bold mb-4">Error: No se seleccionó ninguna plantilla base.</p>
        <Link href="/dashboard" className="text-[var(--primary)] font-bold hover:underline">
          Volver al panel principal
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("templateId", templateId);

    try {
      const result = await createRaffleAction(formData);
      
      if (result?.error) {
        // EN LUGAR DE alert(), ABRIMOS EL MODAL
        setModalState({ isOpen: true, title: "Error al generar", message: result.error, type: "warning" });
        setIsSaving(false);
      } else if (result?.success) {
        // MOSTRAMOS EL MODAL DE ÉXITO VERDE
        setModalState({ 
          isOpen: true, 
          title: "¡PDF Generado!", 
          message: "El sorteo se ha procesado correctamente. Ahora podrás descargar el archivo desde el historial.", 
          type: "success",
          isSuccessRedirect: true 
        });
        setIsSaving(false);
      }
    } catch (error) {
       // EN LUGAR DE alert(), ABRIMOS EL MODAL
       setModalState({ isOpen: true, title: "Error de servidor", message: "Ocurrió un problema inesperado.", type: "danger" });
       setIsSaving(false);
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    // Si era un modal de éxito, al cerrar navegamos al dashboard
    if (modalState.isSuccessRedirect) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* RENDERIZAMOS EL MODAL AL INICIO */}
      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.type === "success" ? "Ir al Historial" : "Entendido"}
        cancelText={modalState.type === "success" ? null : undefined} // Oculta cancelar si es éxito
        onConfirm={closeModal}
        onCancel={modalState.type !== "success" ? closeModal : undefined}
      />

      <div>
        <h1 className="text-3xl font-black text-[var(--navy)] tracking-tight">Configurar Sorteo</h1>
        <p className="text-[var(--navy)]/60 font-medium mt-1">
          Define la matemática de tu rifa. El sistema generará el PDF al guardar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[var(--accent)]/20 space-y-6">
        
        {/* Nombre de la Rifa */}
        <div>
          <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">
            Nombre de la Rifa
          </label>
          <input 
            type="text" 
            name="name"
            required
            placeholder="Ej: Gran Sorteo Navideño 2024"
            className="w-full h-[46px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] outline-none focus:border-[var(--primary)] transition-colors font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rango Inicial */}
          <div>
            <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">
              Número Inicial
            </label>
            <input 
              type="number" 
              name="rangeStart"
              required
              defaultValue={0}
              className="w-full h-[46px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] outline-none focus:border-[var(--primary)] transition-colors font-medium"
            />
          </div>

          {/* Rango Final */}
          <div>
            <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">
              Número Final
            </label>
            <input 
              type="number" 
              name="rangeEnd"
              required
              defaultValue={9999}
              className="w-full h-[46px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] outline-none focus:border-[var(--primary)] transition-colors font-medium"
            />
          </div>

          {/* Cantidad de Dígitos */}
          <div>
            <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">
              Dígitos (Ceros a la izquierda)
            </label>
            <input 
              type="number" 
              name="digits"
              required
              defaultValue={4}
              className="w-full h-[46px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] outline-none focus:border-[var(--primary)] transition-colors font-medium"
            />
            <p className="text-[11px] text-[var(--navy)]/50 mt-1 font-bold">Ej: Si es 4, el número 5 se imprimirá como "0005".</p>
          </div>

          {/* Números por Boleto */}
          <div>
            <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">
              Números por Boleto
            </label>
            <input 
              type="number" 
              name="numbersPerTicket"
              required
              defaultValue={2}
              className="w-full h-[46px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] outline-none focus:border-[var(--primary)] transition-colors font-medium"
            />
            <p className="text-[11px] text-[var(--navy)]/50 mt-1 font-bold">¿Cuántos números diferentes participan en un solo ticket?</p>
          </div>
        </div>

        <div className="pt-4 flex gap-3 border-t border-[var(--accent)]/20">
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-[var(--surface)] text-[var(--navy)] font-bold rounded-lg hover:bg-[var(--accent)]/20 transition-colors text-sm flex items-center justify-center"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            disabled={isSaving}
            className="flex-1 py-3 bg-[var(--primary)] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-[var(--secondary)] transition-colors text-sm shadow-md flex items-center justify-center gap-2"
          >
            {isSaving ? "Generando PDF, por favor espera..." : "Guardar y Generar Sorteo"}
          </button>
        </div>
      </form>
    </div>
  );
}