"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Dumbbell,
  Calendar,
  TrendingUp,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  Shield,
  Utensils,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, userData, isAdmin } = useAuth();

  const clientNavItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { name: "Schede Allenamento", icon: Dumbbell, href: "/trainings" },
    { name: "Piani Alimentari", icon: Utensils, href: "/nutrition" },
    { name: "I Miei Acquisti", icon: Dumbbell, href: "/my-trainings" },
    { name: "Consulenze", icon: Calendar, href: "/consultations" },
    { name: "Progressi", icon: TrendingUp, href: "/progress" },
    { name: "Messaggi", icon: MessageSquare, href: "/messages" },
    { name: "Documenti", icon: FileText, href: "/documents" },
    { name: "Pagamenti", icon: CreditCard, href: "/payments" },
    { name: "Profilo", icon: Settings, href: "/profile" },
  ];

  if (!user) return null;

  return (
    <aside className={cn("hidden w-20 md:w-64 flex-col bg-dark border-r border-neutral-800 p-4 md:p-6 transition-all duration-300", className)}>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="flex items-center gap-2 text-green-500">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-black">
            <span className="font-bold text-2xl">G</span>
          </div>
          <span className="text-2xl font-bold text-white hidden md:block">GERMANO</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
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
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-colors", active ? "text-green-500" : "group-hover:text-green-500")} />
              <span className="hidden md:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <div className="mb-4 hidden md:block">
          <Link
            href="/admin"
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-orange-400 hover:bg-orange-500/10 transition-all group"
          >
            <Shield className="h-5 w-5" />
            <span>Admin Panel</span>
          </Link>
        </div>
      )}

      <div className="hidden md:block">
        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 border border-green-500/20">
          <h3 className="text-lg font-bold text-white mb-2">Programma Fedeltà</h3>
          <p className="text-sm text-neutral-400 mb-4">
            Accumula punti con ogni acquisto e consulenza!
          </p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-500">{userData?.points || 0}</div>
            <div className="text-sm text-neutral-400">punti</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
