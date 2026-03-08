"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=90&w=1920&auto=format&fit=crop')",
        }}
      />
      {/* Dark overlay with red gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />

      {/* Red glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 text-sm font-medium px-4 py-1.5 rounded-full border border-primary/50 text-primary bg-primary/10 tracking-widest uppercase">
            Берлін • Доставка 30 хв
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white leading-none uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Sushi{" "}
          <span className="text-primary drop-shadow-[0_0_30px_rgba(200,40,40,0.8)]">
            MAMA
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/70 mt-4 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Свіжі суші з доставкою за{" "}
          <span className="text-accent font-bold">30 хвилин</span>. Японський
          смак — прямо до вашої оселі.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link href="#menu">
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-[0_0_20px_rgba(200,40,40,0.5)] hover:shadow-[0_0_30px_rgba(200,40,40,0.7)] transition-all"
            >
              Замовити зараз
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 flex gap-8 justify-center text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-3xl font-black text-white">30 хв</div>
            <div>Доставка</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-black text-white">100%</div>
            <div>Свіжі суші</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-black text-white">5★</div>
            <div>Рейтинг</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ArrowDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
