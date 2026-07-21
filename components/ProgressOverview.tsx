import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ProgressOverview() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Progresso settimanale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-400">Peso corporeo</span>
            <span className="text-sm font-semibold text-white">78.5kg (-3.2kg)</span>
          </div>
          <Progress value={78} className="h-2 bg-neutral-800" />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-400">Allenamenti completati</span>
            <span className="text-sm font-semibold text-white">4/7 (57%)</span>
          </div>
          <Progress value={57} className="h-2 bg-green-500" />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-400">Passi giornalieri</span>
            <span className="text-sm font-semibold text-white">8,432/10,000</span>
          </div>
          <Progress value={84} className="h-2 bg-blue-500" />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-xl bg-green-500/10">
            <div className="text-2xl font-bold text-green-500">12</div>
            <div className="text-xs text-neutral-400">Punti</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-orange-500/10">
            <div className="text-2xl font-bold text-orange-500">8</div>
            <div className="text-xs text-neutral-400">Consulenze</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-purple-500/10">
            <div className="text-2xl font-bold text-purple-500">3</div>
            <div className="text-xs text-neutral-400">Programmi</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
