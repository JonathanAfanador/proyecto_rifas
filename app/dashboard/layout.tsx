// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/AppSidebar";

// ─── Layout ────────────────────────────────────────────────────────────────────
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row font-sans">
      <AppSidebar />

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto w-full md:w-[calc(100%-16rem)]">
        <div className="p-5 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}