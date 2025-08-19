import { NextRequest, NextResponse } from "next/server";
import { MarqueeService } from "@/lib/services/marquee";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await MarqueeService.getAllMessages({
      page,
      limit,
      type: type as any,
    });

    // Apply search filter if provided
    let filteredMessages = result.messages;
    if (search) {
      filteredMessages = result.messages.filter(
        (message) =>
          message.title.toLowerCase().includes(search.toLowerCase()) ||
          message.message.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return NextResponse.json({
      messages: filteredMessages,
      pagination: {
        page,
        limit,
        total: filteredMessages.length,
        pages: Math.ceil(filteredMessages.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching marquee messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch marquee messages" },
      { status: 500 },
    );
  }
}
