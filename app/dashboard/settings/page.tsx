// app/dashboard/settings/page.tsx
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

// ─── Iconos ───────────────────────────────────────────────────────────────────
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(date: Date | null | undefined): string {
  if (!date) return "Nunca";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// ─── Subcomponentes de sección ────────────────────────────────────────────────
function SectionCard({
  title,
  description,
  icon,
  iconBg,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--accent)]/20 shadow-sm overflow-hidden">
      {/* Header de la tarjeta */}
      <div className="px-6 py-5 border-b border-[var(--accent)]/10 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h2 className="font-black text-[var(--navy)] text-sm leading-tight">{title}</h2>
          <p className="text-[11px] text-[var(--navy)]/45 font-medium mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--accent)]/8 last:border-0">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--navy)]/45 flex-shrink-0">
        {label}
      </span>
      <span className="text-xs font-bold text-[var(--navy)] text-right">{value}</span>
    </div>
  );
}

function StatusDot({ online }: { online: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-black ${online ? "text-green-700" : "text-red-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`} />
      {online ? "Conectado" : "Sin conexión"}
    </span>
  );
}

// ─── Prueba de conectividad Prisma ────────────────────────────────────────────
async function checkPrismaHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// ─── Página ────────────────────────────────────────────────────────────────────
export default async function SettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;

  if (!userId) redirect("/login");

  // Obtener datos de usuario + salud de la BD en paralelo
  const [user, dbOnline] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    }),
    checkPrismaHealth(),
  ]);

  if (!user) redirect("/login");

  // Detectar si Supabase Storage está configurado
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseConfigured = Boolean(supabaseUrl && supabaseUrl.startsWith("https://"));

  // Versión de Next.js
  const nextVersion = process.env.npm_package_dependencies_next ?? "16.x";

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Encabezado */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--navy)] text-[var(--accent)] flex items-center justify-center shadow-sm">
          <IconSettings />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--secondary)] mb-0.5">
            Sistema
          </p>
          <h1 className="text-3xl font-black text-[var(--navy)] tracking-tight leading-none">
            Configuración
          </h1>
          <p className="text-[var(--navy)]/50 text-sm font-medium mt-1">
            Administra tu cuenta y revisa el estado de la plataforma.
          </p>
        </div>
      </div>

      {/* ── 1. PERFIL ──────────────────────────────────────────────────────── */}
      <SectionCard
        title="Perfil del Administrador"
        description="Datos de la sesión activa"
        icon={<IconUser />}
        iconBg="bg-[var(--accent)] text-[var(--navy)]"
      >
        {/* Avatar con inicial */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--navy)] flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-2xl font-black text-[var(--accent)]">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-black text-[var(--navy)] text-base leading-tight">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[var(--accent)] text-[var(--navy)]">
                {user.role}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${user.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`} />
                {user.status === "ACTIVE" ? "Activo" : "Suspendido"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)]/60 rounded-xl p-4 space-y-0">
          <InfoRow label="Correo electrónico" value={user.email} />
          <InfoRow label="Rol" value={user.role === "SUPERADMIN" ? "Super Administrador" : "Administrador"} />
          <InfoRow label="Último acceso" value={formatDate(user.lastLoginAt)} />
          <InfoRow label="Cuenta creada" value={formatDate(user.createdAt)} />
        </div>
      </SectionCard>

      {/* ── 2. SEGURIDAD ───────────────────────────────────────────────────── */}
      <SectionCard
        title="Seguridad / Contraseña"
        description="Cambia tu contraseña de acceso al panel"
        icon={<IconLock />}
        iconBg="bg-[var(--primary)]/10 text-[var(--primary)]"
      >
        <div className="max-w-sm">
          <ChangePasswordForm />
        </div>
      </SectionCard>

      {/* ── 3. SISTEMA ─────────────────────────────────────────────────────── */}
      <SectionCard
        title="Información del Sistema"
        description="Estado técnico de la plataforma"
        icon={<IconServer />}
        iconBg="bg-[var(--navy)]/8 text-[var(--navy)]"
      >
        <div className="bg-[var(--surface)]/60 rounded-xl p-4 space-y-0">
          <InfoRow label="Plataforma" value="Bono Diario v1.0" />
          <InfoRow
            label="Next.js"
            value={
              <span className="font-black text-[var(--navy)]">
                {nextVersion}
              </span>
            }
          />
          <InfoRow
            label="Base de datos (Prisma)"
            value={<StatusDot online={dbOnline} />}
          />
          <InfoRow
            label="Supabase Storage"
            value={<StatusDot online={supabaseConfigured} />}
          />
          <InfoRow
            label="Entorno"
            value={
              <span className={`font-black ${process.env.NODE_ENV === "production" ? "text-green-700" : "text-amber-600"}`}>
                {process.env.NODE_ENV === "production" ? "Producción" : "Desarrollo"}
              </span>
            }
          />
        </div>
      </SectionCard>

    </div>
  );
}
