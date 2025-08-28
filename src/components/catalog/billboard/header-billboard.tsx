"use client";

import { useState, useEffect } from "react";
import { Api } from "@/lib/api";
import type { BillboardWithCreator } from "@/lib/services";
import { IconX, IconExternalLink, IconBolt, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/components/active-theme";

// Define types for our theme styles
type BillboardType = "PROMOTIONAL" | "SALE" | "ANNOUNCEMENT" | string;
type ThemeName = "default" | "blue" | "green" | "amber" | string;

interface BillboardStyle {
  bg: string;
  border: string;
  text: string;
  icon: string;
  glow: string;
}

interface ThemeColors {
  [key: string]: {
    [key: string]: BillboardStyle;
  };
}

export function HeaderBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeTheme } = useThemeConfig();

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

  // Determine styling based on billboard type - using theme-aware classes
  const getTypeStyles = (type: BillboardType, theme: ThemeName): BillboardStyle => {
    // Theme-aware color mappings
    const themeColors: ThemeColors = {
      default: {
        PROMOTIONAL: {
          bg: "bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10",
          border: "border-b border-blue-200/30",
          text: "text-blue-600 dark:text-blue-400",
          icon: "text-blue-500 dark:text-blue-400",
          glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_15px_rgba(96,165,250,0.15)]"
        },
        SALE: {
          bg: "bg-gradient-to-r from-red-500/10 via-orange-500/5 to-amber-500/10",
          border: "border-b border-red-200/30",
          text: "text-red-600 dark:text-red-400",
          icon: "text-red-500 dark:text-red-400",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_15px_rgba(248,113,113,0.15)]"
        },
        ANNOUNCEMENT: {
          bg: "bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10",
          border: "border-b border-green-200/30",
          text: "text-green-600 dark:text-green-400",
          icon: "text-green-500 dark:text-green-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:shadow-[0_0_15px_rgba(52,211,153,0.15)]"
        }
      },
      blue: {
        PROMOTIONAL: {
          bg: "bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10",
          border: "border-b border-blue-200/30",
          text: "text-blue-600 dark:text-blue-300",
          icon: "text-blue-500 dark:text-blue-300",
          glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_15px_rgba(147,197,253,0.15)]"
        },
        SALE: {
          bg: "bg-gradient-to-r from-red-500/10 via-orange-500/5 to-amber-500/10",
          border: "border-b border-red-200/30",
          text: "text-red-600 dark:text-red-300",
          icon: "text-red-500 dark:text-red-300",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_15px_rgba(252,165,165,0.15)]"
        },
        ANNOUNCEMENT: {
          bg: "bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10",
          border: "border-b border-green-200/30",
          text: "text-green-600 dark:text-green-300",
          icon: "text-green-500 dark:text-green-300",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:shadow-[0_0_15px_rgba(110,231,183,0.15)]"
        }
      },
      green: {
        PROMOTIONAL: {
          bg: "bg-gradient-to-r from-lime-500/10 via-green-500/5 to-emerald-500/10",
          border: "border-b border-lime-200/30",
          text: "text-lime-600 dark:text-lime-300",
          icon: "text-lime-500 dark:text-lime-300",
          glow: "shadow-[0_0_15px_rgba(132,204,22,0.15)] dark:shadow-[0_0_15px_rgba(190,242,100,0.15)]"
        },
        SALE: {
          bg: "bg-gradient-to-r from-red-500/10 via-orange-500/5 to-amber-500/10",
          border: "border-b border-red-200/30",
          text: "text-red-600 dark:text-red-300",
          icon: "text-red-500 dark:text-red-300",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_15px_rgba(252,165,165,0.15)]"
        },
        ANNOUNCEMENT: {
          bg: "bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-emerald-500/10",
          border: "border-b border-cyan-200/30",
          text: "text-cyan-600 dark:text-cyan-300",
          icon: "text-cyan-500 dark:text-cyan-300",
          glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)] dark:shadow-[0_0_15px_rgba(103,232,249,0.15)]"
        }
      },
      amber: {
        PROMOTIONAL: {
          bg: "bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-red-500/10",
          border: "border-b border-amber-200/30",
          text: "text-amber-600 dark:text-amber-300",
          icon: "text-amber-500 dark:text-amber-300",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)] dark:shadow-[0_0_15px_rgba(252,211,77,0.15)]"
        },
        SALE: {
          bg: "bg-gradient-to-r from-red-500/10 via-orange-500/5 to-amber-500/10",
          border: "border-b border-red-200/30",
          text: "text-red-600 dark:text-red-300",
          icon: "text-red-500 dark:text-red-300",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_15px_rgba(252,165,165,0.15)]"
        },
        ANNOUNCEMENT: {
          bg: "bg-gradient-to-r from-lime-500/10 via-green-500/5 to-emerald-500/10",
          border: "border-b border-lime-200/30",
          text: "text-lime-600 dark:text-lime-300",
          icon: "text-lime-500 dark:text-lime-300",
          glow: "shadow-[0_0_15px_rgba(132,204,22,0.15)] dark:shadow-[0_0_15pxrgba(190,242,100,0.15)]"
        }
      }
    };

    // Get theme-specific colors or fallback to default
    const themeSpecific = themeColors[theme] || themeColors.default;
    return themeSpecific[type] || {
      bg: "bg-gradient-to-r from-gray-500/10 via-slate-500/5 to-zinc-500/10",
      border: "border-b border-gray-200/30",
      text: "text-gray-600 dark:text-gray-300",
      icon: "text-gray-500 dark:text-gray-400",
      glow: "shadow-[0_0_15px_rgba(107,114,128,0.15)] dark:shadow-[0_0_15px_rgba(209,213,219,0.15)]"
    };
  };

  const styles = getTypeStyles(billboard.type, activeTheme);
  const IconComponent = billboard.type === "PROMOTIONAL" ? IconSparkles : IconBolt;

  return (
    <div className={cn(
      "relative overflow-hidden backdrop-blur-xl",
      styles.bg,
      styles.border,
      styles.glow,
      "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]",
      "after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"
    )}>
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Animated Content Area */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Pulsing Icon */}
            <div className="flex-shrink-0 relative">
              <IconComponent className={cn("h-5 w-5", styles.icon)} />
              <div className={cn("absolute inset-0 rounded-full", styles.icon, "bg-current/20 blur-sm animate-pulse")} />
            </div>
            
            {/* Content with Unique Header Styling */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  styles.text,
                  "bg-current/10 px-2 py-0.5 rounded-full"
                )}>
                  {billboard.type.replace("_", " ")}
                </span>
                <div className="w-1 h-1 rounded-full bg-current/40" />
                <h3 className="text-sm font-bold truncate text-foreground">
                  {billboard.title}
                </h3>
              </div>
              
              {/* Unique Scrolling Description for Header */}
              <div className="relative mt-1 overflow-hidden h-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="animate-marquee whitespace-nowrap text-xs text-muted-foreground font-medium">
                    <span className="mx-4">• {billboard.description} •</span>
                    <span className="mx-4">• {billboard.title} •</span>
                    <span className="mx-4">• {billboard.description} •</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {billboard.linkUrl && (
              <Link 
                href={billboard.linkUrl} 
                target="_blank"
                className={cn(
                  "text-xs font-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                  "bg-current/15 hover:bg-current/25 transition-all duration-300",
                  "border border-current/20 backdrop-blur-sm",
                  "hover:scale-105 hover:shadow-lg transform",
                  styles.text
                )}
              >
                {billboard.linkText || "LEARN MORE"}
                <IconExternalLink className="w-3 h-3" />
              </Link>
            )}
            
            <button 
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted/50 transition-all duration-200"
              onClick={() => setBillboards([])}
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-full opacity-20">
        <div className="absolute top-1/4 right-4 w-2 h-2 rounded-full bg-current animate-pulse" />
        <div className="absolute top-3/4 right-8 w-1 h-1 rounded-full bg-current animate-pulse delay-1000" />
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
    </div>
  );
}