import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("category") || undefined;
    const brandId = searchParams.get("brand") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const isFeatured = searchParams.get("featured") === "true";

    const filters = {
      isActive: true,
      status: "ACTIVE" as const,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      isFeatured: isFeatured ? true : undefined,
    };

    const sortConfig = (() => {
      switch (sort) {
        case "oldest":
          return { field: "createdAt" as const, direction: "asc" as const };
        case "price-low-high":
          return { field: "price" as const, direction: "asc" as const };
        case "price-high-low":
          return { field: "price" as const, direction: "desc" as const };
        case "name-a-z":
          return { field: "name" as const, direction: "asc" as const };
        case "name-z-a":
          return { field: "name" as const, direction: "desc" as const };
        case "newest":
        default:
          return { field: "createdAt" as const, direction: "desc" as const };
      }
    })();

    const result = await ProductService.getProducts({
      filters,
      sort: sortConfig,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
