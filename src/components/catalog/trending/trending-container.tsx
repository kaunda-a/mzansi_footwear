import { Suspense } from "react";
import { TrendingContentClient } from "./trending-content-client";
import { TrendingProductCatalog } from "@/features/product/components/trending-product-catalog";

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
  return (
    <TrendingContentClient>
      <Suspense fallback={<div>Loading...</div>}>
        <TrendingProductCatalog
          searchParams={searchParams}
          showSort={true}
          showPagination={true}
          limit={12}
        />
      </Suspense>
    </TrendingContentClient>
  );
}
