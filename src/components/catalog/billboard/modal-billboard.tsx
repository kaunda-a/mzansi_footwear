"use client";

import { useState, useEffect } from "react";
import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";
import { IconX, IconSparkles, IconBolt } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.3 
        }}
        className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
      >
        {/* Glowing Background Effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-lg" />
        
        {/* Toast Container */}
        <div className="relative bg-gradient-to-br from-background/90 to-muted/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          
          {/* Floating Orbs */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/10 rounded-full blur-md" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-pink-500/10 rounded-full blur-sm" />
          
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-3 pb-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSparkles className="h-4 w-4 text-purple-500" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500/30"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">
                Exclusive Offer
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-muted/50 transition-all duration-200 text-muted-foreground"
            >
              <IconX className="h-3.5 w-3.5" />
            </motion.button>
          </div>
          
          {/* Billboard Content - Compact Version */}
          <div className="p-1 pb-2">
            <CarouselBillboardContainer
              position="MODAL"
              height="h-24"
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={false}
              className="rounded-xl"
            />
          </div>
          
          {/* Footer */}
          <div className="px-3 pb-2 pt-0">
            <div className="flex items-center justify-between text-[9px] text-muted-foreground/70">
              <div className="flex items-center gap-1">
                <IconBolt className="h-2.5 w-2.5 text-amber-500" />
                <span>Limited Time</span>
              </div>
              <span>Swipe for more</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}