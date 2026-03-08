export type Category = "Роли" | "Сети";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
}

export const CATEGORIES: Category[] = [
  "Роли",
  "Сети",
];

// Fallback static data if API is not available
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "r1",
    name: "Філадельфія Класік",
    description: "Лосось, крем-сир, огірок, рис, норі.",
    price: 189,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
    category: "Роли",
  },
  {
    id: "r2",
    name: "Каліфорнія з лососем",
    description: "Лосось, авокадо, огірок, тобіко, майонез.",
    price: 169,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop",
    category: "Роли",
  },
  {
    id: "r3",
    name: "Зелений Дракон",
    description: "Вугор, авокадо, крем-сир, унагі соус, кунжут.",
    price: 229,
    image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=800&auto=format&fit=crop",
    category: "Роли",
  }
];

// Helper to fetch menu items
export async function fetchMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch("/api/menu", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch menu");
    const data = await res.json();
    return data.items || [];
  } catch {
    return DEFAULT_MENU_ITEMS;
  }
}

export async function fetchSettings(): Promise<{ phoneNumber: string }> {
  const settings = await fetchSiteSettings();
  return { phoneNumber: settings.phoneNumber };
}

export function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7) return raw;
  if (digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

export interface SiteSettings {
  phoneNumber: string;
  menuVersion?: string;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch("/api/menu", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    return data.settings || { phoneNumber: "380934843757", menuVersion: "0" };
  } catch {
    return { phoneNumber: "380934843757", menuVersion: "0" };
  }
}

export const MENU_REFRESH_STORAGE_KEY = "menu_force_refresh";
export const MENU_REFRESH_CHANNEL_NAME = "menu-updates";
export const MENU_REFRESH_EVENT = "force-refresh";
