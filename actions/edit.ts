// actions/edit.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente de Supabase (usamos las mismas credenciales que en templates.ts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function updateTemplateAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const positionsJson = formData.get("positions") as string;
  const imageFile = formData.get("image") as File | null;
  const currentImageUrl = formData.get("currentImageUrl") as string;

  if (!id || !name || !positionsJson) {
    return { error: "Faltan datos requeridos (nombre o posiciones)." };
  }

  const positions = JSON.parse(positionsJson);
  let finalImageUrl = currentImageUrl;

  // Si el usuario subió una imagen nueva, la procesamos en Supabase
  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("templates")
      .upload(fileName, imageFile, { contentType: imageFile.type });

    if (uploadError) {
      console.error("Error subiendo nueva imagen:", uploadError);
      return { error: "Fallo al subir la nueva imagen a Supabase." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("templates")
      .getPublicUrl(fileName);

    finalImageUrl = publicUrlData.publicUrl;
  }

  try {
    // Actualizamos TODOS los campos de la plantilla en Prisma
    await prisma.template.update({
      where: { id },
      data: { 
        name: name.trim(),
        imageUrl: finalImageUrl,
        positions: positions,
        maxPositions: positions.length
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error actualizando plantilla:", error);
    return { error: "Error al actualizar la plantilla en la base de datos." };
  }
}