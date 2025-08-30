import { motion } from "motion/react";
import { 
  IconBolt, 
  IconSparkles, 
  IconTag, 
  IconInfoCircle,
  IconExternalLink,
  IconX
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SophisticatedBillboardProps {
  title: string;
  description: string;
  type?: "PROMOTIONAL" | "SALE" | "ANNOUNCEMENT" | "DEFAULT";
  linkUrl?: string;
  linkText?: string;
  onClose?: () => void;
  className?: string;
}

export function SophisticatedBillboard({
  title,
  description,
  type = "DEFAULT",
  linkUrl,
  linkText,
  onClose,
  className
}: SophisticatedBillboardProps) {
  // Determine styling based on billboard type
  const getTypeStyles = () => {
    switch (type) {
      case "PROMOTIONAL":
        return {
          bg: "bg-gradient-to-r from-blue-500/5 via-blue-400/5 to-indigo-500/5",
          border: "border-b border-blue-500/20",
          text: "text-blue-600 dark:text-blue-400",
          icon: "text-blue-500 dark:text-blue-400",
          glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
          badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        };
      case "SALE":
        return {
          bg: "bg-gradient-to-r from-amber-500/5 via-orange-400/5 to-red-500/5",
          border: "border-b border-amber-500/20",
          text: "text-amber-600 dark:text-amber-400",
          icon: "text-amber-500 dark:text-amber-400",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        };
      case "ANNOUNCEMENT":
        return {
          bg: "bg-gradient-to-r from-emerald-500/5 via-teal-400/5 to-cyan-500/5",
          border: "border-b border-emerald-500/20",
          text: "text-emerald-600 dark:text-emerald-400",
          icon: "text-emerald-500 dark:text-emerald-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500/5 via-slate-500/5 to-zinc-500/5",
          border: "border-b border-gray-500/20",
          text: "text-gray-600 dark:text-gray-300",
          icon: "text-gray-500 dark:text-gray-400",
          glow: "shadow-[0_0_15px_rgba(107,114,128,0.15)] dark:shadow-[0_0_15px_rgba(209,213,219,0.15)]",
          badge: "bg-gray-500/10 text-gray-600 dark:text-gray-300"
        };
    }
  };

  const styles = getTypeStyles();
  
  // Select icon based on type
  const getIconComponent = () => {
    switch (type) {
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
        "relative overflow-hidden backdrop-blur-xl linear-glass rounded-2xl",
        styles.bg,
        styles.border,
        styles.glow,
        "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]",
        "after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Animated Content Area */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Pulsing Icon */}
            <div className="flex-shrink-0 relative">
              <motion.div
                className={cn("p-2 rounded-lg", styles.badge)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className={cn("h-4 w-4", styles.icon)} />
              </motion.div>
              <div className={cn("absolute inset-0 rounded-full", styles.icon, "bg-current/20 blur-sm animate-pulse")} />
            </div>
            
            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <motion.span 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    styles.text,
                    "px-2 py-1 rounded-full",
                    styles.badge
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {type.replace("_", " ")}
                </motion.span>
                <div className="w-1 h-1 rounded-full bg-current/40" />
                <motion.h3 
                  className="text-sm font-bold truncate text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {title}
                </motion.h3>
              </div>
              
              {/* Description */}
              <motion.p 
                className="text-xs text-muted-foreground mt-1 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {description}
              </motion.p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {linkUrl && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link 
                  href={linkUrl} 
                  target="_blank"
                  className={cn(
                    "text-xs font-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "bg-current/15 hover:bg-current/25 transition-all duration-300",
                    "border border-current/20 backdrop-blur-sm",
                    "hover:scale-105 hover:shadow-lg transform",
                    styles.text,
                    "flex-shrink-0"
                  )}
                >
                  {linkText || "LEARN MORE"}
                  <IconExternalLink className="w-3 h-3" />
                </Link>
              </motion.div>
            )}
            
            {onClose && (
              <motion.button 
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted/50 transition-all duration-200"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconX className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-full opacity-20">
        <motion.div 
          className="absolute top-1/4 right-4 w-2 h-2 rounded-full bg-current animate-pulse" 
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
          className="absolute top-3/4 right-8 w-1 h-1 rounded-full bg-current animate-pulse delay-1000" 
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
    </motion.div>
  );
}