"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CalendarCheck,
  CreditCard,
  Image as ImageIconLucide,
  Settings,
  LogOut,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Utenti", href: "/admin/users", icon: Users },
  { name: "Allenamenti", href: "/admin/trainings", icon: Dumbbell },
  { name: "Programmi", href: "/admin/programs", icon: ClipboardList },
  { name: "Consulenze", href: "/admin/consultations", icon: CalendarCheck },
  { name: "Pagamenti", href: "/admin/payments", icon: CreditCard },
  { name: "Contenuti sito", href: "/admin/content", icon: ImageIconLucide },
  { name: "Impostazioni", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 flex flex-col bg-dark border-r border-neutral-800">
      <div className="p-6 border-b border-neutral-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-black">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">germanopoleselli.com</p>
            <p className="text-xs text-green-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
          Torna al sito
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Esci
        </button>
      </div>
    </aside>
  );
}
