import Link from "next/link";
import CartSidebar from "@/components/cart/CartSidebar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="text-2xl font-black tracking-tighter text-white">
              Sushi<span className="text-primary">MAMA</span>
            </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
            Про нас
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CartSidebar />
        </div>
      </div>
    </header>
  );
}
