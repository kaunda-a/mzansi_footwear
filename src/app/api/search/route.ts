import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        products: [],
        total: 0,
        message: "Search query must be at least 2 characters",
      });
    }

    const searchTerm = query.trim();

    // Search products with full-text search capabilities
    const [products, total] = await Promise.all([
      db.product.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  brand: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  tags: {
                    hasSome: [searchTerm],
                  },
                },
              ],
            },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
            },
            take: 1,
          },
          variants: {
            select: {
              id: true,
              price: true,
              comparePrice: true,
              stock: true,
            },
            where: {
              isActive: true,
            },
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),

      db.product.count({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  brand: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  tags: {
                    hasSome: [searchTerm],
                  },
                },
              ],
            },
          ],
        },
      }),
    ]);

    // Transform products for response
    const transformedProducts = products.map((product) => {
      const minPrice =
        product.variants.length > 0
          ? Math.min(...product.variants.map((v) => Number(v.price)))
          : 0;
      const comparePrice =
        product.variants.length > 0
          ? Math.min(
              ...product.variants
                .filter((v) => v.comparePrice)
                .map((v) => Number(v.comparePrice)),
            )
          : null;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: minPrice,
        compareAtPrice: comparePrice,
        image: product.images[0]?.url || null,
        imageAlt: product.images[0]?.altText || product.name,
        category: product.category,
        brand: product.brand,
        isFeatured: product.isFeatured,
        isOnSale: comparePrice ? minPrice < comparePrice : false,
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      total,
      query: searchTerm,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        products: [],
        total: 0,
      },
      { status: 500 },
    );
  }
}
