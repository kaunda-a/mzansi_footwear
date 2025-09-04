"use client";

import React from "react";
import { Separator } from "../../ui/separator";
import SearchInput from "../../search-input";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import ThemeLogo from "@/components/theme-logo";
import Logo from "@/components/logo";
import { IconShoppingCart } from "@tabler/icons-react";
import { useCartStore } from "@/lib/cart-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Header() {
  const { items } = useCartStore();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="sticky top-0 z-40 flex flex-col gap-3 transition-all duration-200 border-b border-border/40 bg-background/95 backdrop-blur-xl"
    >
      {/* Enhanced glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background/95 backdrop-blur-xl" />

      {/* Content container */}
      <div className="relative">
        {/* Top row with breadcrumbs and controls */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Separator orientation="vertical" className="h-5 bg-border/60" />
            <div className="min-w-0 flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link href="/" className="flex items-center gap-2">
                  <ThemeLogo className="h-8 w-auto" />
                  <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Mzansi Footwear
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/cart" 
                className="relative p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Shopping cart"
              >
                <IconShoppingCart className="h-5 w-5 text-foreground" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[8px] font-bold border border-background/60 shadow-lg"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Enhanced search bar section */}
        <div className="px-4 sm:px-6 pb-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="relative"
          >
            <SearchInput />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;