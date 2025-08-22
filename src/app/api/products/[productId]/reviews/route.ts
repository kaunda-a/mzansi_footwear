import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/lib/services/reviews";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "newest";

    const result = await ReviewService.getReviewsByProductId(
      params.productId,
      page,
      limit,
      sort
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.rating) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 },
      );
    }

    const reviewData = {
      customerId: session.user.id,
      productId: params.productId,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      isVerified: false, // This would need to be set based on order history
    };

    const review = await ReviewService.createReview(reviewData);

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Error creating review:", error);
    if (error.message === "Customer has already reviewed this product") {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 },
    );
  }
}