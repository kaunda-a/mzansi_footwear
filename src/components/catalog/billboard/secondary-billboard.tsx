"use client";

import { BillboardContainer } from "@/components/catalog/billboard/billboard-container";
import { Suspense } from "react";

export function SecondaryBillboard() {
  return (
    <div className="container mx-auto px-4 py-4">
      <Suspense fallback={<div className="h-32 md:h-40 rounded-lg bg-muted animate-pulse" />}>
        <BillboardContainer
          position="FOOTER"
          compact={true}
          className="h-32 md:h-40 rounded-lg"
        />
      </Suspense>
    </div>
  );
}