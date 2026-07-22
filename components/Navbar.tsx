"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, Menu, LogOut, Shield } from "lucide-react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { user, userData, isAdmin, logout } = useAuth();

  return (
    <header className={cn("sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:px-6 bg-dark-surface/80 backdrop-blur-md border-b border-neutral-800", className)}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-500">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-black">
            <span className="font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-bold text-white hidden md:block">GERMANO</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-white hover:text-green-500 transition-colors">Home</Link>
        <Link href="/trainings" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Schede</Link>
        <Link href="/nutrition" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Alimentazione</Link>
        {user && <Link href="/my-trainings" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">I Miei Acquisti</Link>}
        <Link href="/consultations" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Consulenze</Link>
        {user && (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Dashboard</Link>
            <Link href="/progress" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Progressi</Link>
            <Link href="/messages" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Messaggi</Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
          </>
        )}
      </nav>

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
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold text-black">
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
              <Button className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
                Registrati
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
