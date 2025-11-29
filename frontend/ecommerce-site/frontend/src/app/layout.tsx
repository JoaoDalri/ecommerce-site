import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Fonte moderna
import "./globals.css";
import AppShell from "@/components/AppShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "LUMINA | Premium Tech Store",
  description: "Experience the future of shopping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} scroll-smooth`}>
      <body className="font-sans">
        <div className="fixed inset-0 z-[-1] bg-bg">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        </div>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}