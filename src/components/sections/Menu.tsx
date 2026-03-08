"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CATEGORIES,
  Category,
  MENU_REFRESH_CHANNEL_NAME,
  MENU_REFRESH_EVENT,
  MENU_REFRESH_STORAGE_KEY,
  MenuItem,
  fetchMenu,
} from "@/lib/data";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";

function DishCard({ item }: { item: MenuItem }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQty(1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        <Badge className="absolute top-3 right-3 bg-background/80 text-foreground border-border/50 backdrop-blur-sm">
          {item.category}
        </Badge>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">{item.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary font-black text-2xl">{item.price} €</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-border rounded-full p-0.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-5 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <Button
              onClick={handleAdd}
              size="icon"
              className={`rounded-full w-10 h-10 shrink-0 transition-all ${added
                  ? "bg-green-500 hover:bg-green-600"
                  : ""
                }`}
            >
              {added ? (
                <span className="text-xs font-bold">✓</span>
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 w-full text-sm text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          Додати в кошик
        </button>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category>("Роли");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const loadMenu = async () => {
      const data = await fetchMenu();
      if (!alive) return;
      setMenuItems(data);
      setLoading(false);
    };

    const onVisibility = () => {
      if (!document.hidden) loadMenu();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === MENU_REFRESH_STORAGE_KEY) {
        loadMenu();
      }
    };

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel(MENU_REFRESH_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === MENU_REFRESH_EVENT) {
          loadMenu();
        }
      };
    }

    loadMenu();
    const interval = setInterval(loadMenu, 30000);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    return () => {
      alive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  const filtered = menuItems.filter((i) => i.category === activeCategory);

  return (
    <section id="menu" className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Наше <span className="text-primary">Меню</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Традиційний японський смак з авторським підходом
          </p>
        </motion.div>

        {/* Category tabs — horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide justify-start md:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(200,40,40,0.4)]"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state or Items grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-card/50 rounded-2xl animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <DishCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            Поки що тут порожньо. Оберіть іншу категорію.
          </div>
        )}
      </div>
    </section>
  );
}
