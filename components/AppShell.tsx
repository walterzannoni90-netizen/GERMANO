"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Le pagine admin hanno il proprio layout con AdminSidebar:
  // niente doppia sidebar / doppia navbar
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-dark p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
