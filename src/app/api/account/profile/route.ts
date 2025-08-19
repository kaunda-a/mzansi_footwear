import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/services/customer";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await CustomerService.getCustomerById(session.user.id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updatedCustomer = await CustomerService.updateCustomer(
      session.user.id,
      body,
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Failed to update customer profile" },
        { status: 400 },
      );
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json(
      { error: "Failed to update customer profile" },
      { status: 500 },
    );
  }
}
