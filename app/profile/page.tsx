import { UserProfile } from "@/components/UserProfile";
import { UserPreferences } from "@/components/UserPreferences";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Il tuo Profilo</h1>
        <p className="text-neutral-400">Gestisci le tue informazioni personali e preferenze.</p>
      </div>
      
      <UserProfile />
      <UserPreferences />
    </div>
  );
}
