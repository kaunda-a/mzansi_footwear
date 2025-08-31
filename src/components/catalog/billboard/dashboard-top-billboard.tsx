import { CarouselBillboardContainer } from "@/components/catalog/billboard/carousel-billboard-container";
import { motion } from "motion/react";
import { Suspense } from "react";

export function DashboardTopBillboard() {
  return (
    <motion.div 
      className="w-full mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/90 via-primary/5 to-muted/30 backdrop-blur-xl border border-border/60 shadow-xl shadow-primary/5">
        {/* Modern geometric decorative elements */}
        <motion.div 
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-secondary/10 to-primary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
        
        {/* Sophisticated grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 15px 15px, #ccc 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        {/* Elegant accent border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        {/* Premium badge indicator */}
        <motion.div 
          className="absolute top-3 right-3 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border/50 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-primary">Featured</span>
          </div>
        </motion.div>
        
        <div className="relative p-1.5">
          <div className="relative rounded-xl overflow-hidden">
            {/* Image enhancement overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 pointer-events-none z-10" />
            
            {/* Vignette effect */}
            <div className="absolute inset-0 shadow-[inset_0_0_5rem_0_rgba(0,0,0,0.4)] rounded-xl pointer-events-none z-10" />
            
            {/* Saturation boost effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 mix-blend-overlay pointer-events-none z-10" />
            
            <Suspense fallback={<div className="h-48 rounded-xl bg-muted animate-pulse" />}>
              <CarouselBillboardContainer
                position="DASHBOARD_TOP"
                height="h-48"
                autoPlay={true}
                autoPlayInterval={6000}
                showDots={true}
                showArrows={true}
                className="rounded-xl shadow-lg"
              />
            </Suspense>
          </div>
        </div>
        
        {/* Subtle reflection effect */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}