import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  { title: "Peso corporeo", value: "78.5kg", goal: "75kg", change: "-3.2kg", icon: "⚖️", color: "text-blue-500" },
  { title: "Grasso corporeo", value: "18.2%", goal: "15%", change: "-2.5%", icon: "📊", color: "text-red-500" },
  { title: "Misure braccia", value: "36.5cm", goal: "35cm", change: "-1.5cm", icon: "📏", color: "text-green-500" },
  { title: "Misure vita", value: "82cm", goal: "78cm", change: "-4cm", icon: "📏", color: "text-orange-500" },
  { title: "Misure cosce", value: "54cm", goal: "50cm", change: "-3cm", icon: "📏", color: "text-purple-500" },
  { title: "Passi giornalieri", value: "8,432", goal: "10,000", change: "+1,200", icon: "👣", color: "text-pink-500" },
];

export function ProgressStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-neutral-900/50 border-neutral-800 hover:border-green-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
            <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-neutral-500">Obiettivo: {stat.goal}</div>
              </div>
              <div className={`text-sm font-semibold ${stat.change.startsWith("-") ? "text-green-500" : "text-blue-500"}`}>
                {stat.change}
              </div>
            </div>
            <Progress value={80} className="h-2 bg-neutral-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
