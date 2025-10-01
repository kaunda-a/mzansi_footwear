"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IconHome,
  IconCategory,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import { useCartStore } from "@/lib/cart-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  color?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: IconHome,
      href: "/",
      color: "text-blue-500",
    },
    {
      id: "products",
      label: "Products",
      icon: IconCategory,
      href: "/products",
      color: "text-purple-500",
    },
    {
      id: "cart",
      label: "Cart",
      icon: IconShoppingCart,
      href: "/cart",
      badge: cartItemCount,
      color: "text-green-500",
    },
    {
      id: "account",
      label: session ? "Account" : "Sign In",
      icon: IconUser,
      href: session
        ? "/account"
        : `/auth/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
      color: "text-orange-500",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return null;
  }

  const hideNavbarPaths = ["/auth/sign-in", "/auth/sign-up"];
  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Modern floating container with enhanced glassmorphism */}
      <div className="mx-auto max-w-sm sm:max-w-md px-4 sm:px-6 pb-safe">
        <div className="relative mb-3">
          {/* Enhanced glassmorphism background with subtle gradient */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl border border-border/50 rounded-2xl shadow-2xl shadow-black/[0.08] dark:shadow-white/[0.02]" />
          
          {/* Subtle gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-background/10 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-primary/[0.03] rounded-2xl" />
          
          {/* Inner highlight for a polished look */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent rounded-t-2xl" />
          
          {/* Content container with padding */}
          <div className="relative px-3 py-3">
            <div className="flex items-center justify-between gap-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className="relative flex-1"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group",
                        "hover:bg-accent/40 active:bg-accent/60 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1",
                        "min-h-[64px] sm:min-h-[72px]",
                      )}
                      aria-label={item.label}
                    >
                      {/* Active background indicator with smooth animation */}
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                            className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20 shadow-sm"
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon container with enhanced hover effects */}
                      <div className="relative z-10 mb-1">
                        <motion.div
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          animate={active ? { scale: 1.08 } : { scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="relative"
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200",
                              active
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />

                          {/* Badge for cart items with smooth animation */}
                          <AnimatePresence>
                            {item.badge && item.badge > 0 && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 25,
                                }}
                                className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2"
                              >
                                <Badge
                                  variant="default"
                                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 flex items-center justify-center text-[9px] sm:text-[10px] font-bold border border-background/80 shadow-lg bg-primary text-primary-foreground"
                                >
                                  {item.badge > 99 ? "99+" : item.badge}
                                </Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      {/* Label with improved typography */}
                      <span
                        className={cn(
                          "text-[10px] sm:text-[11px] font-medium transition-all duration-200 text-center leading-tight max-w-full truncate px-1",
                          active
                            ? "text-primary font-semibold"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </span>

                      {/* Active indicator dot for better visual feedback */}
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
