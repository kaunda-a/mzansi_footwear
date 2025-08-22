import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/lib/services/reviews";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest, props: { params: Promise<{ reviewId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { reviewId } = params;
    const { helpful } = await request.json();

    const result = await ReviewService.updateHelpfulness(reviewId, helpful);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error updating review helpfulness:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update review helpfulness" },
      { status: 500 },
    );
  }
}