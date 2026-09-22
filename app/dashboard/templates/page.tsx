// app/dashboard/templates/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveTemplateAction } from "@/actions/templates";
import { Modal } from "@/components/Modal"; // IMPORTAMOS EL MODAL

export default function TemplatesPage() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // ESTADOS PARA EL MODAL DE ERROR
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warning" | "success" | "danger";
    isSuccessRedirect?: boolean;
  }>({ isOpen: false, title: "", message: "", type: "warning" });

  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setPositions([]);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    const realX = Math.round(e.nativeEvent.offsetX * scaleX);
    const realY = Math.round(e.nativeEvent.offsetY * scaleY);

    setPositions([...positions, { x: realX, y: realY }]);
  };

  const handleSave = async () => {
    if (!imageFile || !templateName || positions.length === 0) return;
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", templateName);
      formData.append("positions", JSON.stringify(positions));

      const result = await saveTemplateAction(formData);
      
      if (result?.error) {
        setModalState({ isOpen: true, title: "No se pudo guardar", message: result.error, type: "warning" });
        setIsSaving(false);
      } else if (result?.success) {
        // AQUÍ MOSTRAMOS EL ÉXITO EN LUGAR DE REDIRIGIR INMEDIATAMENTE
        setModalState({ 
          isOpen: true, 
          title: "¡Plantilla Creada!", 
          message: "Tu diseño se ha guardado correctamente.", 
          type: "success",
          isSuccessRedirect: true 
        });
        setIsSaving(false);
      }
    } catch (error) {
      setModalState({ isOpen: true, title: "Error de conexión", message: "Ocurrió un problema inesperado.", type: "danger" });
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
    <div className="space-y-6">
      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.type === "success" ? "Continuar" : "Entendido"}
        cancelText={modalState.type === "success" ? null : undefined} // Oculta cancelar si es éxito
        onConfirm={closeModal}
        onCancel={modalState.type !== "success" ? closeModal : undefined}
      />

      <div>
        <h1 className="text-3xl font-black text-[var(--navy)] tracking-tight">Configurar Plantilla</h1>
        <p className="text-[var(--navy)]/60 font-medium mt-1">Sube la imagen del bono, nombra tu plantilla y marca las posiciones.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--accent)]/20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">Nombre de la Plantilla</label>
          <input 
            type="text" 
            placeholder="Ej: Bono 4 Cifras Diario"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full h-[42px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">Imagen del formato (PNG/JPG)</label>
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            onChange={handleImageSelect}
            className="block w-full text-sm text-[var(--navy)] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--secondary)] cursor-pointer"
          />
        </div>
      </div>

      {imageSrc && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--accent)]/20 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="font-bold text-[var(--navy)]">Visualizador Interactivo</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setPositions(positions.slice(0, -1))}
                disabled={positions.length === 0 || isSaving}
                className="px-4 py-2 bg-[var(--surface)] text-[var(--navy)] font-bold rounded-lg disabled:opacity-50 hover:bg-[var(--accent)]/20 transition-colors text-sm"
              >
                Deshacer punto
              </button>
              
              {/* NUEVO BOTÓN DE CANCELAR EN LA CREACIÓN */}
              <button 
                onClick={() => router.push("/dashboard")}
                disabled={isSaving}
                className="px-6 py-2 bg-[var(--surface)] text-[var(--navy)] font-bold rounded-lg disabled:opacity-50 hover:bg-[var(--background)] transition-colors border border-[var(--accent)]/20 text-sm"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleSave}
                disabled={positions.length === 0 || !templateName || isSaving}
                className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-[var(--secondary)] transition-colors text-sm shadow-md"
              >
                {isSaving ? "Guardando..." : "Guardar Plantilla"}
              </button>
            </div>
          </div>

          <div className="relative inline-block border-2 border-dashed border-[var(--accent)]/50 rounded-lg overflow-hidden cursor-crosshair">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Plantilla Interactiva"
              className="max-w-[800px] w-full h-auto select-none"
              onClick={handleImageClick}
              draggable={false}
            />
            {positions.map((pos, index) => {
              if (!imageRef.current) return null;
              const scaleX = imageRef.current.width / imageRef.current.naturalWidth;
              const scaleY = imageRef.current.height / imageRef.current.naturalHeight;
              return (
                <div
                  key={index}
                  className="absolute w-6 h-6 bg-[var(--primary)] text-white text-xs font-black rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-md border border-white"
                  style={{ left: pos.x * scaleX, top: pos.y * scaleY }}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          {positions.length > 0 && (
            <div className="mt-6 w-full p-4 bg-[var(--background)] rounded-lg border border-[var(--accent)]/30">
              <h4 className="font-black text-[var(--navy)] text-sm mb-2">Posiciones a guardar: {positions.length}</h4>
              <div className="flex flex-wrap gap-2">
                {positions.map((p, i) => (
                  <span key={i} className="bg-white border border-[var(--accent)]/40 text-[var(--navy)] px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">
                    {i + 1}: <span className="text-[var(--primary)]">{p.x}, {p.y}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}