"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNav } from "@/contexts/NavContext";
import {
  Home,
  Dumbbell,
  Calendar,
  TrendingUp,
  FileText,
  CreditCard,
  Settings,
  Shield,
  Utensils,
  X,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, userData, isAdmin } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useNav();

  const clientNavItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { name: "Schede Allenamento", icon: Dumbbell, href: "/trainings" },
    { name: "Piani Alimentari", icon: Utensils, href: "/nutrition" },
    { name: "I Miei Acquisti", icon: Dumbbell, href: "/my-trainings" },
    { name: "Consulenze", icon: Calendar, href: "/consultations" },
    { name: "Progressi", icon: TrendingUp, href: "/progress" },
    { name: "Documenti", icon: FileText, href: "/documents" },
    { name: "Pagamenti", icon: CreditCard, href: "/payments" },
    { name: "Profilo", icon: Settings, href: "/profile" },
  ];

  if (!user) return null;

  const navContent = (showLabels: boolean) => (
    <>
      <div className="flex items-center justify-between gap-3 mb-8">
        <Link href="/" className="flex items-center gap-2 text-purple-500">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-black">
            <span className="font-bold text-2xl">G</span>
          </div>
        </Link>
        {!showLabels && (
          <button
            className="md:hidden p-1 text-neutral-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Chiudi menu"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {clientNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all group",
                active
                  ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-purple-500" : "group-hover:text-purple-500")} />
              <span className={showLabels ? "block" : "hidden lg:block"}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <div className="mb-4">
          <Link
            href="/admin"
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-orange-400 hover:bg-orange-500/10 transition-all group"
          >
            <Shield className="h-5 w-5 shrink-0" />
            <span className={showLabels ? "block" : "hidden lg:block"}>Admin Panel</span>
          </Link>
        </div>
      )}

      <div className={showLabels ? "block" : "hidden lg:block"}>
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 border border-purple-500/20">
          <h3 className="text-lg font-bold text-white mb-2">Programma Fedeltà</h3>
          <p className="text-sm text-neutral-400 mb-4">
            Accumula punti con ogni acquisto e consulenza!
          </p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-purple-500">{userData?.points || 0}</div>
            <div className="text-sm text-neutral-400">punti</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop / tablet: sidebar fissa */}
      <aside
        className={cn(
          "hidden md:flex w-20 lg:w-64 flex-col bg-dark border-r border-neutral-800 p-4 lg:p-6 transition-all duration-300",
          className
        )}
      >
        {navContent(false)}
      </aside>

      {/* Mobile: drawer con overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <aside
            className="relative flex h-full w-72 max-w-[85vw] flex-col bg-dark border-r border-neutral-800 p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
