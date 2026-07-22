"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Clock, CheckCircle } from "lucide-react";

export function CalendarWidget() {
  const bookingUrl = "https://calendar.app.google/v9LYmPS8tFRukoYG8";

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Prenota una Consulenza
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-400">
            Scegli data e ora che preferisci direttamente sul calendario di Germano Poleselli.
          </p>
          
          <div className="rounded-xl bg-neutral-800/50 p-6 text-center space-y-4">
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <Clock className="h-6 w-6 text-green-500" />
                <span className="text-xs text-neutral-400">Orari flessibili</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-xs text-neutral-400">Conferma immediata</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Calendar className="h-6 w-6 text-green-500" />
                <span className="text-xs text-neutral-400">Tempo reale</span>
              </div>
            </div>
            <Button
              onClick={() => window.open(bookingUrl, "_blank")}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apri calendario e prenota
            </Button>
            <p className="text-xs text-neutral-500">
              Si apre una nuova finestra con il calendario di Google.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}