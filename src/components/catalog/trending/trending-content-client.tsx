'use client';

import { TrendingSection } from "./trending-section";

interface TrendingContentClientProps {
  children: React.ReactNode;
}

export function TrendingContentClient({ children }: TrendingContentClientProps) {
  return (
    <TrendingSection>
      {children}
    </TrendingSection>
  );
}