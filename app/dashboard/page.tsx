import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Consultar plantillas
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 2. Consultar rifas (incluyendo los datos de la plantilla usada)
  const raffles = await prisma.raffle.findMany({
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      
      {/* =========================================
          SECCIÓN 1: PLANTILLAS
      ========================================= */}
      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--navy)] tracking-tight">Plantillas</h1>
            <p className="text-[var(--navy)]/60 font-medium mt-1">
              Selecciona una base para generar una nueva rifa.
            </p>
          </div>
          <Link
            href="/dashboard/templates"
            className="px-6 py-2.5 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--secondary)] transition-colors shadow-md text-sm text-center inline-block"
          >
            + Nueva Plantilla
          </Link>
        </div>

        {templates.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border border-[var(--accent)]/20 text-center">
            <p className="text-[var(--navy)]/70 font-medium mb-4">No tienes plantillas configuradas todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-[var(--accent)]/20 overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden bg-[var(--surface)]/40 flex items-center justify-center p-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={template.imageUrl} alt={template.name} className="max-h-full max-w-full object-contain drop-shadow-sm" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between border-t border-[var(--accent)]/10">
                  <div>
                    <h3 className="font-black text-[var(--navy)] text-lg line-clamp-1" title={template.name}>{template.name}</h3>
                    <p className="text-xs text-[var(--navy)]/60 font-bold mt-1 uppercase tracking-wide">
                      {template.maxPositions} posiciones mapeadas
                    </p>
                  </div>
                  <Link 
                    href={`/dashboard/raffle/new?templateId=${template.id}`}
                    className="mt-4 w-full block text-center py-2.5 bg-[var(--background)] text-[var(--navy)] font-black rounded-lg hover:bg-[var(--accent)] hover:text-white transition-all text-sm border border-[var(--accent)]/30"
                  >
                    Generar Rifa PDF
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================
          SECCIÓN 2: HISTORIAL DE RIFAS Y TAREAS
      ========================================= */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[var(--navy)] tracking-tight">Historial de Sorteos</h2>
          <p className="text-[var(--navy)]/60 font-medium mt-1">
            Monitorea el estado de generación de tus PDFs.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[var(--accent)]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface)]/50 text-[var(--navy)] border-b border-[var(--accent)]/20">
                <tr>
                  <th className="px-6 py-4 font-black tracking-wide uppercase text-xs">Sorteo</th>
                  <th className="px-6 py-4 font-black tracking-wide uppercase text-xs">Rango</th>
                  <th className="px-6 py-4 font-black tracking-wide uppercase text-xs">Configuración</th>
                  <th className="px-6 py-4 font-black tracking-wide uppercase text-xs">Estado</th>
                  <th className="px-6 py-4 font-black tracking-wide uppercase text-xs text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--accent)]/10">
                {raffles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--navy)]/60 font-medium">
                      Aún no has generado ninguna rifa.
                    </td>
                  </tr>
                ) : (
                  raffles.map((raffle) => (
                    <tr key={raffle.id} className="hover:bg-[var(--background)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[var(--navy)]">{raffle.name}</p>
                        <p className="text-xs text-[var(--navy)]/60 mt-0.5">Base: {raffle.template.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[var(--navy)] bg-[var(--surface)] px-2 py-1 rounded border border-[var(--accent)]/20">
                          {String(raffle.rangeStart).padStart(raffle.digits, '0')} - {String(raffle.rangeEnd).padStart(raffle.digits, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[var(--navy)]/80 text-xs font-bold">
                          {raffle.digits} dígitos
                        </p>
                        <p className="text-[var(--navy)]/80 text-xs font-bold mt-0.5">
                          {raffle.numbersPerTicket} núm/boleto
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {raffle.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> En cola
                          </span>
                        )}
                        {raffle.status === 'PROCESSING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Procesando...
                          </span>
                        )}
                        {raffle.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Terminado
                          </span>
                        )}
                        {raffle.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Error
                          </span>
                        )}
                      </td>
                                <td className="px-6 py-4 text-right">
                        {raffle.pdfUrl ? (
                          <a 
                            href={raffle.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-1.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--secondary)] transition-colors shadow-sm"
                          >
                            Descargar
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-[var(--navy)]/40">Generando...</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}