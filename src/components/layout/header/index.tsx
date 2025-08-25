"use client";

import React from "react";
import { Separator } from "../../ui/separator";
import SearchInput from "../../search-input";
import { ThemeSelector } from "../../theme-selector";
import { ModeToggle } from "../ThemeToggle/theme-toggle";
import { ModalBillboard } from "@/components/catalog/billboard/modal-billboard";
import { motion } from "motion/react";
import Link from "next/link";

export function Header() {
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
                  <img
                    src="/logo.svg"
                    alt="Mzansi Footwear Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Mzansi Footwear
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ModeToggle />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeSelector />
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
      
      {/* Modal Billboard */}
      <ModalBillboard />
    </motion.header>
  );
}

export default Header;
