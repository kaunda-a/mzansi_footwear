"use client";

import { useState, useEffect } from "react";
import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";
import { IconX, IconSparkles, IconBolt } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export function ModalBillboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show modal billboard after a delay, then hide it after a few seconds, and repeat
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;
    
    const showModal = () => {
      setIsOpen(true);
      // Hide after 5 seconds
      hideTimer = setTimeout(() => {
        setIsOpen(false);
        // Show again after 25 seconds (30 seconds total cycle)
        showTimer = setTimeout(showModal, 25000);
      }, 5000);
    };
    
    // Initial show after 30 seconds
    showTimer = setTimeout(showModal, 30000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
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
        className={`fixed z-50 max-w-sm w-full ${
          isMobile 
            ? "bottom-24 left-1/2 transform -translate-x-1/2" // Position above navbar on mobile
            : "bottom-4 right-4" // Original position on desktop
        }`}
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
              {!isMobile && <span>Swipe for more</span>}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}