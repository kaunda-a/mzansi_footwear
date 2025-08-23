import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Get trending categories (categories with most products and recent activity)
    const trendingCategories = await db.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: [
        {
          products: {
            _count: "desc",
          },
        },
        {
          updatedAt: "desc",
        },
      ],
      take: 12,
    });

    // Format the categories
    const formattedCategories = trendingCategories
      .filter((cat: any) => cat._count.products > 0)
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: cat._count.products,
      }));

    return NextResponse.json({
      categories: formattedCategories,
    });
  } catch (error) {
    console.error("Error fetching trending categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending categories" },
      { status: 500 },
    );
  }
}