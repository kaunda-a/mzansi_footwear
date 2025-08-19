"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbItem {
  title: string;
  link: string;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always include home
    breadcrumbs.push({
      title: "Home",
      link: "/",
    });

    // Build breadcrumbs from path segments
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable title
      let title = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Handle special cases
      switch (segment) {
        case "products":
          title = "Products";
          break;
        case "cart":
          title = "Shopping Cart";
          break;
        case "checkout":
          title = "Checkout";
          break;
        case "account":
          title = "My Account";
          break;
        case "orders":
          title = "Orders";
          break;
        case "billboards":
          title = "Promotions";
          break;
        case "marquee":
          title = "Messages";
          break;
        case "auth":
          title = "Authentication";
          break;
        default:
          // For dynamic routes, keep the segment as is but capitalize
          title = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      breadcrumbs.push({
        title,
        link: currentPath,
      });
    });

    return breadcrumbs;
  }, [pathname]);
}
