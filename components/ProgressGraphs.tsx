import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function ProgressGraphs() {
  const weeks = [
    { week: "Settimana 1", weight: 81.7, measurement: 105 },
    { week: "Settimana 2", weight: 80.2, measurement: 103 },
    { week: "Settimana 3", weight: 79.1, measurement: 101 },
    { week: "Settimana 4", weight: 78.5, measurement: 99 },
  ];

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Andamento pesi e misure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Peso corporeo (kg)</h4>
              <span className="text-sm text-green-500">Trend positivo! 👍</span>
            </div>
            <div className="space-y-3">
              {weeks.map((week, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-neutral-400 w-24">{week.week}</span>
                  <div className="flex-1 relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
                      style={{ width: `${(week.weight / 85) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-white w-16 text-right">{week.weight}kg</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Misure totali (cm)</h4>
              <span className="text-sm text-green-500">-6cm questo mese</span>
            </div>
            <div className="space-y-3">
              {weeks.map((week, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-neutral-400 w-24">{week.week}</span>
                  <div className="flex-1 relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${(week.measurement / 110) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-white w-16 text-right">{week.measurement}cm</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 rounded-full">
              Visualizza grafico completo
            </Button>
            <Button variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800 rounded-full">
              Esporta dati
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
