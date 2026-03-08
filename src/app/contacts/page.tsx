"use client";

import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/data";

export default function ContactsPage() {
  const [phoneNumber, setPhoneNumber] = useState("+380 93 484 3757");
  const [waLink, setWaLink] = useState("https://wa.me/380934843757");

  useEffect(() => {
    fetchSettings().then(s => {
      setPhoneNumber(`+${s.phoneNumber.slice(0, 3)} ${s.phoneNumber.slice(3, 5)} ${s.phoneNumber.slice(5, 8)} ${s.phoneNumber.slice(8)}`);
      setWaLink(`https://wa.me/${s.phoneNumber}`);
    });
  }, []);

  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase">
            Sushi <span className="text-primary">MAMA</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl mx-auto uppercase tracking-widest text-sm font-bold">
            Контакти • Маєте запитання? Ми на зв{"'"}язку!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: "💬",
              title: "WhatsApp",
              text: phoneNumber,
              link: waLink,
              linkLabel: "Написати в WhatsApp",
            },
            {
              icon: "🕐",
              title: "Години роботи",
              text: "Пн-Нд: 11:00 – 23:00",
              link: null,
              linkLabel: null,
            },
            {
              icon: "📍",
              title: "Місто",
              text: "Берлін, Німеччина",
              link: null,
              linkLabel: null,
            },
            {
              icon: "📱",
              title: "Instagram",
              text: "@sushimama.berlin",
              link: "https://instagram.com/sushimama.berlin",
              linkLabel: "Підписатися",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground mb-4 font-mono">{item.text}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-black text-primary hover:text-primary/80 uppercase tracking-widest border-b border-primary/30 pb-0.5 transition-all"
                >
                  {item.linkLabel} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
