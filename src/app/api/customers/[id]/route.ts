import { NextRequest, NextResponse } from "next/server"
import { CustomerService } from "@/lib/services/customer"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const customer = await CustomerService.getCustomerById(id)
        
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json(customer)
    } catch (error) {
        console.error("Error fetching customer:", error)
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
    }
}
