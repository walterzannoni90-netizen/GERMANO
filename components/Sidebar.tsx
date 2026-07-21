import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navItems = [
    { name: "Home", icon: "🏠", href: "#" },
    { name: "Allenamenti", icon: "💪", href: "#trainings" },
    { name: "Consulenze", icon: "📝", href: "#consultations" },
    { name: "Progressi", icon: "📊", href: "#progress" },
    { name: "Messaggi", icon: "💬", href: "#messages" },
    { name: "Documenti", icon: "📁", href: "#documents" },
    { name: "Pagamenti", icon: "💳", href: "#payments" },
    { name: "Impostazioni", icon: "⚙️", href: "#settings" },
  ];

  return (
    <aside className={cn("hidden w-20 md:w-64 flex-col bg-dark border-r border-neutral-800 p-4 md:p-6 transition-all duration-300", className)}>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-black md:hidden">
          <span className="font-bold text-xl">G</span>
        </div>
        <div className="flex items-center gap-2 text-green-500 hidden md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-black">
            <span className="font-bold text-2xl">G</span>
          </div>
          <span className="text-2xl font-bold text-white">GERMANO</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all group"
          >
            <span className="text-lg group-hover:text-green-500 transition-colors">{item.icon}</span>
            <span className="hidden md:block">{item.name}</span>
          </a>
        ))}
      </nav>
      
      <div className="mt-auto hidden md:block">
        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 border border-green-500/20">
          <h3 className="text-lg font-bold text-white mb-2">Programma Fedeltà</h3>
          <p className="text-sm text-neutral-400 mb-4">
            Accumula punti con ogni acquisto e consulenza!
          </p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-500">1280</div>
            <div className="text-sm text-neutral-400">punti</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
