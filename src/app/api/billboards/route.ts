import { NextRequest, NextResponse } from "next/server"
import { BillboardService } from "@/lib/services/billboard"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const search = searchParams.get('search') || undefined
        const position = searchParams.get('position') || undefined

        const result = await BillboardService.getAllBillboards({
            page,
            limit,
            position: position as any,
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching billboards:", error)
        return NextResponse.json({ error: "Failed to fetch billboards" }, { status: 500 })
    }
}
