"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple hardcoded password for now
    if (password === "admin123") {
      // Store in simple cookie or localStorage (cookie is better for server checks later)
      document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24 hours
      toast.success("Вхід дозволено!");
      router.push("/admin/dashboard");
    } else {
      toast.error("Невірний пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Вхід Адміна</CardTitle>
          <CardDescription>
            Введіть пароль для доступу до керування меню
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Введіть пароль..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-muted/50 focus-visible:ring-primary"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold gap-2">
              <LogIn className="w-5 h-5" />
              Увійти
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6 italic">
            Підказка: стандартний пароль — admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
