import { TrendingProductsClient } from "./trending-products-client";
import { Api } from "@/lib/api";

interface ProductData {
  products: any[];
  pagination: {
    total: number;
    pages: number;
  };
}

export async function TrendingProducts() {
  try {
    // Fetch trending products on the server
    const { products, pagination } = await Api.getProducts({
      page: 1,
      limit: 8,
      sort: "trending",
    });

    const productData: ProductData = {
      products: products || [],
      pagination: {
        total: pagination.total,
        pages: pagination.pages,
      },
    };

    return <TrendingProductsClient productData={productData} />;
  } catch (error) {
    console.error("Error loading trending products:", error);
    // Return client component with empty data as fallback
    return <TrendingProductsClient productData={null} />;
  }
}