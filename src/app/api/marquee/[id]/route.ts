import { NextRequest, NextResponse } from "next/server"
import { MarqueeService } from "@/lib/services/marquee"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const message = await MarqueeService.getMessageById(params.id)
        
        if (!message) {
            return NextResponse.json({ error: "Marquee message not found" }, { status: 404 })
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error("Error fetching marquee message:", error)
        return NextResponse.json({ error: "Failed to fetch marquee message" }, { status: 500 })
    }
}
