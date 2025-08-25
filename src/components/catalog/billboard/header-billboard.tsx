"use client";

import { useState, useEffect } from "react";
import { BillboardService } from "@/lib/services";
import type { BillboardWithCreator } from "@/lib/services";
import { IconX, IconExternalLink, IconBolt } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeaderBillboard() {
  const [billboards, setBillboards] = useState<BillboardWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || billboards.length === 0) return null;

  // For header billboard, we'll show one message at a time
  const billboard = billboards[0];

  return (
    <div className="relative overflow-hidden border-b bg-background/90 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <IconBolt className="h-4 w-4 text-primary flex-shrink-0" />
          
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
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
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              {billboard.linkText || "Learn more"}
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