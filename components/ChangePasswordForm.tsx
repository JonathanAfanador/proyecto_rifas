// components/ChangePasswordForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/actions/settings";

const initialState: ChangePasswordState = {};

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─── Campo de contraseña reutilizable ────────────────────────────────────────
function PasswordField({
  id,
  name,
  label,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-black uppercase tracking-[0.12em] text-[var(--navy)]/60">
        {label}
      </label>
      <input
        type="password"
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
        required
        className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--accent)]/20 rounded-xl
                   text-sm font-medium text-[var(--navy)] placeholder:text-[var(--navy)]/30
                   focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]/50
                   transition-all duration-150"
      />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Limpiar el formulario cuando el cambio sea exitoso
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <PasswordField
        id="currentPassword"
        name="currentPassword"
        label="Contraseña actual"
        placeholder="••••••••"
      />
      <PasswordField
        id="newPassword"
        name="newPassword"
        label="Nueva contraseña"
        placeholder="Mínimo 8 caracteres"
      />
      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar nueva contraseña"
        placeholder="Repite la nueva contraseña"
      />

      {/* Feedback de error */}
      {state.error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs font-bold text-red-700">{state.error}</p>
        </div>
      )}

      {/* Feedback de éxito */}
      {state.success && (
        <div className="flex items-start gap-2.5 p-3.5 bg-green-50 border border-green-200 rounded-xl">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="text-xs font-bold text-green-700">{state.success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                   bg-[var(--navy)] text-white font-black text-sm rounded-xl
                   hover:bg-[var(--primary)] active:scale-[0.98]
                   transition-all duration-200 shadow-sm hover:shadow-md
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Spinner />
            Actualizando…
          </>
        ) : (
          "Actualizar contraseña"
        )}
      </button>
    </form>
  );
}
