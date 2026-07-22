"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useNav } from "@/contexts/NavContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, Menu, LogOut, Shield } from "lucide-react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { user, userData, isAdmin, logout } = useAuth();
  const { toggleSidebar } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={cn("sticky top-0 z-50 flex items-center justify-between gap-2 px-4 py-3 md:px-6 bg-dark-surface/80 backdrop-blur-md border-b border-neutral-800", className)}>
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-1 text-neutral-400 hover:text-white"
          aria-label="Apri menu"
          onClick={() => (user ? toggleSidebar() : setMobileOpen(!mobileOpen))}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 text-purple-500">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-black">
            <span className="font-bold text-lg">G</span>
          </div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-white hover:text-purple-500 transition-colors">Home</Link>
        <Link href="/trainings" className="text-sm font-medium text-neutral-400 hover:text-purple-500 transition-colors">Schede</Link>
        <Link href="/nutrition" className="text-sm font-medium text-neutral-400 hover:text-purple-500 transition-colors">Alimentazione</Link>
        {user && <Link href="/my-trainings" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">I Miei Acquisti</Link>}
        <Link href="/consultations" className="text-sm font-medium text-neutral-400 hover:text-purple-500 transition-colors">Consulenze</Link>
        {user && (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-purple-500 transition-colors">Dashboard</Link>
            <Link href="/progress" className="text-sm font-medium text-neutral-400 hover:text-purple-500 transition-colors">Progressi</Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
          </>
        )}
      </nav>

      {mobileOpen && !user && (
        <div className="absolute left-0 right-0 top-full z-40 bg-dark-surface border-b border-neutral-800 shadow-xl md:hidden" onClick={() => setMobileOpen(false)}>
          <nav className="flex flex-col gap-1 p-4" onClick={e => e.stopPropagation()}>
            <Link href="/" className="text-lg font-medium text-white hover:text-purple-500 py-2" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/trainings" className="text-lg font-medium text-neutral-400 hover:text-purple-500 py-2" onClick={() => setMobileOpen(false)}>Schede</Link>
            <Link href="/nutrition" className="text-lg font-medium text-neutral-400 hover:text-purple-500 py-2" onClick={() => setMobileOpen(false)}>Alimentazione</Link>
            {user && <Link href="/my-trainings" className="text-lg font-medium text-purple-400 hover:text-purple-300 py-2" onClick={() => setMobileOpen(false)}>I Miei Acquisti</Link>}
            <Link href="/consultations" className="text-lg font-medium text-neutral-400 hover:text-purple-500 py-2" onClick={() => setMobileOpen(false)}>Consulenze</Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-lg font-medium text-neutral-400 hover:text-purple-500 py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link href="/progress" className="text-lg font-medium text-neutral-400 hover:text-purple-500 py-2" onClick={() => setMobileOpen(false)}>Progressi</Link>
                {isAdmin && (
                  <Link href="/admin" className="text-lg font-medium text-orange-400 hover:text-orange-300 py-2" onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold text-black">
                  {userData?.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white hidden md:block">{userData?.name || "Profilo"}</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={logout}>
              <LogOut className="h-5 w-5 text-neutral-400" />
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" className="rounded-full text-white">
                Accedi
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                Registrati
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
