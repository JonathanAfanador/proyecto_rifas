"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
// ELIMINADO: import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveTemplateAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return { error: "No estás autorizado. Inicia sesión nuevamente." };

    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    const positionsJson = formData.get("positions") as string;

    if (!file || !name || !positionsJson) {
      return { error: "Faltan datos requeridos (Imagen, Nombre o Coordenadas)." };
    }

    const positions = JSON.parse(positionsJson);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
      return { error: `Fallo al subir a Supabase: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("templates")
      .getPublicUrl(fileName);

    await prisma.template.create({
      data: {
        name,
        imageUrl: publicUrlData.publicUrl,
        maxPositions: positions.length,
        positions: positions,
      },
    });

    // NUEVO: Retornamos éxito explícito en lugar de forzar un redirect aquí
    return { success: true };

  } catch (error: any) {
    console.error("Error en saveTemplateAction:", error);
    return { error: `Error del servidor: ${error?.message || "Desconocido"}` };
  }
}