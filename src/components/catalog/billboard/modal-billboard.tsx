"use client";

import { useState, useEffect } from "react";
import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";

export function ModalBillboard() {
  const [isOpen, setIsOpen] = useState(false);

  // Show modal billboard after a delay or based on some condition
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show if no billboard is currently active in modal position
      setIsOpen(true);
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
        >
          <span className="sr-only">Close</span>
          <div className="w-6 h-6 flex items-center justify-center">×</div>
        </button>
        <div className="p-4">
          <CarouselBillboardContainer
            position="MODAL"
            height="h-48"
            autoPlay={true}
            autoPlayInterval={4000}
            showDots={true}
            showArrows={false}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}