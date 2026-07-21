import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const days = ["L", "M", "M", "G", "V", "S", "D"];
const daysInMonth = 31;
const currentDay = 21;

export function CalendarWidget() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Calendario disponibilità</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
          {days.map((day, index) => (
            <div key={index} className="text-xs font-medium text-neutral-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty slots for previous month */}
          {[...Array(3)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          
          {/* Days of current month */}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const isToday = day === currentDay;
            const isPast = day < currentDay;
            const hasAvailability = day % 3 === 0 || day % 5 === 0 || day === 15;
            
            return (
              <button
                key={day}
                disabled={isPast}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                  ${isToday ? "bg-green-500 text-white font-bold" : ""}
                  ${isPast ? "text-neutral-600 cursor-not-allowed" : "text-neutral-300 hover:bg-neutral-800"}
                  ${hasAvailability && !isPast && !isToday ? "hover:border-green-500 border" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-white">Fasce orarie disponibili</h4>
          
          {[
            { time: "09:00", status: "disponible" },
            { time: "10:30", status: "disponible" },
            { time: "14:00", status: "disponible" },
            { time: "16:00", status: "disponible" },
            { time: "17:30", status: "disponible" },
          ].map((slot, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50">
              <span className="text-sm text-white font-medium">{slot.time}</span>
              <Button size="sm" variant="secondary" className="text-xs rounded-full">
                Seleziona
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
