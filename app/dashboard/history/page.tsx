// app/dashboard/history/page.tsx
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { Pagination } from "@/components/Pagination";

// ─── Iconos ───────────────────────────────────────────────────────────────────
function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconEmptyHistory() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 opacity-30" aria-hidden="true">
      <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M40 26v14l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Badge de estado ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; dot: string; bg: string; text: string; border: string; pulse: boolean }> = {
    PENDING: {
      label: "En cola",
      dot: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      pulse: true,
    },
    GENERATING: {
      label: "Procesando",
      dot: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      pulse: true,
    },
    PROCESSING: {
      label: "Procesando",
      dot: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      pulse: true,
    },
    COMPLETED: {
      label: "Terminado",
      dot: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      pulse: false,
    },
    FAILED: {
      label: "Error",
      dot: "bg-red-500",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      pulse: false,
    },
    CANCELLED: {
      label: "Cancelado",
      dot: "bg-gray-400",
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
      pulse: false,
    },
  };

  const c = config[status] ?? {
    label: status,
    dot: "bg-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    pulse: false,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot} ${c.pulse ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

import { SearchInput } from "@/components/SearchInput";

// ─── Página ────────────────────────────────────────────────────────────────────
export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const query = resolvedParams?.q || "";
  const itemsPerPage = 15;

  const whereClause: any = {
    deletedAt: null,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { template: { name: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [totalRaffles, raffles] = await Promise.all([
    prisma.raffle.count({ where: whereClause }),
    prisma.raffle.findMany({
      where: whereClause,
      include: { template: true },
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip: (currentPage - 1) * itemsPerPage,
    }),
  ]);

  const totalPages = Math.ceil(totalRaffles / itemsPerPage);

  return (
    <div className="space-y-8">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--navy)] text-[var(--accent)] flex items-center justify-center shadow-sm">
            <IconHistory />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--secondary)] mb-0.5">
              Monitor
            </p>
            <h1 className="text-3xl font-black text-[var(--navy)] tracking-tight leading-none">
              Historial de Sorteos
            </h1>
            <p className="text-[var(--navy)]/50 text-sm font-medium mt-1">
              {query
                ? `Resultados para "${query}"`
                : totalRaffles > 0
                ? `${totalRaffles} sorteo${totalRaffles !== 1 ? "s" : ""} registrado${totalRaffles !== 1 ? "s" : ""} en total`
                : "Aún no has generado ningún sorteo"}
            </p>
          </div>
        </div>

        {/* Filtro y Contador resumen */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput placeholder="Buscar sorteo o plantilla..." />
          </div>
          {totalRaffles > 0 && (
            <div className="px-4 py-2.5 bg-white rounded-xl border border-[var(--accent)]/20 shadow-sm text-center hidden sm:block">
              <p className="text-2xl font-black text-[var(--navy)] leading-none">{totalRaffles}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--navy)]/40 mt-0.5">Total</p>
            </div>
          )}
        </div>
      </div>

      {/* Tarjeta contenedora */}
      <div className="bg-white rounded-2xl border border-[var(--accent)]/20 shadow-sm overflow-hidden">
        {raffles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="text-[var(--navy)]">
              <IconEmptyHistory />
            </div>
            <h3 className="mt-5 text-lg font-black text-[var(--navy)] tracking-tight">
              Sin sorteos generados
            </h3>
            <p className="mt-2 text-sm text-[var(--navy)]/50 font-medium max-w-xs">
              Selecciona una plantilla desde el Panel Principal y genera tu primer PDF de rifa para verlo aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--accent)]/15">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--navy)]/40 whitespace-nowrap">#</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--navy)]/40 whitespace-nowrap">Sorteo</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--navy)]/40 whitespace-nowrap">Rango</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--navy)]/40 whitespace-nowrap hidden md:table-cell">Configuración</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--navy)]/40 whitespace-nowrap">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--navy)]/40 whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--accent)]/10">
                {raffles.map((raffle, idx) => (
                  <tr
                    key={raffle.id}
                    className="hover:bg-[var(--surface)]/50 transition-colors duration-150 group"
                  >
                    {/* Número de fila */}
                    <td className="px-6 py-4 w-10">
                      <span className="text-[11px] font-black text-[var(--navy)]/25">
                        {String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, "0")}
                      </span>
                    </td>

                    {/* Nombre + plantilla base */}
                    <td className="px-6 py-4 min-w-[180px]">
                      <p className="font-black text-[var(--navy)] leading-tight">{raffle.name}</p>
                      <p className="text-[11px] text-[var(--navy)]/45 font-medium mt-0.5">
                        Base: {raffle.template.name}
                      </p>
                    </td>

                    {/* Rango */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-black text-[var(--navy)] text-xs bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--accent)]/20">
                        {String(raffle.rangeStart).padStart(raffle.digits, "0")}
                        <span className="text-[var(--navy)]/30 font-normal">—</span>
                        {String(raffle.rangeEnd).padStart(raffle.digits, "0")}
                      </span>
                    </td>

                    {/* Configuración */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-black text-[var(--navy)]/60">{raffle.digits} dígitos</span>
                        <span className="text-[11px] font-black text-[var(--navy)]/60">{raffle.numbersPerTicket} núm/boleto</span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <StatusBadge status={raffle.status} />
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {raffle.pdfUrl ? (
                          <a
                            href={raffle.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--primary)] text-white text-[11px] font-black rounded-lg
                                       hover:bg-[var(--secondary)] active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md whitespace-nowrap"
                          >
                            <IconDownload />
                            Descargar PDF
                          </a>
                        ) : (
                          <span className="text-[11px] font-black text-[var(--navy)]/30 italic">
                            Generando…
                          </span>
                        )}
                        <DeleteButton id={raffle.id} type="raffle" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
