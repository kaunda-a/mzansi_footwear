"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconHome,
  IconInfoCircle,
  IconArticle,
  IconPhone,
  IconCookie,
  IconFileText,
  IconHelp,
  IconShieldLock,
  IconPackage,
  IconTruck,
  IconMenu2,
  IconX,
  IconUser,
  IconShoppingCart,
  IconCategory
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { motion } from "motion/react";

interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const primaryNavItems: NavItem[] = [
  { id: "home", title: "Home", url: "/", icon: IconHome },
  { id: "products", title: "Products", url: "/products", icon: IconCategory },
  { id: "about", title: "About Us", url: "/about", icon: IconInfoCircle },
  { id: "blog", title: "Blog", url: "/blog", icon: IconArticle },
  { id: "contact", title: "Contact", url: "/contact", icon: IconPhone },
];

const secondaryNavItems: NavItem[] = [
  { id: "faq", title: "FAQ", url: "/faq", icon: IconHelp },
  { id: "shipping", title: "Shipping", url: "/shipping", icon: IconTruck },
  { id: "returns", title: "Returns", url: "/returns", icon: IconPackage },
  { id: "privacy", title: "Privacy Policy", url: "/privacy", icon: IconShieldLock },
  { id: "cookies", title: "Cookies Policy", url: "/cookies", icon: IconCookie },
  { id: "terms", title: "Terms", url: "/terms", icon: IconFileText },
];

export function Navigation() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const { items } = useCartStore();
  
  // Hide navigation completely on desktop
  if (isMobile === false) {
    return null;
  }
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur-3xl shadow-2xl">
        <SidebarHeader className="border-b border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-primary/80 h-10 w-10 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold tracking-tight">Mzansi Footwear</h2>
              <p className="text-xs text-muted-foreground">Premium South African Footwear</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {primaryNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ x: 4 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={active} 
                          className={cn(
                            "rounded-xl px-3 py-2.5 my-0.5 transition-all duration-200",
                            active 
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                              : "hover:bg-accent/50"
                          )}
                        >
                          <Link href={item.url}>
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium">{item.title}</span>
                            {item.id === "cart" && cartItemCount > 0 && (
                              <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {cartItemCount > 99 ? "99+" : cartItemCount}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.03, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ x: 4 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={active} 
                          className={cn(
                            "rounded-xl px-3 py-2.5 my-0.5 transition-all duration-200",
                            active 
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          <Link href={item.url}>
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t border-border/50 p-4">
          <div className="flex items-center justify-between">
            {session ? (
              <Link href="/account" className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-accent transition-all duration-200 group">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <IconUser className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{session.user?.name || "Account"}</span>
                  <span className="text-xs text-muted-foreground truncate">View profile</span>
                </div>
              </Link>
            ) : (
              <Link href="/auth/sign-in" className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-accent transition-all duration-200 group">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <IconUser className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Sign In</span>
                  <span className="text-xs text-muted-foreground">Access account</span>
                </div>
              </Link>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <div className="flex items-center gap-2">
        <SidebarTrigger className="p-2 rounded-lg hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 group relative">
          {/* Raycast-inspired hamburger icon */}
          <div className="flex flex-col items-center justify-center w-5 h-5">
            <span className="block h-0.5 w-4 bg-foreground rounded-full transition-all duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:translate-y-1"></span>
            <span className="block h-0.5 w-4 bg-foreground rounded-full my-1 transition-all duration-200 group-data-[state=open]:opacity-0"></span>
            <span className="block h-0.5 w-4 bg-foreground rounded-full transition-all duration-200 group-data-[state=open]:-rotate-45 group-data-[state=open]:-translate-y-1"></span>
          </div>
        </SidebarTrigger>
      </div>
    </SidebarProvider>
  );
}