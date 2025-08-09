import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get customer's order history with category data
        const orders = await db.order.findMany({
            where: { customerId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                category: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Calculate analytics
        const totalOrders = orders.length
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0)
        
        // Get recent purchases (last 5)
        const recentPurchases = orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(order => ({
                id: order.id,
                total: order.totalAmount.toNumber(),
                date: order.createdAt,
                status: order.status,
                itemCount: order.items.length
            }))

        // Calculate favorite categories
        const categoryCount: Record<string, number> = {}
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.product.category?.name || 'Uncategorized'
                categoryCount[category] = (categoryCount[category] || 0) + item.quantity
            })
        })
        
        const favoriteCategories = Object.entries(categoryCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        // Calculate spending trend (last 6 months)
        const now = new Date()
        const spendingTrend = []
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getMonth() === date.getMonth() && 
                       orderDate.getFullYear() === date.getFullYear()
            })
            
            spendingTrend.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                amount: monthOrders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0)
            })
        }

        return NextResponse.json({
            totalOrders,
            totalSpent,
            favoriteCategories,
            recentPurchases,
            spendingTrend
        })
    } catch (error) {
        console.error("Error fetching customer analytics:", error)
        return NextResponse.json({ error: "Failed to fetch customer analytics" }, { status: 500 })
    }
}
