"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

interface ThemeLogoProps {
  size?: "sm" | undefined;
  className?: string;
}

export default function ThemeLogo({ size, className }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();
  
  // Determine which logo to use based on theme
  // Provide a default logo for server-side rendering
  const logoSrc = resolvedTheme === "dark" ? "/logo-white.svg" : resolvedTheme === "light" ? "/logo-black.svg" : "/logo-black.svg";

  return (
    <Image
      src={logoSrc}
      alt="Mzansi Footwear"
      width={size === "sm" ? 30 : 40}
      height={size === "sm" ? 30 : 40}
      className={className}
    />
  );
}