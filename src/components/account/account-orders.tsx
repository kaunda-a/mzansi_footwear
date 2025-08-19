"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Search,
  Filter,
  Eye,
  Download,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Star,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/format";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: any;
  billingAddress?: any;
  trackingNumber?: string | null;
  shippedAt?: Date | string | null;
  deliveredAt?: Date | string | null;
  payments?: any[];
}

const statusConfig = {
  PENDING: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
  CONFIRMED: { color: "bg-blue-500", icon: CheckCircle, label: "Confirmed" },
  PROCESSING: { color: "bg-blue-500", icon: Package, label: "Processing" },
  SHIPPED: { color: "bg-purple-500", icon: Truck, label: "Shipped" },
  DELIVERED: { color: "bg-green-500", icon: CheckCircle, label: "Delivered" },
  CANCELLED: { color: "bg-red-500", icon: XCircle, label: "Cancelled" },
  REFUNDED: { color: "bg-orange-500", icon: RotateCcw, label: "Refunded" },
};

export function AccountOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (session?.user?.email) {
          const response = await Api.getOrders({ userId: session.user.id });
          setOrders(
            response.orders.map((order) => ({
              ...order,
              totalAmount: order.totalAmount.toNumber(),
              items: order.items.map((item) => ({
                id: item.id,
                name: item.product.name,
                image:
                  item.product.images[0]?.url || "/placeholder-product.jpg", // Provide a fallback image
                price: item.unitPrice.toNumber(),
                quantity: item.quantity,
                size: item.productVariant?.size,
                color: item.productVariant?.color,
              })),
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "date-asc":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "total-desc":
        return Number(b.totalAmount) - Number(a.totalAmount);
      case "total-asc":
        return Number(a.totalAmount) - Number(b.totalAmount);
      default:
        return 0;
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading orders...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Orders Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Orders
              </CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {orders.length} Total Orders
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="total-desc">Highest Amount</SelectItem>
                <SelectItem value="total-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't placed any orders yet"}
              </p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <Card key={order.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">
                          Order {order.orderNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${statusConfig[order.status].color} text-white`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Shipping Address</p>
                      <p className="font-medium">
                        {order.shippingAddress
                          ? `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Status</p>
                      <p className="font-medium">
                        {order.payments && order.payments[0]
                          ? order.payments[0].status
                          : "—"}
                      </p>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <p className="text-muted-foreground">Tracking Number</p>
                        <p className="font-medium font-mono">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Track Package
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Coming soon"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Invoice
                    </Button>
                    {order.status === "DELIVERED" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Write Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Return Items
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
