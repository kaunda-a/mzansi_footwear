import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/services/customer";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await CustomerService.getCustomerAddresses(
      session.user.id,
    );

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching customer addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer addresses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newAddress = await CustomerService.createAddress({
      ...body,
      customerId: session.user.id,
    });

    if (!newAddress) {
      return NextResponse.json(
        { error: "Failed to create address" },
        { status: 400 },
      );
    }

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("Error creating customer address:", error);
    return NextResponse.json(
      { error: "Failed to create customer address" },
      { status: 500 },
    );
  }
}
