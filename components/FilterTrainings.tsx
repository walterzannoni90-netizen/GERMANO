import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FilterTrainings() {
  const levels = ["Tutti", "Principiante", "Intermedio", "Avanzato"];
  const categories = ["Tutti", "Cardio", "Forza", "Yoga", "HIIT", "Core"];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Cerca allenamenti..."
          className="w-full h-10 rounded-full bg-neutral-800 px-4 pr-10 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        {levels.map((level) => (
          <Button key={level} variant="outline" className="rounded-full border-neutral-600 text-sm whitespace-nowrap">
            {level}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        {categories.map((category) => (
          <Button key={category} variant="secondary" className="rounded-full text-sm whitespace-nowrap">
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
