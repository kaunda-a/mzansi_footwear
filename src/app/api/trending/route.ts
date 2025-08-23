import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const size = searchParams.get("size") || undefined;
    const color = searchParams.get("color") || undefined;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      status: "ACTIVE",
    };

    if (category) where.categoryId = category;
    if (brand) where.brandId = brand;

    // Size and color filtering (based on variants)
    if (size || color) {
      where.variants = {
        some: {
          ...(size && { size }),
          ...(color && { color }),
        },
      };
    }

    // Price filtering (based on variants)
    if (minPrice || maxPrice) {
      const existingVariantsFilter = where.variants?.some || {};
      where.variants = {
        some: {
          ...existingVariantsFilter,
          price: {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          },
        },
      };
    }

    // For trending products, we'll order by reviewCount and createdAt
    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [
      { reviewCount: "desc" },
      { createdAt: "desc" }
    ];

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          variants: {
            orderBy: { price: "asc" },
            take: 1, // Get cheapest variant for display
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
          _count: {
            select: { reviews: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    const formattedProducts = products.map((product: any) => {
      const reviews = product.reviews || [];
      const averageRating =
        reviews.length > 0
          ? reviews.reduce(
              (sum: number, review: any) => sum + review.rating,
              0,
            ) / reviews.length
          : 0;

      return {
        ...product,
        variants: product.variants.map((variant: any) => ({
          ...variant,
          price: variant.price,
          comparePrice: variant.comparePrice,
          costPrice: variant.costPrice,
          weight: variant.weight,
        })),
        averageRating,
        reviewCount: product._count.reviews,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 },
    );
  }
}