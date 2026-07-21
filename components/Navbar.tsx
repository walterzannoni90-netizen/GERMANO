import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
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
      
      <nav className="flex items-center gap-4 md:gap-6">
        <a href="#" className="text-sm font-medium text-white hover:text-green-500 transition-colors">Home</a>
        <a href="#trainings" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Allenamenti</a>
        <a href="#consultations" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Consulenze</a>
        <a href="#progress" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Progressi</a>
        <a href="#messages" className="text-sm font-medium text-neutral-400 hover:text-green-500 transition-colors">Messaggi</a>
      </nav>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <span className="sr-only">Notifiche</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <span className="sr-only">Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
        <Button className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
          Accedi
        </Button>
      </div>
    </header>
  );
}
