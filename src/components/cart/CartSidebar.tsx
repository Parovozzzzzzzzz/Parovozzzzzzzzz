"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Trash2, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchSettings } from "@/lib/data";

interface FieldErrors {
  name?: string;
  address?: string;
}

function buildWhatsAppMessage(params: {
  name: string;
  address: string;
  comment: string;
  orderLines: string;
  total: number;
}): string {
  const { name, address, comment, orderLines, total } = params;
  const lines: string[] = [
    `*Нове замовлення 🍣 SushiMAMA!*`,
    ``,
    `Ім'я: ${name}`,
    `Адреса: ${address}`,
  ];
  if (comment.trim()) lines.push(`Коментар: ${comment.trim()}`);
  lines.push(``, `Сума: ${total} €`, ``, `Замовлення:`, orderLines, ``, `Дякую!`);
  return lines.join("\n");
}

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, getTotal, getTotalItems, clearCart } = useCartStore();
  
  // States
  const [formData, setFormData] = useState({ name: "", address: "", comment: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("380934843757");

  useEffect(() => {
    if (isSheetOpen) {
      fetchSettings().then(s => setPhoneNumber(s.phoneNumber));
    }
  }, [isSheetOpen]);

  // ── Handlers ────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!formData.name.trim()) newErrors.name = "Введіть ім'я";
    if (!formData.address.trim()) newErrors.address = "Введіть адресу";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      toast.error("Кошик порожній");
      return;
    }
    if (!validate()) {
      toast.error("Заповніть обов'язкові поля");
      return;
    }

    setIsSubmitting(true);
    const orderLines = items
      .map((item) => `• ${item.name} × ${item.quantity} — ${item.price * item.quantity} €`)
      .join("\n");
    const total = getTotal();
    const message = buildWhatsAppMessage({ ...formData, orderLines, total });
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      toast.success("Замовлення відправлено! 🎉");
      clearCart();
      setFormData({ name: "", address: "", comment: "" });
      setErrors({});
      setIsSheetOpen(false);
    } catch {
      toast.error("Помилка при відкритті WhatsApp");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary text-primary hover:bg-primary/20">
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-card border-l-border/50 flex flex-col p-0 overflow-hidden">
        <SheetHeader className="px-6 py-5 border-b border-border/50 shrink-0">
          <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-2 uppercase">
            Sushi <span className="text-primary">MAMA</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4 p-6">
            <ShoppingCart className="h-16 w-16 opacity-20" />
            <p className="text-lg uppercase font-bold tracking-tight">Ваш кошик порожній</p>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="rounded-full">Повернутися до меню</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6 pb-4">
                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Ваше замовлення</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-background/50 p-2 rounded-xl border border-border/30">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs truncate uppercase tracking-tight">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-primary font-black text-sm">{item.price * item.quantity} €</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"><Plus className="h-3 w-3" /></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive p-1 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>

                <Separator className="bg-border/50" />

                {/* Embedded Form */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Дані для доставки</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase opacity-60">Ім&apos;я <span className="text-primary">*</span></label>
                      <Input name="name" placeholder="Олег" value={formData.name} onChange={handleChange} className={`h-10 bg-background/50 border-border/50 focus:border-primary transition-colors ${errors.name ? "border-destructive" : ""}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase opacity-60">Адреса доставки <span className="text-primary">*</span></label>
                      <Input name="address" placeholder="вулиця, буд..." value={formData.address} onChange={handleChange} className={`h-10 bg-background/50 border-border/50 focus:border-primary transition-colors ${errors.address ? "border-destructive" : ""}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase opacity-60">Коментар</label>
                      <Textarea name="comment" placeholder="Додаткові побажання..." value={formData.comment} onChange={handleChange} className="bg-background/50 border-border/50 focus:border-primary transition-colors resize-none h-20 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            {/* Footer buttons */}
            <div className="shrink-0 px-6 py-5 border-t border-border/50 bg-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">До сплати:</span>
                <span className="text-primary text-3xl font-black">{getTotal()} €</span>
              </div>
              <Button 
                onClick={handleWhatsAppOrder}
                disabled={isSubmitting || items.length === 0}
                className="w-full h-14 text-lg rounded-xl font-black bg-[#25D366] hover:bg-[#22c35e] text-white shadow-[0_20px_40px_rgba(37,211,102,0.2)] flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
              >
                <MessageCircle className="h-6 w-6 shrink-0" />
                {isSubmitting ? "Відкриваємо..." : "ЗАМОВИТИ У WHATSAPP"}
              </Button>
              <p className="text-[9px] text-center text-muted-foreground uppercase tracking-tight opacity-50 font-bold">Вас буде перенаправлено у додаток WhatsApp</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
