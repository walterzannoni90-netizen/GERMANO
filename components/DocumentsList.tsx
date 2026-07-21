"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getUserDocuments, addDocument } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, string> = {
  PDF: "📄",
  JPG: "🖼️",
  PNG: "🖼️",
  DOC: "📄",
};

export function DocumentsList() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserDocuments(user.uid);
        setDocuments(data);
      } catch (e) {
        console.error("Error loading documents:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Documenti</h2>
        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
          + Carica documento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
              <CardHeader><div className="h-10 w-10 bg-neutral-800 rounded" /></CardHeader>
              <CardContent><div className="h-4 w-32 bg-neutral-800 rounded" /></CardContent>
            </Card>
          ))
        ) : documents.length === 0 ? (
          <div className="col-span-full text-center py-20 text-neutral-500">
            Nessun documento caricato.
          </div>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="bg-neutral-900/50 border-neutral-800 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{iconMap[doc.type] || "📄"}</span>
                  <span className="text-xs font-semibold text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">
                    {doc.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-white mb-2">{doc.name}</h4>
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>{doc.uploadedAt?.toDate?.()?.toLocaleDateString() || ""}</span>
                  <span>{doc.fileSize}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="border-neutral-600 text-xs rounded-full hover:bg-neutral-800 flex-1">
                    <Download size={14} className="mr-1" /> Scarica
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}