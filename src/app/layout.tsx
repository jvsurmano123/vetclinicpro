import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToasterProvider } from '@/components/providers/ToasterProvider'

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
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning>
        <ToasterProvider />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
