import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Germano - Allenamenti e Consulenze Fitness",
  description: "Piattaforma completa per allenamenti, consulenze e progressi fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden bg-dark">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-dark p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
