"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserNotifications, markNotificationRead, Notification } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, string> = {
  appointment: "📅",
  payment: "💳",
  message: "💬",
  progress: "📊",
  reminder: "🔔",
};

const colorMap: Record<string, string> = {
  appointment: "border-l-purple-500",
  payment: "border-l-blue-500",
  message: "border-l-purple-500",
  progress: "border-l-orange-500",
  reminder: "border-l-pink-500",
};

export function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserNotifications(user.uid);
        setNotifications(data);
      } catch (e) {
        console.error("Error loading notifications:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (!user) return null;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Tutte le notifiche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">Nessuna notifica.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && handleMarkRead(notification.id)}
              className={`flex gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
                notification.read
                  ? "bg-neutral-800/30 hover:bg-neutral-800/50"
                  : "bg-purple-500/5 hover:bg-purple-500/10"
              } ${colorMap[notification.type] || "border-l-purple-500"} border-l-4`}
            >
              <div className={`text-2xl ${notification.read ? "text-neutral-500" : "text-purple-500"}`}>
                {iconMap[notification.type] || "🔔"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{notification.title}</h4>
                  <span className="text-xs text-neutral-500">
                    {notification.createdAt?.toDate?.()?.toLocaleDateString() || ""}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{notification.description}</p>
              </div>
              {!notification.read && (
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}