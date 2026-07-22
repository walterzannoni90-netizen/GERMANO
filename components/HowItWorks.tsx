export function HowItWorks() {
  const steps = [
    {
      title: "Crea il tuo profilo",
      description: "Compila il tuo profilo con dati fisici e obiettivi personali per ricevere programmi su misura.",
      icon: "👤",
    },
    {
      title: "Scegli il programma",
      description: "Esplora la libreria di allenamenti o prenota una consulenza con un professionista.",
      icon: "🎯",
    },
    {
      title: "Segui i progressi",
      description: "Monitora peso, misure e fotografie con grafici dettagliati e confronti visivi.",
      icon: "📊",
    },
    {
      title: "Raggiungi i tuoi obiettivi",
      description: "Con il supporto costante e il programma fedeltà, arriverai ovunque tu voglia arrivare.",
      icon: "🏆",
    },
  ];

  return (
    <section className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Come funziona Germano</h2>
        <p className="text-lg text-neutral-400">
          La piattaforma completa per il tuo percorso fitness, progettata per semplificare ogni fase del tuo viaggio.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block text-6xl font-bold text-neutral-800 dark:text-neutral-900">
              {index + 1}
            </div>
            <div className="relative z-10 rounded-2xl bg-neutral-800/50 p-8 border border-neutral-700/50 text-center hover:border-purple-500/30 transition-all hover:-translate-y-2">
              <div className="text-5xl mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-neutral-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
