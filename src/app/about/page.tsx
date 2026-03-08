import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про нас | SushiMAMA",
  description: "Дізнайтеся більше про нашу команду та нашу місію доставляти найсмачніші суші в Берліні.",
};

export default function AboutPage() {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-center uppercase">
          Про <span className="text-primary">SushiMAMA</span>
        </h1>
        
        <div className="prose prose-invert max-w-none mb-16">
          <p className="text-xl text-muted-foreground leading-relaxed text-center">
            <span className="text-white font-bold">SushiMAMA</span> — це не просто доставка їжі. Це справжня любов до японської кухні та повага до традицій, поєднана з сучасним ритмом життя Берліна.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🍣", title: "Свіжість", text: "Лише найсвіжіші інгредієнти щодня" },
            { icon: "⚡", title: "Швидкість", text: "Доставка за 30-45 хвилин" },
            { icon: "❤️", title: "Якість", text: "Кожен рол приготований вручну" },
          ].map((v) => (
            <div key={v.title} className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{v.title}</h3>
              <p className="text-muted-foreground text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
