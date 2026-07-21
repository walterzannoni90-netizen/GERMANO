"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/firebase-firestore";

const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";

export function Hero() {
  const [bgImage, setBgImage] = useState(HERO_DEFAULT);

  useEffect(() => {
    getSiteContent("hero")
      .then((img) => {
        if (img) setBgImage(img);
      })
      .catch((e) => console.error("Error loading hero image:", e));
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 md:p-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url("${bgImage}")` }}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Il tuo allenamento <br />
          <span className="text-green-500">personale</span>, ovunque tu sia
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
          Piattaforma completa per raggiungere i tuoi obiettivi fitness con programmi personalizzati, consulenze professionali e monitoraggio dei progressi.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="h-14 px-8 text-lg rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 w-full sm:w-auto">
            Inizia gratis
          </Button>
          <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-neutral-600 text-white hover:bg-neutral-800 w-full sm:w-auto">
            Scopri di più
          </Button>
        </div>
      </div>
    </section>
  );
}
