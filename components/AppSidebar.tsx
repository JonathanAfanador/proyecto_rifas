"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Iconos SVG inline ─────────────────────────────────────────────────────────
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function IconTemplate() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Items de navegación ───────────────────────────────────────────────────────
const navItems = [
  { href: "/dashboard", label: "Panel Principal", icon: <IconHome />, exact: true },
  { href: "/dashboard/templates", label: "Plantillas", icon: <IconTemplate /> },
  { href: "/dashboard/history", label: "Historial", icon: <IconHistory /> },
  { href: "/dashboard/settings", label: "Configuración", icon: <IconSettings /> },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* ── Barra superior (Solo visible en mobile) ─────────────────────────── */}
      <div className="md:hidden bg-[var(--navy)] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden p-0.5">
            <Image src="/images/bono-diario-login.png" alt="Bono Diario Logo" width={40} height={40} className="w-full h-full object-contain" priority />
          </div>
          <span className="text-sm font-black">Bono Diario</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
          aria-label="Alternar menú"
        >
          {isOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {/* ── Fondo oscuro (Backdrop) para mobile ────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-[var(--navy)] text-white flex flex-col shadow-2xl z-40 flex-shrink-0 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Marca */}
        <div className="px-6 py-6 border-b border-white/8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden p-1">
                <Image src="/images/bono-diario-login.png" alt="Bono Diario Logo" width={80} height={80} className="w-full h-full object-contain" priority />
              </div>
              <div>
                <h2 className="text-base font-black text-white leading-none tracking-tight">Bono Diario</h2>
                <p className="text-[10px] text-white/35 mt-0.5 font-medium uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
            {/* Botón cerrar visible solo en mobile dentro del sidebar */}
            <button onClick={closeSidebar} className="md:hidden p-1.5 text-white/50 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
              <IconX />
            </button>
          </div>
        </div>

        {/* Etiqueta nav */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">Navegación</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold
                  transition-all duration-150 group
                  ${isActive ? "bg-[var(--accent)] text-[var(--navy)] shadow-sm" : "text-white/65 hover:bg-white/8 hover:text-white"}
                `}
              >
                <span
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150
                    ${isActive ? "bg-[var(--navy)]/15 text-[var(--navy)]" : "bg-white/6 text-white/65 group-hover:bg-[var(--accent)] group-hover:text-[var(--navy)]"}
                  `}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Pie del sidebar */}
        <div className="p-4 mt-auto border-t border-white/8">
          <Link
            href="/login"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white/80 bg-white/5
                       hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md w-full"
          >
            <span className="w-7 h-7 rounded-lg bg-white/10 text-white/90 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors">
              <IconLogout />
            </span>
            Cerrar Sesión
          </Link>
        </div>
      </aside>
    </>
  );
}
