import { NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orders"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const status = searchParams.get('status') || undefined
        const search = searchParams.get('search') || undefined
        const userId = searchParams.get('userId') || undefined

        const result = await OrderService.getOrders({
            page,
            limit,
            status: status as any,
            search,
            userId,
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}
