"use client";

import { useState, useEffect } from "react";
import { Api } from "@/lib/api";
import type { BillboardWithCreator } from "@/lib/services";
import { CarouselBillboard } from "@/components/catalog/billboard/carousel-billboard";
import { motion } from "motion/react";

export function HeroBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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
      <motion.div 
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Advanced hero-specific enhancements */}
        
        {/* Multi-layer gradient foundation */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-primary/5 to-secondary/10 backdrop-blur-2xl pointer-events-none z-0" />
        
        {/* Dynamic animated background elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-primary/40 to-accent/30 blur-3xl"
            animate={{ 
              x: isHovered ? [0, -20, 0] : [0, 10, 0],
              y: isHovered ? [0, -15, 0] : [0, -10, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-gradient-to-r from-secondary/40 to-primary/30 blur-3xl"
            animate={{ 
              x: isHovered ? [0, 15, 0] : [0, -10, 0],
              y: isHovered ? [0, 10, 0] : [0, 15, 0],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Sophisticated image enhancement layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-10" />
        
        {/* Advanced vignette effect with dynamic intensity */}
        <div className="absolute inset-0 shadow-[inset_0_0_10rem_0_rgba(0,0,0,0.6)] rounded-3xl pointer-events-none z-10" />
        
        {/* Color enhancement with blend modes */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-secondary/15 mix-blend-overlay pointer-events-none z-10" />
        
        {/* Premium chrome-like border effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none z-20">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/30 via-transparent to-secondary/30 opacity-40" 
               style={{ mask: "linear-gradient(to bottom, black 0%, transparent 100%)" }} />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 to-transparent opacity-30" 
               style={{ mask: "linear-gradient(to right, black 0%, transparent 100%)" }} />
        </div>
        
        {/* Hero accent glow with animation */}
        <motion.div 
          className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/30 rounded-3xl blur-2xl opacity-40 z-0"
          animate={{ 
            opacity: isHovered ? 0.6 : 0.4,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Premium badge indicator */}
        <div className="absolute top-4 left-4 z-30">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-border/50 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Premium Collection
            </span>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none z-15">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-20">
          <CarouselBillboard
            billboards={billboards}
            height="h-48 md:h-64 lg:h-80"
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showArrows={true}
            className="rounded-3xl"
          />
        </div>
        
        {/* Subtle reflection effect at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/40 to-transparent rounded-b-3xl pointer-events-none z-25" />
      </motion.div>
    </div>
  );
}