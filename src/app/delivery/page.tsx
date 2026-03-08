import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Умови доставки | SushiMAMA",
  description: "Інформація про умови та вартість доставки суші у Франкфурті-на-Одері від SushiMAMA.",
};

export default function DeliveryPage() {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase">
            Умови <span className="text-primary">доставки</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl mx-auto uppercase tracking-widest text-sm font-bold opacity-60">
            Все, що вам потрібно знати про сервіс SushiMAMA
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: "⚡",
              title: "Швидкість",
              text: "Середній час доставки — 30-45 хвилин. Ми цінуємо свіжість!",
            },
            {
              icon: "🗺️",
              title: "Зона доставки",
              text: "Доставляємо по всьому Франкфурту-на-Одері та найближчих районах міста.",
            },
            {
              icon: "💶",
              title: "Вартість",
              text: "Доставка від 3 €. Безкоштовна доставка при замовленні від 40 €.",
            },
            {
              icon: "🕐",
              title: "Графік",
              text: "Щодня з 11:00 до 23:00. Приймаємо замовлення до 22:30.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-2xl font-black mb-8 text-primary uppercase tracking-tight">Як замовити?</h2>
          <ol className="space-y-6">
            {[
              "Оберіть улюблені роли або сети в нашому меню.",
              "Додайте їх у кошик та перейдіть до оформлення.",
              "Заповніть ваші контактні дані для швидкої доставки.",
              "Натисніть «ЗАМОВИТИ У WHATSAPP» для миттєвої відправки.",
              "Очікуйте підтвердження — і насолоджуйтесь смаком SushiMAMA!",
            ].map((step, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black italic">
                  {idx + 1}
                </span>
                <p className="text-muted-foreground leading-relaxed pt-0.5 font-medium">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
