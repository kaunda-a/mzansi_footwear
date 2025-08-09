import { NextRequest, NextResponse } from "next/server"
import { MarqueeService } from "@/lib/services/marquee"

export async function GET(request: NextRequest) {
    try {
        const messages = await MarqueeService.getActiveMessages()
        return NextResponse.json(messages)
    } catch (error) {
        console.error("Error fetching marquee messages:", error)
        return NextResponse.json({ error: "Failed to fetch marquee messages" }, { status: 500 })
    }
}
