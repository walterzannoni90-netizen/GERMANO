import { NotificationsList } from "@/components/NotificationsList";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Notifiche</h1>
        <p className="text-neutral-400">Resta aggiornato sui tuoi appuntamenti e progressi.</p>
      </div>
      
      <NotificationsList />
    </div>
  );
}
