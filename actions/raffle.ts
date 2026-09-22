// actions/raffle.ts
"use server";

import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache"; // CAMBIO 1: Importamos revalidatePath en lugar de redirect

// Inicializar cliente de Supabase para el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function createRaffleAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const templateId = formData.get("templateId") as string;
    
    const rangeStart = parseInt(formData.get("rangeStart") as string);
    const rangeEnd = parseInt(formData.get("rangeEnd") as string);
    const digits = parseInt(formData.get("digits") as string);
    const numbersPerTicket = parseInt(formData.get("numbersPerTicket") as string);

    if (!name || !templateId || isNaN(rangeStart) || isNaN(rangeEnd) || isNaN(digits) || isNaN(numbersPerTicket)) {
      return { error: "Todos los campos numéricos son obligatorios y deben ser válidos." };
    }

    // 1. Buscar la plantilla asociada para obtener la imagen y las coordenadas
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return { error: "Plantilla no encontrada." };
    }

    const positions = template.positions as { x: number; y: number }[];

    // 2. Descargar la imagen de la plantilla desde Supabase Storage
    const imageRes = await fetch(template.imageUrl);
    if (!imageRes.ok) {
      return { error: "No se pudo descargar la imagen base de la plantilla." };
    }
    const imageArrayBuffer = await imageRes.arrayBuffer();

    // 3. Generar el PDF utilizando pdf-lib
    const pdfDoc = await PDFDocument.create();
    
    let embeddedImage;
    if (template.imageUrl.endsWith(".png")) {
      embeddedImage = await pdfDoc.embedPng(imageArrayBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imageArrayBuffer);
    }

    const imgDims = embeddedImage.scale(1);
    const pageWidth = imgDims.width;
    const pageHeight = imgDims.height;

    // Crear la lista de números con ceros a la izquierda
    const allNumbers: string[] = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
      allNumbers.push(String(i).padStart(digits, '0'));
    }

    // Dibujar cada página con sus números según la configuración
    for (let i = 0; i < allNumbers.length; i += numbersPerTicket) {
      const chunk = allNumbers.slice(i, i + numbersPerTicket);
      
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });

      chunk.forEach((numStr, index) => {
        const pos = positions[index];
        if (pos) {
          const adjustedY = pageHeight - pos.y;
          page.drawText(numStr, {
            x: pos.x,
            y: adjustedY,
            size: 24,
            color: rgb(0.95, 0.20, 0.04), // Color primario
          });
        }
      });
    }

    const pdfBytes = await pdfDoc.save();

    // 4. Subir el PDF resultante a Supabase Storage
    const pdfFileName = `raffle-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(pdfFileName, pdfBytes, { contentType: "application/pdf" });

    if (uploadError) {
      return { error: `Error al subir el PDF a Supabase: ${uploadError.message}` };
    }

    // Obtener la URL pública del PDF
    const { data: publicUrlData } = supabase.storage
      .from("templates")
      .getPublicUrl(pdfFileName);

    const pdfUrl = publicUrlData.publicUrl;

    // 5. Guardar la rifa directamente como COMPLETED en Prisma con su URL lista
    await prisma.raffle.create({
      data: {
        name,
        templateId,
        rangeStart,
        rangeEnd,
        digits,
        numbersPerTicket,
        status: "COMPLETED",
        pdfUrl: pdfUrl,
      },
    });

    // CAMBIO 2: En lugar de redirigir, refrescamos la caché y devolvemos éxito
    revalidatePath("/dashboard");
    return { success: true };

  } catch (error: any) {
    console.error("Error al generar la rifa:", error);
    return { error: "Ocurrió un error inesperado al generar el PDF." };
  }
}