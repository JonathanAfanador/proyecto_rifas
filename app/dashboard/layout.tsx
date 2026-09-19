import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validación estricta de sesión leída directamente de la cookie segura
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row font-sans">
      
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-[var(--navy)] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black text-[var(--accent)] tracking-tight">
            Bono Diario
          </h2>
          <p className="text-xs text-white/50 mt-1 font-medium">Panel de Administración</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="block px-4 py-3 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all text-sm font-semibold text-white/80"
          >
            Panel Principal
          </Link>
          <Link 
            href="/dashboard/templates" 
            className="block px-4 py-3 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all text-sm font-semibold text-white/80"
          >
            Gestión de Plantillas
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          {/* Botón de cierre de sesión temporal (luego lo conectaremos a un Server Action) */}
          <Link 
            href="/login" 
            className="block w-full text-center px-4 py-2 text-xs font-bold text-[var(--primary)] hover:text-[var(--secondary)] uppercase tracking-wider"
          >
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}