// app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// ─── Iconos SVG ───────────────────────────────────────────────────────────────

function IconLayout({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function IconPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconTicket({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 9a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4V9z" />
    </svg>
  );
}

function IconHistory({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function IconEdit({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconEmpty() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 opacity-25" aria-hidden="true">
      <rect x="10" y="10" width="60" height="60" rx="12" stroke="currentColor"
        strokeWidth="2" strokeDasharray="6 4" />
      <path d="M28 40h24M40 28v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconStar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconArrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconDownload({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

import { SearchInput } from "@/components/SearchInput";

// ─── Página principal ──────────────────────────────────────────────────────────
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";

  const templateWhereClause: any = {
    deletedAt: null,
    ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
  };

  // Datos reales desde Prisma
  const [templates, completedRaffles, lastRaffle] = await Promise.all([
    prisma.template.findMany({
      where: templateWhereClause,
      orderBy: { createdAt: "desc" },
    }),
    prisma.raffle.count({
      where: { status: "COMPLETED", deletedAt: null },
    }),
    prisma.raffle.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { name: true, createdAt: true, status: true },
    }),
  ]);

  const totalTemplates = templates.length;

  return (
    <div className="space-y-10">

      {/* ══════════════════════════════════════════════════════════
          CABECERA — Bienvenida editorial
      ══════════════════════════════════════════════════════════ */}
      <header className="relative">
        {/* Decoración geométrica de fondo */}
        <div
          className="absolute -top-4 -right-6 w-48 h-48 rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "var(--primary)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-8 -right-2 w-24 h-24 rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: "var(--accent)" }}
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1"
              style={{ color: "var(--secondary)" }}>
              Centro de Control
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none"
              style={{ color: "var(--navy)" }}>
              Panel Principal
            </h1>
            <p className="mt-2 text-sm font-medium" style={{ color: "rgba(5,20,36,0.45)" }}>
              Gestiona plantillas, genera rifas y descarga PDFs al instante.
            </p>
          </div>

          {/* CTA buttons principales */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/templates"
              className="group inline-flex items-center gap-2 px-5 py-2.5 font-black text-sm rounded-xl shadow-sm
                         hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: "var(--navy)", color: "white" }}
            >
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <IconPlus />
              </span>
              Nueva Plantilla
            </Link>
            <Link
              href="/dashboard/history"
              className="group inline-flex items-center gap-2 px-5 py-2.5 font-black text-sm rounded-xl shadow-sm
                         hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-2"
              style={{
                background: "transparent",
                color: "var(--navy)",
                borderColor: "var(--navy)",
              }}
            >
              <IconHistory />
              Ver Historial
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          KPI CARDS — Métricas operativas
      ══════════════════════════════════════════════════════════ */}
      <section aria-label="Métricas del sistema">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* KPI 1 — Plantillas activas */}
          <div
            className="group relative overflow-hidden rounded-2xl p-6 shadow-sm
                        hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border"
            style={{
              background: "white",
              borderColor: "rgba(252,179,7,0.2)",
            }}
          >
            {/* Accent strip lateral */}
            <div
              className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />
            {/* Decoración de fondo */}
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />

            <div className="pl-3">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: "rgba(252,179,7,0.12)", color: "var(--accent)" }}
                >
                  <IconLayout className="w-5 h-5" />
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: "rgba(252,179,7,0.12)", color: "var(--accent)" }}
                >
                  Activas
                </span>
              </div>
              <p
                className="text-5xl font-black tracking-tight leading-none"
                style={{ color: "var(--navy)" }}
              >
                {totalTemplates}
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(5,20,36,0.45)" }}>
                Plantillas Activas
              </p>
            </div>
          </div>

          {/* KPI 2 — Sorteos completados */}
          <div
            className="group relative overflow-hidden rounded-2xl p-6 shadow-sm
                        hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border"
            style={{
              background: "white",
              borderColor: "rgba(244,53,10,0.15)",
            }}
          >
            <div
              className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
              style={{ background: "var(--primary)" }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-300"
              style={{ background: "var(--primary)" }}
              aria-hidden="true"
            />

            <div className="pl-3">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: "rgba(244,53,10,0.08)", color: "var(--primary)" }}
                >
                  <IconTicket className="w-5 h-5" />
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: "rgba(244,53,10,0.08)", color: "var(--primary)" }}
                >
                  Completados
                </span>
              </div>
              <p
                className="text-5xl font-black tracking-tight leading-none"
                style={{ color: "var(--navy)" }}
              >
                {completedRaffles}
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(5,20,36,0.45)" }}>
                Sorteos Generados
              </p>
            </div>
          </div>

          {/* KPI 3 — Última actividad */}
          <div
            className="group relative overflow-hidden rounded-2xl p-6 shadow-sm
                        hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border"
            style={{
              background: "white",
              borderColor: "rgba(252,179,7,0.15)",
            }}
          >
            <div
              className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-300"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />

            <div className="pl-3">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: "rgba(252,179,7,0.12)", color: "var(--accent)" }}
                >
                  <IconHistory className="w-5 h-5" />
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: "rgba(252,179,7,0.12)", color: "var(--accent)" }}
                >
                  Reciente
                </span>
              </div>

              {lastRaffle ? (
                <>
                  <p
                    className="text-base font-black tracking-tight leading-tight line-clamp-2"
                    style={{ color: "var(--navy)" }}
                  >
                    {lastRaffle.name}
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(5,20,36,0.45)" }}>
                    {formatDate(lastRaffle.createdAt)}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="text-2xl font-black tracking-tight leading-none"
                    style={{ color: "rgba(5,20,36,0.35)" }}
                  >
                    —
                  </p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(5,20,36,0.45)" }}>
                    Última Actividad
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      

      {/* ══════════════════════════════════════════════════════════
          SECCIÓN — PLANTILLAS
      ══════════════════════════════════════════════════════════ */}
      <section>
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: "var(--accent)", color: "var(--navy)" }}
            >
              <IconLayout className="w-5 h-5" />
            </div>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.18em] mb-0.5"
                style={{ color: "var(--secondary)" }}
              >
                Gestor
              </p>
              <h2
                className="text-2xl font-black tracking-tight leading-none"
                style={{ color: "var(--navy)" }}
              >
                Plantillas
              </h2>
              <p className="text-sm font-medium mt-1" style={{ color: "rgba(5,20,36,0.45)" }}>
                Selecciona una base para generar una nueva rifa.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <SearchInput placeholder="Buscar plantilla por nombre..." />
            </div>
            <Link
              href="/dashboard/templates"
              className="group inline-flex items-center gap-2 px-5 py-2.5 font-black text-sm rounded-xl
                         hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap justify-center"
              style={{ background: "var(--navy)", color: "white" }}
            >
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <IconPlus />
              </span>
              Nueva Plantilla
            </Link>
          </div>
        </div>

        {/* Grid de plantillas */}
        {templates.length === 0 ? (
          <div
            className="rounded-2xl border shadow-sm"
            style={{ background: "white", borderColor: "rgba(252,179,7,0.2)" }}
          >
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div style={{ color: "var(--navy)" }}>
                <IconEmpty />
              </div>
              <h3
                className="mt-5 text-lg font-black tracking-tight"
                style={{ color: "var(--navy)" }}
              >
                {query ? "No se encontraron resultados" : "Sin plantillas todavía"}
              </h3>
              <p
                className="mt-2 text-sm font-medium max-w-xs"
                style={{ color: "rgba(5,20,36,0.45)" }}
              >
                {query 
                  ? `No hay ninguna plantilla que coincida con "${query}".`
                  : "Sube tu imagen base y define las coordenadas donde se imprimirán los números."}
              </p>
              {!query && (
                <Link
                  href="/dashboard/templates"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 font-black text-sm rounded-xl
                             hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: "var(--accent)", color: "var(--navy)" }}
                >
                  <IconPlus />
                  Crear primera plantilla
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl border shadow-sm
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                style={{
                  background: "white",
                  borderColor: "rgba(252,179,7,0.18)",
                }}
              >
                {/* Imagen */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--surface)" }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                    aria-hidden="true"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="relative z-10 max-h-36 max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className="absolute top-3 right-3 z-10 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow"
                    style={{ background: "var(--navy)", color: "var(--accent)" }}
                  >
                    {template.maxPositions} pos.
                  </span>
                </div>

                {/* Info + acciones */}
                <div
                  className="p-4 flex-1 flex flex-col justify-between border-t"
                  style={{ borderColor: "rgba(252,179,7,0.1)" }}
                >
                  <div className="mb-4">
                    <h3
                      className="font-black text-base leading-tight line-clamp-2"
                      style={{ color: "var(--navy)" }}
                      title={template.name}
                    >
                      {template.name}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href={`/dashboard/raffle/new?templateId=${template.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 font-black text-xs rounded-xl
                                 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      <IconTicket className="w-4 h-4" />
                      Generar Rifa PDF
                    </Link>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/templates/${template.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-[11px] font-black
                                   rounded-xl border transition-all duration-150"
                        style={{
                          background: "var(--surface)",
                          color: "var(--navy)",
                          borderColor: "rgba(252,179,7,0.2)",
                        }}
                      >
                        <IconEdit />
                        Editar
                      </Link>
                      <div className="flex-1">
                        <DeleteButton id={template.id} type="template" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

{/* ══════════════════════════════════════════════════════════
          GUÍA DE INICIO RÁPIDO — Onboarding Card
      ══════════════════════════════════════════════════════════ */}
      <section aria-label="Guía de inicio rápido">
        <div
          className="rounded-2xl overflow-hidden border shadow-sm"
          style={{
            background: "white",
            borderColor: "rgba(252,179,7,0.2)",
          }}
        >
          {/* Cabecera de la guía */}
          <div
            className="px-6 py-5 border-b flex items-center gap-3"
            style={{
              background: "var(--surface)",
              borderColor: "rgba(252,179,7,0.15)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent)", color: "var(--navy)" }}
            >
              <IconStar className="w-4 h-4" />
            </div>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--secondary)" }}
              >
                Bienvenido al sistema
              </p>
              <h2
                className="text-lg font-black tracking-tight leading-none"
                style={{ color: "var(--navy)" }}
              >
                Guía de Inicio Rápido
              </h2>
            </div>
            <span
              className="ml-auto text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(244,53,10,0.08)",
                color: "var(--primary)",
              }}
            >
              3 pasos
            </span>
          </div>

          {/* Pasos */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Paso 1 */}
            <div className="group flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {/* Badge numérico */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  1
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(244,53,10,0.15)" }}
                  aria-hidden="true"
                />
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(244,53,10,0.07)", color: "var(--primary)" }}
              >
                <IconLayout className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-black text-base tracking-tight"
                  style={{ color: "var(--navy)" }}
                >
                  Crear o Editar Plantilla
                </h3>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "rgba(5,20,36,0.55)" }}
                >
                  Sube la imagen base de tu rifa y haz clic para marcar las{" "}
                  <strong style={{ color: "var(--navy)" }}>coordenadas exactas</strong>{" "}
                  donde se imprimirán los números.
                </p>
              </div>
              <Link
                href="/dashboard/templates"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider
                           hover:gap-2.5 transition-all duration-200"
                style={{ color: "var(--primary)" }}
              >
                Ir a plantillas <IconArrow className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Divisor vertical — solo md+ */}
            <div
              className="hidden md:block absolute self-stretch w-px my-2"
              aria-hidden="true"
            />

            {/* Paso 2 */}
            <div className="group flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm"
                  style={{ background: "var(--secondary)", color: "white" }}
                >
                  2
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(252,86,6,0.15)" }}
                  aria-hidden="true"
                />
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(252,86,6,0.07)", color: "var(--secondary)" }}
              >
                <IconTicket className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-black text-base tracking-tight"
                  style={{ color: "var(--navy)" }}
                >
                  Configurar Sorteo
                </h3>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "rgba(5,20,36,0.55)" }}
                >
                  Ingresa el nombre, el{" "}
                  <strong style={{ color: "var(--navy)" }}>rango numérico</strong>, la
                  cantidad de dígitos y cuántos números lleva cada boleto.
                </p>
              </div>
              <span
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
                style={{ color: "rgba(5,20,36,0.3)" }}
              >
                Desde una plantilla activa
              </span>
            </div>

            {/* Paso 3 */}
            <div className="group flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm"
                  style={{ background: "var(--accent)", color: "var(--navy)" }}
                >
                  3
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(252,179,7,0.2)" }}
                  aria-hidden="true"
                />
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(252,179,7,0.1)", color: "var(--accent)" }}
              >
                <IconDownload className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-black text-base tracking-tight"
                  style={{ color: "var(--navy)" }}
                >
                  Descargar y Listo
                </h3>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "rgba(5,20,36,0.55)" }}
                >
                  El{" "}
                  <strong style={{ color: "var(--navy)" }}>PDF se compila</strong>{" "}
                  automáticamente y queda disponible para descarga en el historial.
                </p>
              </div>
              <Link
                href="/dashboard/history"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider
                           hover:gap-2.5 transition-all duration-200"
                style={{ color: "var(--accent)" }}
              >
                Ver historial <IconArrow className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}