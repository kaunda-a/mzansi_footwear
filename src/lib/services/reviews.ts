import { db } from "@/lib/prisma";
import type { Review } from "@prisma/client";

export type ReviewWithCustomer = Review & {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
};

export class ReviewService {
  static async getReviewsByProductId(productId: string, page: number = 1, limit: number = 10, sort: string = "newest") {
    const skip = (page - 1) * limit;
    
    const orderBy: any = (() => {
      switch (sort) {
        case "oldest":
          return { createdAt: "asc" };
        case "highest":
          return { rating: "desc" };
        case "lowest":
          return { rating: "asc" };
        case "helpful":
          // For now, we'll sort by createdAt since helpful fields don't exist yet
          return { createdAt: "desc" };
        case "newest":
        default:
          return { createdAt: "desc" };
      }
    })();

    try {
      const [reviews, total] = await Promise.all([
        db.review.findMany({
          where: {
            productId,
            isApproved: true,
          },
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        db.review.count({
          where: {
            productId,
            isApproved: true,
          },
        }),
      ]);

      // Calculate review statistics
      const allReviews = await db.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
      });

      const totalReviews = allReviews.length;
      const averageRating = totalReviews > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      const ratingDistribution = allReviews.reduce((acc, review) => {
        const rating = review.rating;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        reviews: reviews.map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title || "",
          content: review.comment || "",
          customerName: `${review.customer.firstName || ""} ${review.customer.lastName || ""}`.trim() || "Anonymous",
          customerAvatar: review.customer.imageUrl || null,
          createdAt: review.createdAt.toISOString(),
          verified: review.isVerified,
          helpful: 0, // Placeholder since field doesn't exist yet
          notHelpful: 0, // Placeholder since field doesn't exist yet
        })),
        stats: {
          averageRating,
          totalReviews,
          ratingDistribution,
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return {
        reviews: [],
        stats: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {},
        },
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0,
        },
      };
    }
  }

  static async createReview(data: {
    customerId: string;
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
    isVerified?: boolean;
  }) {
    try {
      // Check if customer already reviewed this product
      const existingReview = await db.review.findUnique({
        where: {
          customerId_productId: {
            customerId: data.customerId,
            productId: data.productId,
          },
        },
      });

      if (existingReview) {
        throw new Error("Customer has already reviewed this product");
      }

      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const review = await db.review.create({
        data: {
          customerId: data.customerId,
          productId: data.productId,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          isVerified: data.isVerified || false,
          isApproved: true, // Auto-approve for now, could be changed for moderation
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
      });

      return {
        id: review.id,
        rating: review.rating,
        title: review.title || "",
        content: review.comment || "",
        customerName: `${review.customer.firstName || ""} ${review.customer.lastName || ""}`.trim() || "Anonymous",
        customerAvatar: review.customer.imageUrl || null,
        createdAt: review.createdAt.toISOString(),
        verified: review.isVerified,
        helpful: 0, // Placeholder since field doesn't exist yet
        notHelpful: 0, // Placeholder since field doesn't exist yet
      };
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  static async updateHelpfulness(reviewId: string, helpful: boolean) {
    // For now, we'll return placeholder values since the fields don't exist yet
    return {
      helpful: 0,
      notHelpful: 0,
    };
  }
}