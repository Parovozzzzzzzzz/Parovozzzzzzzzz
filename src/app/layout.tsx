import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "SushiMAMA — доставка суші Франкфурт-на-Одері",
  description: "Найкращі роли та сети у Франкфурті-на-Одері. Швидка доставка, преміум якість.",
  keywords: ["суші", "доставка суші", "sushi berlin", "антигравітація суші"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
