export function Stats() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Clienti Attivi", value: "1,200+", icon: "👥" },
        { label: "Allenamenti", value: "500+", icon: "💪" },
        { label: "Consulenze", value: "2,500+", icon: "📝" },
        { label: "Soddisfazione", value: "4.9/5", icon: "⭐" },
      ].map((stat, index) => (
        <div key={index} className="rounded-2xl bg-neutral-800/50 p-6 border border-neutral-700/50 text-center hover:border-green-500/30 transition-all">
          <div className="text-4xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-sm text-neutral-400">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
