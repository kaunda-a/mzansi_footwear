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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Set dimensions based on size prop
  const dimensions = size === "sm" ? 30 : 40;

  // Determine which logo to use
  // On server or before mounting, use default logo
  // On client, use logo based on resolved theme
  const logoSrc = !mounted || !resolvedTheme ? 
    "/logo-black.png" : 
    resolvedTheme === "dark" ? 
      "/logo-light.png" : 
      "/logo-black.png";

  return (
    <Image
      src={logoSrc}
      alt="Mzansi Footwear"
      width={dimensions}
      height={dimensions}
      className={className}
      priority={true}
    />
  );
}