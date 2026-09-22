// actions/delete.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTemplateAction(templateId: string) {
  try {
    await prisma.template.update({
      where: { id: templateId },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar la plantilla." };
  }
}

export async function deleteRaffleAction(raffleId: string) {
  try {
    await prisma.raffle.update({
      where: { id: raffleId },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el historial." };
  }
}