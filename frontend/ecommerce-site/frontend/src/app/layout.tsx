import type { Metadata } from "next";
import { Outfit } from "next/font/google"; 
import "./globals.css";
import AppShell from "@/components/AppShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "LUMINA | Tech Future",
  description: "Loja conceito de alta tecnologia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} scroll-smooth`}>
      <body className="font-sans">
        <div className="fixed inset-0 z-[-1] bg-bg overflow-hidden pointer-events-none">
            {/* Luzes de Fundo Ambiente */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            <div className="absolute top-[20%] right-[20%] w-[20vw] h-[20vw] bg-blue-500/5 rounded-full blur-[80px]" />
        </div>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}