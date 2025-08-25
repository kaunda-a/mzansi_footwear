"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarBillboard } from "@/components/catalog/billboard/sidebar-billboard";
import {
  IconUser,
  IconPackage,
  IconMapPin,
  IconCreditCard,
  IconHeart,
  IconStar,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "Account Overview",
    href: "/account",
    icon: IconUser,
    description: "Your account summary and activity",
  },
  {
    id: "orders",
    label: "Orders",
    href: "/account/orders",
    icon: IconPackage,
    description: "Track orders and view history",
  },
  {
    id: "addresses",
    label: "Addresses",
    href: "/account/addresses",
    icon: IconMapPin,
    description: "Manage shipping addresses",
  },
  {
    id: "payment-methods",
    label: "Payment Methods",
    href: "/account/payment-methods",
    icon: IconCreditCard,
    description: "Manage cards and payment options",
  },
  {
    id: "profile",
    label: "Profile",
    href: "/account/profile",
    icon: IconSettings,
    description: "Personal information and preferences",
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (href: string) => {
    if (href === "/account") {
      return pathname === "/account";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-full md:w-80 space-y-4">
      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || ""}
              />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {session?.user?.name || "User"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {session?.user?.email}
              </p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <IconStar className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                <span>Premium Member</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <Card>
        <CardContent className="p-0">
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <div key={item.id}>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                        active && "bg-primary/5 border-r-2 border-primary",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "text-sm font-medium",
                              active ? "text-primary" : "text-foreground",
                            )}
                          >
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <IconChevronRight
                        className={cn(
                          "h-4 w-4 transition-colors",
                          active ? "text-primary" : "text-muted-foreground/50",
                        )}
                      />
                    </div>
                  </Link>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Sign Out Card */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <IconLogout className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="text-sm font-medium">Need Help?</h4>
            <p className="text-xs text-muted-foreground">
              Contact our customer support team
            </p>
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              Get Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Billboard */}
      <div className="mt-4">
        <SidebarBillboard />
      </div>
    </div>
  );
}
