import { NextRequest, NextResponse } from "next/server";
import { MarqueeService } from "@/lib/services/marquee";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const message = await MarqueeService.getMessageById(id);

    if (!message) {
      return NextResponse.json(
        { error: "Marquee message not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error fetching marquee message:", error);
    return NextResponse.json(
      { error: "Failed to fetch marquee message" },
      { status: 500 },
    );
  }
}
