"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";

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
          
          <div className="rounded-xl bg-neutral-800/50 p-4 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="text-white font-semibold mb-1">Calendario Reale</p>
            <p className="text-xs text-neutral-400 mb-4">
              Visualizza la disponibilità in tempo reale e prenota la tua consulenza.
            </p>
            <Button
              onClick={() => window.open(bookingUrl, "_blank")}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apri calendario
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Calendario</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-xl">
          <iframe
            src={bookingUrl}
            className="w-full h-[400px] border-0"
            title="Calendario Prenotazioni"
            allow="calendar; clipboard-read; clipboard-write"
          />
        </CardContent>
      </Card>
    </div>
  );
}