"use client";

import { useState, useEffect } from "react";
import { Api } from "@/lib/api";
import type { BillboardWithCreator } from "@/lib/services";
import { CarouselBillboard } from "@/components/catalog/billboard/carousel-billboard";
import { motion } from "motion/react";

export function HeroBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hero billboards
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        const result = await Api.getBillboards({ position: "HEADER" });
        setBillboards(result.billboards);
      } catch (error) {
        console.error("Error fetching hero billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  // Don't render if no billboards or loading
  if (loading || !billboards.length) return null;

  return (
    <div className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background/95 via-primary/10 to-secondary/15 backdrop-blur-2xl border border-border/70 shadow-2xl shadow-primary/10">
        {/* Advanced geometric decorative elements - more sophisticated than dashboard */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-gradient-to-br from-secondary/15 via-primary/10 to-transparent blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-2xl" />
        </div>
        
        {/* Enhanced sophisticated grid pattern overlay */}
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 12px 12px, rgba(100, 100, 100, 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        {/* Premium multi-layer accent borders - more advanced than dashboard */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        
        {/* Advanced corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8">
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
        </div>
        <div className="absolute top-0 right-0 w-8 h-8">
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-secondary/30 rounded-tr-2xl" />
        </div>
        <div className="absolute bottom-0 left-0 w-8 h-8">
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent/30 rounded-bl-2xl" />
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8">
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
        </div>
        
        {/* Premium badge indicator - responsive positioning */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-30">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-xl px-3 py-1.5 rounded-full border border-border/60 shadow-lg">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-ping opacity-30" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hero Collection
            </span>
          </div>
        </div>
        
        {/* Enhanced content container with sophisticated gradients */}
        <div className="relative p-2">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/20 to-muted/10 backdrop-blur-sm">
            {/* Advanced image enhancement overlays - more sophisticated than dashboard */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10" />
            
            {/* Enhanced vignette effect with more intensity */}
            <div className="absolute inset-0 shadow-[inset_0_0_12rem_0_rgba(0,0,0,0.7)] rounded-2xl pointer-events-none z-10" />
            
            {/* Advanced saturation boost with multiple color layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 mix-blend-overlay pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/5 mix-blend-overlay pointer-events-none z-10" />
            
            {/* Subtle animated glow effect */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 animate-pulse" 
                   style={{ animationDuration: '4s' }} />
            </div>
            
            <div className="relative z-20">
              <CarouselBillboard
                billboards={billboards}
                height="h-48 md:h-64 lg:h-80"
                autoPlay={true}
                autoPlayInterval={4000}
                showDots={true}
                showArrows={true}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
        
        {/* Enhanced reflection effect with gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/50 via-background/20 to-transparent rounded-b-3xl pointer-events-none" />
        
        {/* Subtle floating particles for premium feel */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{
                left: `${10 + i * 10}%`,
                top: `${15 + (i % 4) * 15}%`,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}