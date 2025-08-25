"use client";

import { useState, useEffect } from "react";
import { BillboardService } from "@/lib/services";
import type { BillboardWithCreator } from "@/lib/services";
import { IconX, IconExternalLink, IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FooterBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || billboards.length === 0) return null;

  // For footer billboard, we'll show one message at a time
  const billboard = billboards[0];

  return (
    <div className="relative overflow-hidden border-t bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <IconStar className="h-4 w-4 text-purple-500 flex-shrink-0" />
          
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
              {billboard.type.replace("_", " ")}
            </span>
            <span className="text-muted-foreground">•</span>
            
            <div className="flex-1 min-w-0">
              <div className="animate-marquee whitespace-nowrap text-sm font-medium">
                {billboard.title} • {billboard.description}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {billboard.linkUrl && (
            <Link 
              href={billboard.linkUrl} 
              target="_blank"
              className="text-xs text-purple-500 hover:text-purple-400 flex items-center gap-1"
            >
              {billboard.linkText || "Explore"}
              <IconExternalLink className="w-3 h-3" />
            </Link>
          )}
          
          <button 
            className="text-muted-foreground hover:text-foreground p-1"
            onClick={() => setBillboards([])}
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}