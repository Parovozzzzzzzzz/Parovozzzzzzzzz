"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  MENU_REFRESH_CHANNEL_NAME,
  MENU_REFRESH_EVENT,
  MENU_REFRESH_STORAGE_KEY,
  MenuItem,
  fetchMenu,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Edit,
  Plus,
  LogOut,
  ChevronLeft,
  Settings2,
  Package,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Роли",
  });

  const router = useRouter();

  const [settings, setSettings] = useState({ phoneNumber: "" });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [forceRefreshing, setForceRefreshing] = useState(false);

  useEffect(() => {
    const auth = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_auth="))
      ?.split("=")[1];

    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      loadData();
      loadSettings();
    }
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchMenu();
    setItems(data);
    setLoading(false);
  };

  const loadSettings = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    if (data.settings) {
      setSettings(data.settings);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        body: JSON.stringify({ settings }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Налаштування збережено!");
      }
    } catch {
      toast.error("Помилка збереження налаштувань");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setLocalImagePreview(previewUrl);
    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({ ...prev, image: data.url }));
      toast.success("Фото завантажено!");
    } catch {
      toast.error("Не вдалося завантажити фото");
    } finally {
      setImageUploading(false);
    }
  };

  const handleForceRefresh = async () => {
    setForceRefreshing(true);
    try {
      const menuVersion = Date.now().toString();
      const res = await fetch("/api/menu", {
        method: "POST",
        body: JSON.stringify({ settings: { menuVersion } }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to force refresh");

      if (typeof window !== "undefined") {
        localStorage.setItem(MENU_REFRESH_STORAGE_KEY, menuVersion);
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel(MENU_REFRESH_CHANNEL_NAME);
          channel.postMessage({ type: MENU_REFRESH_EVENT, menuVersion });
          channel.close();
        }
      }

      toast.success("Сигнал оновлення меню відправлено на головний сайт");
    } catch {
      toast.error("Не вдалося примусово оновити меню");
    } finally {
      setForceRefreshing(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    
    try {
      const res = await fetch("/api/menu", {
        method,
        body: JSON.stringify(isEditing ? { ...isEditing, ...formData } : formData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(isEditing ? "Зміни збережено!" : "Додано успішно!");
        setIsEditing(null);
        setIsAdding(false);
        setFormData({ name: "", description: "", price: 0, image: "", category: "Роли" });
        setLocalImagePreview(null);
        loadData();
      }
    } catch {
      toast.error("Помилка збереження");
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000); // Reset after 3 seconds
      return;
    }

    try {
      const res = await fetch("/api/menu", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Видалено!");
        setConfirmDeleteId(null);
        loadData();
      }
    } catch {
      toast.error("Помилка видалення");
    }
  };

  const startEdit = (item: MenuItem) => {
    setIsEditing(item);
    setFormData(item);
    setLocalImagePreview(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Settings2 className="text-primary w-6 h-6" />
              <h1 className="text-xl font-black tracking-tight uppercase">Admin Panel</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-2 border-border/50">
            <LogOut className="w-4 h-4" />
            Вийти
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 mt-10">
        {/* Global Settings */}
        <section className="mb-12">
          <Card className="border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Налаштування сайту
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-end gap-4 max-w-md">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Номер телефону WhatsApp</label>
                  <Input 
                    value={settings.phoneNumber} 
                    onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                    placeholder="380..." 
                  />
                </div>
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={settingsLoading}
                  className="shrink-0"
                >
                  {settingsLoading ? "Збереження..." : "Зберегти номер"}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 italic">
                Цей номер буде використовуватись для отримання замовлень у WhatsApp. Формат: 380...
              </p>
            </CardContent>
          </Card>
        </section>

        <AnimatePresence>
          {(isEditing || isAdding) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              className="mb-12"
            >
              <Card className="border-primary/50 shadow-2xl bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-black">{isEditing ? "Редагувати" : "Додати нову позицію"}</CardTitle>
                  <Button variant="ghost" className="text-muted-foreground" onClick={() => { setIsEditing(null); setIsAdding(false); setLocalImagePreview(null); }}>Скасувати</Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Назва</label>
                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Ціна (€)</label>
                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Категорія</label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormData({ ...formData, category: cat })}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                formData.category === cat
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border text-muted-foreground"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Опис</label>
                        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="h-[76px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Фото страви</label>
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={imageUploading}
                        />
                        <p className="text-xs text-muted-foreground">
                          {imageUploading ? "Завантаження фото..." : "Або вставте пряме посилання на фото нижче"}
                        </p>
                        <Input
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://... або /uploads/..."
                          required
                        />
                        {(localImagePreview || formData.image) && (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border/50 bg-muted/20">
                            <Image
                              src={localImagePreview || formData.image || "/next.svg"}
                              alt="Попередній перегляд"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                      <Button type="submit" disabled={imageUploading} className="w-full h-12 text-lg font-bold gap-2 mt-4 shadow-lg shadow-primary/20">
                        {isEditing ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {imageUploading ? "Завантаження фото..." : isEditing ? "Зберегти" : "Додати в меню"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!isEditing && !isAdding && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Package className="text-primary w-5 h-5" />
              </div>
              <div>
                <h2 className="text-3xl font-black">Управління меню</h2>
                <p className="text-muted-foreground text-sm">{items.length} позицій у списку</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleForceRefresh}
                disabled={forceRefreshing}
                className="h-12 px-6 rounded-xl font-bold gap-2"
              >
                <Loader2 className={`w-5 h-5 ${forceRefreshing ? "animate-spin" : ""}`} />
                {forceRefreshing ? "Оновлення..." : "Оновити меню на сайті"}
              </Button>
              <Button onClick={() => setIsAdding(true)} className="h-12 px-6 rounded-xl font-bold gap-2">
                <Plus className="w-5 h-5" />
                Нова страва
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p>Завантаження меню...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="border-border/50 group hover:border-primary/20 transition-all overflow-hidden bg-card/30">
                <CardContent className="p-4 flex gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-border/50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg truncate pr-2">{item.name}</h4>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="h-8 w-8 hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(item.id)} 
                          className={`h-8 w-8 transition-colors ${
                            confirmDeleteId === item.id 
                              ? "bg-destructive text-white hover:bg-destructive/90 animate-pulse" 
                              : "hover:text-destructive"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-primary font-black mb-1">{item.price} €</p>
                    <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="mt-2 text-[10px] inline-block bg-muted px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                      {item.category}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
