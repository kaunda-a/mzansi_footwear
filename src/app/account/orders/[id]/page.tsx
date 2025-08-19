import Image from "next/image";
import Link from "next/link";
import { Api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { AccountLayout } from "@/components/account/account-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  Calendar,
  Hash,
  MapPin,
  CreditCard,
  Download,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; Icon: any }> = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-500 text-white",
      Icon: Clock,
    },
    CONFIRMED: {
      label: "Confirmed",
      className: "bg-blue-500 text-white",
      Icon: CheckCircle,
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-500 text-white",
      Icon: Package,
    },
    SHIPPED: {
      label: "Shipped",
      className: "bg-purple-500 text-white",
      Icon: Truck,
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-green-500 text-white",
      Icon: CheckCircle,
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-500 text-white",
      Icon: XCircle,
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-orange-500 text-white",
      Icon: Receipt,
    },
  };
  const cfg = map[status] || map.PENDING;
  const Icon = cfg.Icon;
  return (
    <Badge className={`${cfg.className} font-medium`}>
      <Icon className="h-3 w-3 mr-1" /> {cfg.label}
    </Badge>
  );
}

export default async function OrderDetailPage({ params }: any) {
  const order = await Api.getOrderById(params.id);

  if (!order) {
    return (
      <AccountLayout
        title="Order Not Found"
        breadcrumbs={[
          { label: "Orders", href: "/account/orders" },
          { label: "Not Found" },
        ]}
      >
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              We couldn't find that order
            </h2>
            <p className="text-muted-foreground mb-6">
              It may have been removed or the link is incorrect.
            </p>
            <Button asChild>
              <Link href="/account/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </AccountLayout>
    );
  }

  const breadcrumbs = [
    { label: "Orders", href: "/account/orders" },
    { label: `Order ${order.orderNumber}` },
  ];

  const payment = order.payments && order.payments[0];

  return (
    <AccountLayout
      title={`Order ${order.orderNumber}`}
      description="Detailed view of your order"
      breadcrumbs={breadcrumbs}
    >
      {/* Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center">
                    <Hash className="h-4 w-4 mr-1" />
                    {order.orderNumber}
                  </span>
                  <span className="inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item: any) => {
                  const image =
                    item.product?.images?.[0]?.url ||
                    "/placeholder-product.jpg";
                  const name = item.product?.name || item.name;
                  const size = item.productVariant?.size || item.size;
                  const color = item.productVariant?.color || item.color;
                  const price =
                    item.totalPrice?.toNumber?.() || item.price || 0;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{name}</h4>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(price)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          {size && <span>Size: {size}</span>}
                          {color && <span>Color: {color}</span>}
                          {item.productVariant?.sku && (
                            <span>SKU: {item.productVariant.sku}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Totals */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex justify-between w-full md:w-1/2 text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>
                    {formatPrice(
                      order.items.reduce(
                        (sum: number, it: any) =>
                          sum + (it.totalPrice?.toNumber?.() || it.price || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between w-full md:w-1/2 text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between w-full md:w-1/2 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount.toNumber())}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meta */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {order.shippingAddress ? (
                <div className="space-y-1">
                  <div className="font-medium text-foreground">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </div>
                  <div>{order.shippingAddress.addressLine1}</div>
                  {order.shippingAddress.addressLine2 && (
                    <div>{order.shippingAddress.addressLine2}</div>
                  )}
                  <div>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.province}{" "}
                    {order.shippingAddress.postalCode}
                  </div>
                  <div>{order.shippingAddress.country}</div>
                  {order.shippingAddress.phone && (
                    <div>{order.shippingAddress.phone}</div>
                  )}
                </div>
              ) : (
                <div>—</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">
                  {payment ? payment.status : "—"}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-muted-foreground">Method</div>
                <div className="font-medium">
                  {payment ? payment.method : "—"}
                </div>
              </div>
              <Button className="mt-4 w-full" variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" /> Download Invoice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4" /> Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {order.trackingNumber ? (
                <div className="flex items-center justify-between">
                  <div className="font-mono">{order.trackingNumber}</div>
                  <Button variant="outline" disabled>
                    Track Package
                  </Button>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No tracking info yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    </AccountLayout>
  );
}
