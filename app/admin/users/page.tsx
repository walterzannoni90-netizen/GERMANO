"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Shield, UserCheck } from "lucide-react";
import { getAllUsers, updateUser, deleteUser } from "@/lib/firebase-firestore";

interface UserItem {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  role?: string;
  active?: boolean;
  points?: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsers().then((data) => setUsers(data as UserItem[]));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (u: UserItem) => {
    const newRole = u.role === "admin" ? "client" : "admin";
    await updateUser(u.id, { role: newRole });
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x))
    );
  };

  const toggleActive = async (u: UserItem) => {
    await updateUser(u.id, { active: !u.active });
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo utente?")) {
      await deleteUser(id);
      setUsers((prev) => prev.filter((x) => x.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Utenti</h1>
          <p className="text-neutral-400 mt-1">Gestisci tutti gli utenti della piattaforma.</p>
        </div>
        <span className="text-sm text-neutral-500">{users.length} utenti</span>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
        <Input
          placeholder="Cerca utenti per nome o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Ruolo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stato</th>
                  <th className="text-right p-4 text-sm font-medium text-neutral-400">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-white">
                        {u.name} {u.surname}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-neutral-400">{u.email}</td>
                    <td className="p-4">
                      <Badge variant={u.role === "admin" ? "success" : "neutral"}>
                        {u.role === "admin" ? "Admin" : u.role || "Client"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={u.active !== false ? "success" : "danger"}>
                        {u.active !== false ? "Attivo" : "Disabilitato"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRole(u)}
                          title="Promuovi/Revoca admin"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(u)}
                          title="Attiva/Disabilita"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(u.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
