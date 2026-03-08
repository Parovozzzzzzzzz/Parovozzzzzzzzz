"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { fetchSettings } from "@/lib/data";

export default function Footer() {
  const [phoneNumber, setPhoneNumber] = useState("+380 93 484 3757");

  useEffect(() => {
    fetchSettings().then(s => {
      setPhoneNumber(`+${s.phoneNumber.slice(0, 3)} ${s.phoneNumber.slice(3, 5)} ${s.phoneNumber.slice(5, 8)} ${s.phoneNumber.slice(8)}`);
    });
  }, []);

  return (
    <footer className="bg-card border-t border-border/50 py-12 px-4 mt-auto">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white">
                Sushi<span className="text-primary">MAMA</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
              Найкращі роли та сети в Берліні. Швидка доставка, преміум якість.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Навігація</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#menu" className="text-muted-foreground hover:text-primary transition-colors">Меню</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Про нас</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Контакти</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📱 WhatsApp: <span className="text-foreground">{phoneNumber}</span></li>
              <li>🕐 Щодня: <span className="text-foreground">11:00 – 23:00</span></li>
              <li>📍 <span className="text-foreground">Берлін, Німеччина</span></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-border/50 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SushiMAMA. Всі права захищені.</p>
          <p className="text-xs">Зроблено з ❤️ і суші 🍣</p>
        </div>
      </div>
    </footer>
  );
}
