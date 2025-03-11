import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToasterProvider } from '@/components/providers/ToasterProvider'
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VetClinicPro - Sistema de Gestão para Clínicas Veterinárias",
  description: "Sistema completo para gestão de clínicas veterinárias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)} suppressHydrationWarning>
        <ToasterProvider />
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
