"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IconHome,
  IconCategory,
  IconShoppingCart,
  IconUser,
  IconHeart,
  IconPackage,
  IconSearch,
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
      {/* Linear/Raycast-inspired floating container */}
      <div className="mx-auto max-w-sm sm:max-w-md px-4 sm:px-6 pb-safe">
        <div className="relative mb-2">
          {/* Enhanced glassmorphism background */}
          <div className="absolute inset-0 bg-background/98 backdrop-blur-3xl border border-border/50 rounded-2xl shadow-2xl shadow-black/[0.08] dark:shadow-white/[0.02]" />

          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/20 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02] rounded-2xl" />

          {/* Inner highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

          {/* Content container */}
          <div className="relative px-2 py-2">
            <div className="flex items-center justify-between gap-0.5">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.04,
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className="relative flex-1"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition-all duration-200 group",
                        "hover:bg-accent/40 active:bg-accent/60 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1",
                        "min-h-[60px] sm:min-h-[68px]",
                      )}
                      aria-label={item.label}
                    >
                      {/* Active background indicator */}
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
                            className="absolute inset-0 bg-primary/12 rounded-xl border border-primary/25 shadow-inner"
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon container */}
                      <div className="relative z-10 mb-1">
                        <motion.div
                          whileHover={{ scale: 1.08, y: -1 }}
                          whileTap={{ scale: 0.92 }}
                          animate={active ? { scale: 1.05 } : { scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="relative"
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200",
                              active
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />

                          {/* Badge for cart items */}
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
                                className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5"
                              >
                                <Badge
                                  variant="destructive"
                                  className="h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[8px] sm:text-[9px] font-bold border border-background/60 shadow-lg"
                                >
                                  {item.badge > 99 ? "99+" : item.badge}
                                </Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      {/* Label */}
                      <span
                        className={cn(
                          "text-[9px] sm:text-[10px] font-medium transition-colors duration-200 text-center leading-tight max-w-full truncate px-1",
                          active
                            ? "text-primary font-semibold"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </span>

                      {/* Active indicator line */}
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
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
