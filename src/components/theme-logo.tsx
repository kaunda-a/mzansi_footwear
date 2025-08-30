"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

interface ThemeLogoProps {
  size?: "sm" | undefined;
  className?: string;
}

export default function ThemeLogo({ size, className }: ThemeLogoProps) {
  const { resolvedTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine which logo to use based on theme
  const logoSrc = React.useMemo(() => {
    // During SSR or before mounting, use a default
    if (!isMounted) {
      return "/logo-black.svg";
    }
    
    // Use resolvedTheme when available, fallback to theme
    const currentTheme = resolvedTheme || theme;
    
    if (currentTheme === "dark") {
      return "/logo-white.svg";
    } else if (currentTheme === "light") {
      return "/logo-black.svg";
    }
    
    // Default fallback
    return "/logo-black.svg";
  }, [resolvedTheme, theme, isMounted]);

  // Set dimensions based on size prop
  const dimensions = size === "sm" ? 30 : 40;

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div 
        className={className} 
        style={{ 
          width: dimensions, 
          height: dimensions,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="bg-gray-200 rounded-full animate-pulse" 
          style={{ width: dimensions, height: dimensions }}
        />
      </div>
    );
  }

  return (
    <Image
      src={logoSrc}
      alt="Mzansi Footwear"
      width={dimensions}
      height={dimensions}
      className={className}
      // Add priority for important logos to improve loading
      priority={true}
    />
  );
}