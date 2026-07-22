"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getUserDocuments, addDocument, uploadPDF } from "@/lib/firebase-firestore";
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
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (file: File) => {
    if (!user || uploading) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
      const fileSizeKB = Math.round(file.size / 1024);
      const fileSize = fileSizeKB > 1024 ? `${(fileSizeKB / 1024).toFixed(1)} MB` : `${fileSizeKB} KB`;
      const result = await uploadPDF(file);
      const docRef = await addDocument({
        userId: user.uid,
        name: file.name,
        type: ext === "PDF" ? "PDF" : "DOC",
        category: "program",
        fileUrl: result.pdfData,
        fileSize,
      });
      setDocuments((prev) => [{
        id: docRef.id,
        userId: user.uid,
        name: file.name,
        type: ext === "PDF" ? "PDF" : "DOC",
        category: "program",
        fileUrl: result.pdfData,
        fileSize,
        uploadedAt: new Date(),
      }, ...prev]);
    } catch (e: any) {
      alert(e.message || "Errore durante il caricamento");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Documenti</h2>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <Button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Caricamento..." : "Carica documento"}
          </Button>
        </div>
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
            <Upload className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
            <p className="text-lg mb-2">Nessun documento caricato</p>
            <p className="text-sm">Carica il tuo primo documento usando il pulsante sopra.</p>
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
                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      download={doc.name}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-600 px-4 py-2 text-xs font-medium hover:bg-neutral-800 transition-all flex-1 text-neutral-300"
                    >
                      <Download size={14} /> Scarica
                    </a>
                  ) : (
                    <Button variant="outline" className="border-neutral-600 text-xs rounded-full hover:bg-neutral-800 flex-1" disabled>
                      <Download size={14} className="mr-1" /> Scarica
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}