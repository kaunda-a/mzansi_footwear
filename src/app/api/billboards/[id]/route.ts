import { NextRequest, NextResponse } from "next/server"
import { BillboardService } from "@/lib/services/billboard"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const billboard = await BillboardService.getBillboardById(id)
        
        if (!billboard) {
            return NextResponse.json({ error: "Billboard not found" }, { status: 404 })
        }

        return NextResponse.json(billboard)
    } catch (error) {
        console.error("Error fetching billboard:", error)
        return NextResponse.json({ error: "Failed to fetch billboard" }, { status: 500 })
    }
}
