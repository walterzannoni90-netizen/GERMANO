import { RecentActivities } from "@/components/RecentActivities";
import { UpcomingSessions } from "@/components/UpcomingSessions";
import { ProgressOverview } from "@/components/ProgressOverview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Benvenuto, Marco! 👋</h1>
        <p className="text-neutral-400">Ecco il tuo riepilogo giornaliero.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressOverview />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentActivities />
        </div>
        <div className="lg:col-span-1">
          <UpcomingSessions />
        </div>
      </div>
    </div>
  );
}
