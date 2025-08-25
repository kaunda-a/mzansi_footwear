"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BillboardService } from "@/lib/services/billboard";
import type { BillboardWithCreator } from "@/lib/services/billboard";
import { IconX, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeaderBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const data = await BillboardService.getActiveBillboards("HEADER");
        setBillboards(data);
      } catch (error) {
        console.error("Error fetching header billboards:", error);
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
    }, 4000);

    return () => clearInterval(interval);
  }, [billboards.length]);

  if (loading || billboards.length === 0) return null;

  const currentBillboard = billboards[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/30">
      <div className="container mx-auto px-4 py-2">
        <motion.div
          key={currentBillboard.id}
          className="flex items-center justify-between gap-4"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5 
          }}
        >
          {/* Content */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {currentBillboard.type.replace("_", " ").toLowerCase()}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <h3 className="text-sm font-medium truncate text-foreground">
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {currentBillboard.linkUrl && (
              <Link 
                href={currentBillboard.linkUrl} 
                target="_blank"
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                {currentBillboard.linkText || "Learn more"}
                <IconExternalLink className="w-3 h-3" />
              </Link>
            )}
            
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              onClick={() => {
                setBillboards(prev => prev.filter(b => b.id !== currentBillboard.id));
                if (billboards.length <= 1) return null;
              }}
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Progress indicator */}
      {billboards.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted/30">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 4,
              ease: "linear"
            }}
          />
        </div>
      )}
    </div>
  );
}