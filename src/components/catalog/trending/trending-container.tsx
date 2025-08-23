import { TrendingContentClient } from "./trending-content-client";

interface TrendingContainerProps {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    size?: string;
    color?: string;
  };
}

export function TrendingContainer({ searchParams }: TrendingContainerProps) {
  return <TrendingContentClient searchParams={searchParams} />;
}
