// components/Modal.tsx
"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success"; // Añadimos success
  confirmText?: string;
  cancelText?: string | null; // Permitimos null para ocultarlo
  onConfirm: () => void;
  onCancel?: () => void; // Lo hacemos opcional
  isProcessing?: boolean;
}

export function Modal({
  isOpen,
  title,
  message,
  type = "danger",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isProcessing = false,
}: ModalProps) {
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Estilos dinámicos según el tipo de modal
  const styles = {
    danger: {
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      iconBg: "bg-red-100",
      buttonBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-yellow-100",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    },
    info: {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-blue-100",
      buttonBg: "bg-[var(--primary)] hover:bg-[var(--secondary)] focus:ring-[var(--primary)]",
    },
    success: {
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      iconBg: "bg-green-100",
      buttonBg: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    }
  };

  const currentStyle = styles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md p-4 animate-in fade-in zoom-in duration-200">
        <div className="relative bg-white rounded-xl shadow-2xl border border-[var(--accent)]/10">
          
          {/* Botón X para cerrar */}
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isProcessing}
            className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors disabled:opacity-50"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Cerrar modal</span>
          </button>
          
          <div className="p-6 text-center">
            {/* Ícono animado */}
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${currentStyle.iconBg}`}>
              {currentStyle.icon}
            </div>
            
            {/* Título y Mensaje */}
            <h3 className="mb-2 text-xl font-black text-[var(--navy)]">{title}</h3>
            <p className="mb-6 text-sm font-medium text-[var(--navy)]/70">
              {message}
            </p>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              
              {/* === ESTA ES LA PARTE QUE CAMBIA === */}
              {cancelText && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-[var(--navy)] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50"
                >
                  {cancelText}
                </button>
              )}
              {/* ================================== */}

              <button
                type="button"
                onClick={onConfirm}
                disabled={isProcessing}
                className={`w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white rounded-lg focus:ring-4 focus:outline-none transition-all shadow-md ${currentStyle.buttonBg} ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}