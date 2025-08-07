/**
 * Client-safe type definitions that mirror Prisma types
 * but are safe for use in client components without server dependencies
 */

// Import and re-export safe enum types (these are just strings/numbers, no server dependencies)
import type {
  UserRole,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  AddressType,
  AnalyticsEventType,
  MarqueeType,
  BillboardType,
  BillboardPosition,
  PaymentMethod
} from '@prisma/client'

export {
  UserRole,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  AddressType,
  AnalyticsEventType,
  MarqueeType,
  BillboardType,
  BillboardPosition,
  PaymentMethod
}

// Client-safe base types with proper serialization
export interface ClientUser {
  id: string
  email: string
  emailVerified: string | null // Date serialized as string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  role: UserRole
  createdAt: string // Date serialized as string
  updatedAt: string // Date serialized as string
}

export interface ClientCustomer {
  id: string
  email: string
  emailVerified: string | null
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  image: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

// Client-safe MarqueeMessage type
export interface ClientMarqueeMessage {
  id: string
  title: string
  message: string
  type: MarqueeType
  priority: number
  isActive: boolean
  imageUrl: string | null
  linkUrl: string | null
  startDate: string | null // Date serialized as string
  endDate: string | null // Date serialized as string
  createdBy: string
  createdAt: string // Date serialized as string
  updatedAt: string // Date serialized as string
}

// Client-safe MarqueeMessage with creator
export interface ClientMarqueeMessageWithCreator extends ClientMarqueeMessage {
  creator: Pick<ClientUser, 'id' | 'firstName' | 'lastName' | 'email'>
}

export interface ClientProductVariant {
  id: string
  productId: string
  size: string
  color: string
  material: string | null
  sku: string
  price: number // Converted from Decimal
  comparePrice: number | null // Converted from Decimal
  costPrice: number | null // Converted from Decimal
  stock: number
  lowStockThreshold: number
  weight: number | null // Converted from Decimal
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ClientProduct {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  sku: string
  categoryId: string
  brandId: string
  status: ProductStatus
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  averageRating: number // Converted from Decimal
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface ClientOrder {
  id: string
  orderNumber: string
  customerId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingStatus: ShippingStatus
  subtotal: number // Converted from Decimal
  taxAmount: number // Converted from Decimal
  shippingAmount: number // Converted from Decimal
  discountAmount: number // Converted from Decimal
  totalAmount: number // Converted from Decimal
  shippingAddressId: string
  billingAddressId: string
  trackingNumber: string | null
  shippedAt: string | null
  deliveredAt: string | null
  customerNotes: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

// Complex types with relations
export interface ClientProductWithDetails extends ClientProduct {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  brand: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  variants: ClientProductVariant[]
  images: Array<{
    id: string
    url: string
    altText: string | null
    isPrimary: boolean
    sortOrder: number
  }>
  _count: {
    reviews: number
  }
}

// Utility function to convert server types to client-safe types
export function serializeMarqueeMessage(message: any): ClientMarqueeMessage {
  return {
    id: message.id,
    title: message.title,
    message: message.message,
    type: message.type,
    priority: message.priority,
    isActive: message.isActive,
    imageUrl: message.imageUrl,
    linkUrl: message.linkUrl,
    startDate: message.startDate ? new Date(message.startDate).toISOString() : null,
    endDate: message.endDate ? new Date(message.endDate).toISOString() : null,
    createdBy: message.createdBy,
    createdAt: new Date(message.createdAt).toISOString(),
    updatedAt: new Date(message.updatedAt).toISOString(),
  }
}

export function serializeMarqueeMessageWithCreator(message: any): ClientMarqueeMessageWithCreator {
  return {
    ...serializeMarqueeMessage(message),
    creator: {
      id: message.creator.id,
      firstName: message.creator.firstName,
      lastName: message.creator.lastName,
      email: message.creator.email,
    }
  }
}

export function serializeProduct(product: any): ClientProductWithDetails {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    sku: product.sku,
    categoryId: product.categoryId,
    brandId: product.brandId,
    status: product.status,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    tags: product.tags,
    averageRating: product.averageRating || 0,
    reviewCount: product._count?.reviews || 0,
    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
      description: product.category.description,
    },
    brand: {
      id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.slug,
      description: product.brand.description,
    },
    variants: product.variants.map((variant: any) => ({
      id: variant.id,
      productId: variant.productId,
      size: variant.size,
      color: variant.color,
      material: variant.material,
      sku: variant.sku,
      price: Number(variant.price),
      comparePrice: variant.comparePrice ? Number(variant.comparePrice) : null,
      costPrice: variant.costPrice ? Number(variant.costPrice) : null,
      stock: variant.stock,
      lowStockThreshold: variant.lowStockThreshold,
      weight: variant.weight ? Number(variant.weight) : null,
      isActive: variant.isActive,
      createdAt: new Date(variant.createdAt).toISOString(),
      updatedAt: new Date(variant.updatedAt).toISOString(),
    })),
    images: product.images.map((image: any) => ({
      id: image.id,
      url: image.url,
      altText: image.altText,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
    })),
    _count: {
      reviews: product._count?.reviews || 0,
    },
  }
}
