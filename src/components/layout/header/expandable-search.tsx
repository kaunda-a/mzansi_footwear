"use client";

import { useState, useRef, useEffect } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import SearchInput from "@/components/search-input";
import { cn } from "@/lib/utils";

interface ExpandableSearchProps {
  className?: string;
}

export function ExpandableSearch({ className }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus the input when expanded
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  const handleClear = () => {
    setIsExpanded(false);
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="relative flex items-center">
              <div className="w-48 sm:w-64 mr-2">
                <SearchInput />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Close search"
              >
                <IconX className="h-5 w-5 text-foreground" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearchIconClick}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open search"
          >
            <IconSearch className="h-5 w-5 text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}