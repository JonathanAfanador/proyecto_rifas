"use server";

import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // En los formularios HTML, un checkbox marcado envía el valor "on"
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Por favor completa todos los campos" };
  }

  try {
    // 1. Buscar usuario activo (no eliminado)
    const user = await prisma.user.findFirst({
      where: {
        email,
        status: "ACTIVE",
        deletedAt: null,
      },
    });

    if (!user) {
      return { error: "Credenciales incorrectas" };
    }

    // 2. Verificar contraseña
    const isValid = await compare(password, user.passwordHash);

    if (!isValid) {
      return { error: "Credenciales incorrectas" };
    }

    // 3. Registrar sesión y actualizar último login al mismo tiempo (para mayor rapidez)
    await Promise.all([
      prisma.sessionLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    ]);

    // 4. Crear cookie de sesión HTTP-only
    const cookieStore = await cookies();
    
    // Opciones base de la cookie (seguridad)
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    // Si marcó "Recordarme", la sesión dura 7 días. 
    // Si no lo marcó, no agregamos maxAge (se borra al cerrar el navegador).
    if (remember) {
      cookieOptions.maxAge = 60 * 60 * 24 * 7; 
    }

    cookieStore.set("session", user.id, cookieOptions);

  } catch (error) {
    // Registramos el error real en la consola del servidor para el desarrollador
    console.error("Error en loginAction:", error);
    
    // Le mostramos un mensaje amigable al usuario
    return { error: "Error de conexión con el servidor. Por favor intenta de nuevo." };
  }

  // IMPORTANTE: El redirect de Next.js siempre debe ir FUERA del try/catch
  // porque Next.js internamente lanza un error para hacer la redirección.
  redirect("/dashboard");
}
