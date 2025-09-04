"use client";

import Image from "next/image";
import React from "react";

interface ThemeLogoProps {
  size?: "sm" | undefined;
  className?: string;
}

export default function ThemeLogo({ size, className }: ThemeLogoProps) {
  // Set dimensions based on size prop
  const dimensions = size === "sm" ? 30 : 40;

  // Use logo.jpg as the default and only logo
  const logoSrc = "/logo.jpg";

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