"use client";

import { useState, useEffect } from "react";
import { Api } from "@/lib/api";
import type { BillboardWithCreator } from "@/lib/services";
import { IconX, IconExternalLink, IconStar, IconFlame, IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FooterBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const result = await Api.getBillboards({ position: "FOOTER" });
        setBillboards(result.billboards);
      } catch (error) {
        console.error("Error fetching footer billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  if (loading || billboards.length === 0) return null;

  // For footer billboard, we'll show one message at a time
  const billboard = billboards[0];

  // Determine styling based on billboard type - Footer specific styling
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "PROMOTIONAL":
        return {
          bg: "bg-gradient-to-l from-purple-600/15 via-pink-600/10 to-rose-600/15",
          border: "border-t border-purple-300/20",
          text: "text-purple-400",
          accent: "text-purple-300",
          icon: "text-purple-400",
          glow: "shadow-[0_0_20px_rgba(192,132,252,0.1)]"
        };
      case "SALE":
        return {
          bg: "bg-gradient-to-l from-amber-600/15 via-orange-600/10 to-red-600/15",
          border: "border-t border-amber-300/20",
          text: "text-amber-400",
          accent: "text-amber-300",
          icon: "text-amber-400",
          glow: "shadow-[0_0_20px_rgba(251,191,36,0.1)]"
        };
      case "ANNOUNCEMENT":
        return {
          bg: "bg-gradient-to-l from-emerald-600/15 via-teal-600/10 to-cyan-600/15",
          border: "border-t border-emerald-300/20",
          text: "text-emerald-400",
          accent: "text-emerald-300",
          icon: "text-emerald-400",
          glow: "shadow-[0_0_20px_rgba(52,211,153,0.1)]"
        };
      default:
        return {
          bg: "bg-gradient-to-l from-slate-600/15 via-gray-600/10 to-zinc-600/15",
          border: "border-t border-slate-300/20",
          text: "text-slate-400",
          accent: "text-slate-300",
          icon: "text-slate-400",
          glow: "shadow-[0_0_20px_rgba(148,163,184,0.1)]"
        };
    }
  };

  const styles = getTypeStyles(billboard.type);
  const IconComponent = billboard.type === "PROMOTIONAL" ? IconStar : 
                       billboard.type === "SALE" ? IconFlame : IconBell;

  return (
    <div className={cn(
      "relative overflow-hidden backdrop-blur-xl",
      styles.bg,
      styles.border,
      styles.glow,
      "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]",
      "after:absolute after:inset-0 after:bg-[linear-gradient(270deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Unique Footer Layout */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Floating Icon with Orbit Effect */}
            <div className="flex-shrink-0 relative">
              <div className={cn(
                "absolute inset-0 rounded-full animate-spin",
                "bg-gradient-to-r from-current/20 to-transparent",
                "w-10 h-10 rounded-full",
                styles.icon
              )} style={{ animationDuration: "8s" }} />
              <div className="relative z-10">
                <IconComponent className={cn("h-6 w-6", styles.icon)} />
              </div>
            </div>

            {/* Footer Content with Unique Styling */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={cn(
                  "text-xs font-extrabold uppercase tracking-widest",
                  styles.accent,
                  "bg-current/10 px-2.5 py-1 rounded-lg"
                )}>
                  {billboard.type.replace("_", " ")}
                </span>
                
                {/* Unique Footer Scrolling Animation */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="inline-block whitespace-nowrap">
                    <div className="animate-marquee-reverse text-sm font-bold mx-4 inline-block" style={{ animationDuration: "15s" }}>
                      <span className={styles.text}>{billboard.title}</span>
                      <span className="mx-3 text-muted-foreground/60">•</span>
                      <span className="text-foreground">{billboard.description}</span>
                      <span className="mx-3 text-muted-foreground/60">•</span>
                      <span className={styles.text}>{billboard.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions with Unique Styling */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {billboard.linkUrl && (
              <Link 
                href={billboard.linkUrl} 
                target="_blank"
                className={cn(
                  "text-xs font-extrabold flex items-center gap-1 px-4 py-2 rounded-xl",
                  "bg-gradient-to-r from-current/20 to-current/10",
                  "hover:from-current/30 hover:to-current/20 transition-all duration-300",
                  "border border-current/30 backdrop-blur-sm",
                  "hover:scale-105 hover:shadow-xl transform",
                  "shadow-lg",
                  styles.text
                )}
              >
                <span>{billboard.linkText || "EXPLORE"}</span>
                <IconExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            
            <button 
              className="text-muted-foreground/70 hover:text-foreground p-2 rounded-xl hover:bg-muted/30 transition-all duration-200 backdrop-blur-sm"
              onClick={() => setBillboards([])}
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Unique Footer Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-16 h-16 rounded-full bg-current/5 blur-xl animate-pulse" />
        <div className="absolute top-0 right-1/3 w-12 h-12 rounded-full bg-current/5 blur-lg animate-pulse delay-1000" />
      </div>
    </div>
  );
}