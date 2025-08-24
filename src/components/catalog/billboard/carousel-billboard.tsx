"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BillboardWithCreator } from "@/lib/services";

export interface BillboardSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface CarouselBillboardProps {
  billboards: BillboardWithCreator[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  className?: string;
}

export function CarouselBillboard({
  billboards,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  height = "h-64 md:h-80 lg:h-96",
  className,
}: CarouselBillboardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || billboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % billboards.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, billboards.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + billboards.length) % billboards.length,
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % billboards.length);
  };

  if (!billboards.length) return null;

  return (
    <div
      className={`relative w-full ${height} overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {billboards.map((billboard, index) => (
          <div
            key={billboard.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            {/* Background Image */}
            {billboard.imageUrl && (
              <div className="absolute inset-0">
                <Image
                  src={billboard.imageUrl}
                  alt={billboard.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center h-full">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {billboard.type.replace("_", " ").toLowerCase()}
                    </Badge>
                    {billboard.endDate && (
                      <Badge
                        variant="outline"
                        className="text-xs text-white border-white/50"
                      >
                        Expires{" "}
                        {new Date(billboard.endDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up animation-delay-100">
                    {billboard.title}
                  </h1>

                  {billboard.description && (
                    <p className="text-sm md:text-lg text-white/90 mb-6 animate-fade-in-up animation-delay-200 line-clamp-2">
                      {billboard.description}
                    </p>
                  )}

                  {billboard.linkUrl && (
                    <div className="animate-fade-in-up animation-delay-300">
                      <Button
                        asChild
                        size="lg"
                        className="font-semibold bg-white text-black hover:bg-white/90"
                      >
                        <a
                          href={billboard.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {billboard.linkText || "Learn More"}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && billboards.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && billboards.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {billboards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && !isHovered && billboards.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / billboards.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Default slides for demo
export const defaultSlides: BillboardSlide[] = [
  {
    id: "1",
    title: "Step Into Style",
    subtitle: "New Collection",
    description:
      "Discover our latest footwear collection with premium quality and unmatched comfort.",
    imageUrl: "/images/hero-1.jpg",
    ctaText: "Shop Now",
    ctaLink: "/products",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "white",
  },
  {
    id: "2",
    title: "Summer Sale",
    subtitle: "Up to 50% Off",
    description:
      "Get amazing deals on your favorite brands. Limited time offer!",
    imageUrl: "/images/hero-2.jpg",
    ctaText: "View Sale",
    ctaLink: "/products?sale=true",
    backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    textColor: "white",
  },
  {
    id: "3",
    title: "Premium Sneakers",
    subtitle: "Athletic Performance",
    description:
      "Professional-grade sneakers for athletes and fitness enthusiasts.",
    imageUrl: "/images/hero-3.jpg",
    ctaText: "Explore",
    ctaLink: "/products?category=sneakers",
    backgroundColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    textColor: "white",
  },
];

// CSS for animations (add to your global CSS)
export const carouselAnimations = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}
`;
