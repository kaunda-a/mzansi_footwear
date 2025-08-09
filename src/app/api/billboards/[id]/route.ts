import { NextRequest, NextResponse } from "next/server"
import { BillboardService } from "@/lib/services/billboard"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const billboard = await BillboardService.getBillboardById(params.id)
        
        if (!billboard) {
            return NextResponse.json({ error: "Billboard not found" }, { status: 404 })
        }

        return NextResponse.json(billboard)
    } catch (error) {
        console.error("Error fetching billboard:", error)
        return NextResponse.json({ error: "Failed to fetch billboard" }, { status: 500 })
    }
}
