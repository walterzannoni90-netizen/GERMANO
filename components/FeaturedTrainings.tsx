import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const featuredTrainings = [
  {
    title: "Full Body HIIT",
    trainer: "Mario Rossi",
    duration: "45 min",
    level: "Intermedio",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Yoga per Principianti",
    trainer: "Giulia Bianchi",
    duration: "30 min",
    level: "Principiante",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Strongman Foundation",
    trainer: "Luca Verdi",
    duration: "60 min",
    level: "Avanzato",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  },
];

export function FeaturedTrainings() {
  return (
    <section id="trainings" className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Allenamenti in evidenza</h2>
        <Button variant="link" className="text-green-500">
          Vedi tutti
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTrainings.map((training, index) => (
          <Card key={index} className="group overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="relative h-48 overflow-hidden">
              <img
                src={training.image}
                alt={training.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="neutral">{training.level}</Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-white mb-2">{training.title}</CardTitle>
                  <p className="text-sm text-neutral-400">by {training.trainer}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {training.duration}
                </span>
                <span className="flex items-center gap-1 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  4.8
                </span>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Guarda ora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
