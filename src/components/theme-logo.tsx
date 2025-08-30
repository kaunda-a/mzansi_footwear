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

  // Render nothing on the server, and only render on the client after mounting
  // This prevents hydration mismatches
  if (!mounted) {
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

  // Determine which logo to use based on theme
  // Only determine this on the client side to avoid hydration mismatches
  let logoSrc: string;
  if (resolvedTheme === "dark") {
    logoSrc = "/logo-white.svg";
  } else {
    // Default to black logo for light theme or any other case
    logoSrc = "/logo-black.svg";
  }

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