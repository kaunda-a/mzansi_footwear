import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/services/orders";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AddressType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const userId = searchParams.get("userId") || undefined;

    const result = await OrderService.getOrders({
      page,
      limit,
      filters: {
        status: status as any,
        search,
        customerId: userId,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["items", "totalAmount", "customer", "shippingAddress"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Items must be a non-empty array" },
        { status: 400 },
      );
    }

    // Validate each item
    for (const item of body.items) {
      const itemRequiredFields = ["productId", "variantId", "quantity", "unitPrice"];
      for (const field of itemRequiredFields) {
        if (!item[field]) {
          return NextResponse.json(
            { error: `Missing required field in item: ${field}` },
            { status: 400 },
          );
        }
      }
    }

    // Validate customer data
    const customerRequiredFields = ["firstName", "lastName", "email", "phone"];
    for (const field of customerRequiredFields) {
      if (!body.customer[field]) {
        return NextResponse.json(
          { error: `Missing required customer field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate shipping address
    const shippingRequiredFields = ["street", "city", "province", "postalCode"];
    for (const field of shippingRequiredFields) {
      if (!body.shippingAddress[field]) {
        return NextResponse.json(
          { error: `Missing required shipping address field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create the order in the database
    // First create the addresses
    const [shippingAddress, billingAddress] = await Promise.all([
      db.address.create({
        data: {
          firstName: body.customer.firstName,
          lastName: body.customer.lastName,
          phone: body.customer.phone,
          addressLine1: body.shippingAddress.street,
          city: body.shippingAddress.city,
          province: body.shippingAddress.province,
          postalCode: body.shippingAddress.postalCode,
          country: body.shippingAddress.country || "South Africa",
          type: "SHIPPING" as AddressType,
          customer: {
            connect: { id: session.user.id }
          }
        }
      }),
      body.billingAddress ? 
        db.address.create({
          data: {
            firstName: body.billingAddress.firstName || body.customer.firstName,
            lastName: body.billingAddress.lastName || body.customer.lastName,
            phone: body.billingAddress.phone || body.customer.phone,
            addressLine1: body.billingAddress.street,
            city: body.billingAddress.city,
            province: body.billingAddress.province,
            postalCode: body.billingAddress.postalCode,
            country: body.billingAddress.country || "South Africa",
            type: "BILLING" as AddressType,
            customer: {
              connect: { id: session.user.id }
            }
          }
        }) :
        db.address.create({
          data: {
            firstName: body.customer.firstName,
            lastName: body.customer.lastName,
            phone: body.customer.phone,
            addressLine1: body.shippingAddress.street,
            city: body.shippingAddress.city,
            province: body.shippingAddress.province,
            postalCode: body.shippingAddress.postalCode,
            country: body.shippingAddress.country || "South Africa",
            type: "BOTH" as AddressType,
            customer: {
              connect: { id: session.user.id }
            }
          }
        })
    ]);

    // Then create the order with the address IDs
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: session.user.id,
        totalAmount: parseFloat(body.totalAmount),
        subtotal: parseFloat(body.totalAmount), // For now, we'll use totalAmount as subtotal
        taxAmount: 0, // We'll calculate this properly later
        shippingAmount: 0, // We'll calculate this properly later
        status: "PENDING",
        paymentStatus: "PENDING",
        shippingStatus: "PENDING",
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            productVariantId: item.variantId,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.unitPrice) * item.quantity,
          }))
        },
        customerNotes: body.notes || "",
      },
      include: {
        customer: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  select: { url: true },
                  take: 1,
                },
              },
            },
            productVariant: {
              select: {
                size: true,
                color: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: (error as Error).message },
      { status: 500 },
    );
  }
}