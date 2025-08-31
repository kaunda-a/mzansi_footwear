"use client";

import { useState, useEffect } from "react";
import { Api } from "@/lib/api";
import type { BillboardWithCreator } from "@/lib/services";
import { 
  IconX, 
  IconExternalLink, 
  IconBolt, 
  IconSparkles,
  IconAlertCircle,
  IconInfoCircle,
  IconTag
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function HeaderBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const result = await Api.getBillboards({ position: "HEADER" });
        setBillboards(result.billboards);
      } catch (error) {
        console.error("Error fetching header billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  if (loading || billboards.length === 0) return null;

  // For header billboard, we'll show one message at a time
  const billboard = billboards[0];

  // Determine styling based on billboard type - using theme-adaptive colors like other components
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "PROMOTIONAL":
        return {
          bg: "bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10",
          border: "border-b border-primary/20",
          text: "text-primary",
          icon: "text-primary",
          glow: "shadow-[0_0_15px_rgba(var(--primary),0.15)]",
          badge: "bg-primary/10 text-primary"
        };
      case "SALE":
        return {
          bg: "bg-gradient-to-r from-accent/10 via-accent/5 to-secondary/10",
          border: "border-b border-accent/20",
          text: "text-accent",
          icon: "text-accent",
          glow: "shadow-[0_0_15px_rgba(var(--accent),0.15)]",
          badge: "bg-accent/10 text-accent"
        };
      case "ANNOUNCEMENT":
        return {
          bg: "bg-gradient-to-r from-accent/10 via-accent/5 to-secondary/10",
          border: "border-b border-accent/20",
          text: "text-accent",
          icon: "text-accent",
          glow: "shadow-[0_0_15px_rgba(var(--accent),0.15)]",
          badge: "bg-accent/10 text-accent"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500/10 via-slate-500/5 to-zinc-500/10",
          border: "border-b border-gray-500/20",
          text: "text-gray-600 dark:text-gray-300",
          icon: "text-gray-500 dark:text-gray-400",
          glow: "shadow-[0_0_15px_rgba(107,114,128,0.15)] dark:shadow-[0_0_15px_rgba(209,213,219,0.15)]",
          badge: "bg-gray-500/10 text-gray-600 dark:text-gray-300"
        };
    }
  };

  const styles = getTypeStyles(billboard.type);
  
  // Select icon based on type
  const getIconComponent = () => {
    switch (billboard.type) {
      case "PROMOTIONAL": return IconSparkles;
      case "SALE": return IconTag;
      case "ANNOUNCEMENT": return IconInfoCircle;
      default: return IconBolt;
    }
  };
  
  const IconComponent = getIconComponent();

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden backdrop-blur-xl mx-2 sm:mx-4 rounded-lg sm:rounded-xl",
        styles.bg,
        styles.border,
        styles.glow,
        "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]",
        "after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-1">
          {/* Animated Content Area */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Pulsing Icon */}
            <div className="flex-shrink-0 relative">
              <motion.div
                className={cn("p-1.5 sm:p-2 rounded-lg", styles.badge)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className={cn("h-3 w-3 sm:h-4 sm:w-4", styles.icon)} />
              </motion.div>
              <div className={cn("absolute inset-0 rounded-full", styles.icon, "bg-current/20 blur-sm animate-pulse")} />
            </div>
            
            {/* Content with Unique Header Styling */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                <motion.span 
                  className={cn(
                    "text-[8px] xs:text-[10px] font-black uppercase tracking-widest",
                    styles.text,
                    "px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full",
                    styles.badge
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {billboard.type.replace("_", " ")}
                </motion.span>
                <div className="hidden xs:block w-1 h-1 rounded-full bg-current/40" />
                <motion.h3 
                  className="text-xs sm:text-sm font-semibold truncate text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {billboard.title}
                </motion.h3>
              </div>
              
              {/* Unique Scrolling Description for Header */}
              <div className="relative mt-1 overflow-hidden h-4 sm:h-5">
                <motion.div 
                  className="absolute inset-0 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="animate-marquee-mobile sm:animate-marquee-slow whitespace-nowrap text-[10px] sm:text-xs text-muted-foreground font-normal sm:font-medium">
                    <span className="mx-2 sm:mx-4">• {billboard.description} •</span>
                    <span className="mx-2 sm:mx-4">• {billboard.title} •</span>
                    <span className="mx-2 sm:mx-4">• {billboard.description} •</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {billboard.linkUrl && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link 
                  href={billboard.linkUrl} 
                  target="_blank"
                  className={cn(
                    "text-[10px] sm:text-xs font-black flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg",
                    "bg-current/15 hover:bg-current/25 transition-all duration-300",
                    "border border-current/20 backdrop-blur-sm",
                    "hover:scale-105 hover:shadow-lg transform",
                    styles.text,
                    "flex-shrink-0"
                  )}
                >
                  {billboard.linkText || "LEARN MORE"}
                  <IconExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </motion.div>
            )}
            
            <motion.button 
              className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 rounded-full hover:bg-muted/50 transition-all duration-200"
              onClick={() => setBillboards([])}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconX className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Subtle Animated Background Elements */}
      <div className="absolute top-0 right-0 w-16 sm:w-32 h-full opacity-20">
        <motion.div 
          className="absolute top-1/4 right-2 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse" 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-4 sm:right-8 w-1 h-1 sm:w-1 sm:h-1 rounded-full bg-current animate-pulse delay-1000" 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
      
      {/* Image enhancement if billboard has an image */}
      {billboard.imageUrl && (
        <>
          {/* Vignette effect for header with image */}
          <div className="absolute inset-0 shadow-[inset_0_0_5rem_0_rgba(0,0,0,0.3)] rounded-xl pointer-events-none z-10" />
          
          {/* Color enhancement for header with image */}
          <div className="absolute inset-0 bg-gradient-to-r from-current/5 via-transparent to-current/5 mix-blend-overlay pointer-events-none z-10" />
        </>
      )}
    </motion.div>
  );
}