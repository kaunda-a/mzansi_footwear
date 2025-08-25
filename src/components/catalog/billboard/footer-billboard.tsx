"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BillboardService } from "@/lib/services/billboard";
import type { BillboardWithCreator } from "@/lib/services/billboard";
import { IconX, IconExternalLink, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FooterBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const data = await BillboardService.getActiveBillboards("FOOTER");
        setBillboards(data);
      } catch (error) {
        console.error("Error fetching footer billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  // Horizontal scrolling animation
  useEffect(() => {
    if (billboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % billboards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [billboards.length]);

  if (loading || billboards.length === 0) return null;

  const currentBillboard = billboards[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-muted/50 to-muted/30 border-t border-border/20 py-3">
      <div className="container mx-auto px-4">
        <motion.div
          key={currentBillboard.id}
          className="flex items-center justify-between gap-4"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6 
          }}
        >
          {/* Content */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <IconSparkles className="w-4 h-4 text-primary" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                  {currentBillboard.type.replace("_", " ").toLowerCase()}
                </span>
                <span className="text-xs text-muted-foreground/60">•</span>
                <h3 className="text-sm font-medium truncate text-foreground/90">
                  {currentBillboard.title}
                </h3>
              </div>
              
              {currentBillboard.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {currentBillboard.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {currentBillboard.linkUrl && (
              <Link 
                href={currentBillboard.linkUrl} 
                target="_blank"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-primary/5"
              >
                {currentBillboard.linkText || "Explore"}
                <IconExternalLink className="w-3 h-3" />
              </Link>
            )}
            
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              onClick={() => {
                setBillboards(prev => prev.filter(b => b.id !== currentBillboard.id));
                if (billboards.length <= 1) return null;
              }}
            >
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-16 h-16 bg-secondary/5 rounded-full blur-lg animate-pulse delay-1000" />
      </div>
      
      {/* Progress indicator */}
      {billboards.length > 1 && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-muted/20">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 5,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
    </div>
  );
}