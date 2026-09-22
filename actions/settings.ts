// actions/settings.ts
"use server";

import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";

export type ChangePasswordState = {
  error?: string;
  success?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;

  if (!userId) {
    return { error: "Sesión no encontrada. Por favor inicia sesión de nuevo." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // ── Validaciones básicas ──────────────────────────────────────────────────
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Por favor completa todos los campos." };
  }

  if (newPassword.length < 8) {
    return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "La nueva contraseña y la confirmación no coinciden." };
  }

  if (currentPassword === newPassword) {
    return { error: "La nueva contraseña debe ser diferente a la actual." };
  }

  try {
    // ── Buscar usuario activo ─────────────────────────────────────────────
    const user = await prisma.user.findFirst({
      where: { id: userId, status: "ACTIVE", deletedAt: null },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      return { error: "Usuario no encontrado o inactivo." };
    }

    // ── Verificar contraseña actual ────────────────────────────────────────
    const isValid = await compare(currentPassword, user.passwordHash);

    if (!isValid) {
      return { error: "La contraseña actual es incorrecta." };
    }

    // ── Hashear y guardar la nueva ─────────────────────────────────────────
    const newHash = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash, updatedAt: new Date() },
    });

    return { success: "¡Contraseña actualizada correctamente!" };
  } catch (error) {
    console.error("changePasswordAction error:", error);
    return { error: "Error del servidor. Por favor intenta de nuevo." };
  }
}
