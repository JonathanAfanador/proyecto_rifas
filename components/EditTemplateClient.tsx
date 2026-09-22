// components/EditTemplateClient.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateTemplateAction } from "@/actions/edit";
import { Modal } from "@/components/Modal"; // IMPORTAMOS EL MODAL

// Definimos la estructura de los datos que recibiremos de Prisma
interface TemplateData {
  id: string;
  name: string;
  imageUrl: string;
  positions: { x: number; y: number }[];
}

export function EditTemplateClient({ template }: { template: TemplateData }) {
  const router = useRouter();
  
  // Precargamos los estados con los datos actuales de la plantilla
  const [templateName, setTemplateName] = useState(template.name);
  const [imageSrc, setImageSrc] = useState<string>(template.imageUrl);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>(template.positions);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // ESTADOS PARA EL MODAL DE ERROR
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "" });
  
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setPositions([]); // Reseteamos posiciones si cambia la imagen
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
    if (!templateName || positions.length === 0) return;
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("id", template.id);
      formData.append("name", templateName);
      formData.append("positions", JSON.stringify(positions));
      formData.append("currentImageUrl", template.imageUrl);
      
      // Solo enviamos el archivo si el usuario seleccionó uno nuevo
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const result = await updateTemplateAction(formData);
      
      if (result?.error) {
        // EN LUGAR DE alert(), ABRIMOS EL MODAL
        setModalState({ isOpen: true, title: "Error de validación", message: result.error });
        setIsSaving(false);
      } else if (result?.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      // EN LUGAR DE alert(), ABRIMOS EL MODAL
      setModalState({ isOpen: true, title: "Fallo de servidor", message: "Ocurrió un error de conexión al guardar los cambios." });
      setIsSaving(false);
    }
  };

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  return (
    <div className="space-y-6">
      
      {/* RENDERIZAMOS EL MODAL DE ERROR */}
      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type="warning"
        confirmText="Entendido"
        onConfirm={closeModal}
        onCancel={closeModal}
      />

      <div>
        <h1 className="text-3xl font-black text-[var(--navy)] tracking-tight">Editar Plantilla Completa</h1>
        <p className="text-[var(--navy)]/60 font-medium mt-1">
          Edita el nombre, sube una nueva imagen o remarca las posiciones.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--accent)]/20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">Nombre de la Plantilla</label>
          <input 
            type="text" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full h-[42px] px-4 border border-[var(--accent)]/30 rounded-lg bg-[var(--surface)]/40 text-[var(--navy)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--navy)] uppercase mb-2">
            Cambiar Imagen (Opcional)
          </label>
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            onChange={handleImageSelect}
            className="block w-full text-sm text-[var(--navy)] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--secondary)] cursor-pointer"
          />
          <p className="text-xs text-orange-600 mt-1">
            *Si subes una nueva imagen, se borrarán las posiciones actuales y deberás marcarlas de nuevo.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--accent)]/20 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="font-bold text-[var(--navy)]">Visualizador Interactivo (Posiciones Actuales)</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setPositions([])} // Botón para limpiar todas las posiciones rápidamente
              disabled={positions.length === 0 || isSaving}
              className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg disabled:opacity-50 hover:bg-red-100 transition-colors text-sm border border-red-200"
            >
              Borrar todas
            </button>
            <button 
              onClick={() => setPositions(positions.slice(0, -1))}
              disabled={positions.length === 0 || isSaving}
              className="px-4 py-2 bg-[var(--surface)] text-[var(--navy)] font-bold rounded-lg disabled:opacity-50 hover:bg-[var(--accent)]/20 transition-colors text-sm"
            >
              Deshacer último punto
            </button>
            
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
              {isSaving ? "Guardando..." : "Guardar Cambios"}
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
            <h4 className="font-black text-[var(--navy)] text-sm mb-2">Posiciones marcadas: {positions.length}</h4>
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
    </div>
  );
}