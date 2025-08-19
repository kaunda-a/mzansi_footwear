import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/services/customer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;

    const result = await CustomerService.getCustomers({
      page,
      limit,
      search,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
