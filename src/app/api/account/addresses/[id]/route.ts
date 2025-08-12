import { NextRequest, NextResponse } from "next/server"
import { CustomerService } from "@/lib/services/customer"
import { auth } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const updated = await CustomerService.updateAddress(id, body)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating customer address:", error)
    return NextResponse.json({ error: "Failed to update customer address" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    await CustomerService.deleteAddress(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer address:", error)
    return NextResponse.json({ error: "Failed to delete customer address" }, { status: 500 })
  }
}


