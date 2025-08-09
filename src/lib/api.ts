import type { 
  MarqueeMessageWithCreator, 
  ProductWithDetails, 
  ProductFilters,
  BillboardWithCreator,
  OrderWithDetails,
  CustomerWithDetails,
  DashboardStats,
  SalesData,
  TopProduct,
  CategoryPerformance,
  CreateVariantData,
  UpdateVariantData,
  UserWithDetails
} from '@/lib/services'

export class Api {
  static async getActiveMarqueeMessages(): Promise<MarqueeMessageWithCreator[]> {
    try {
      const response = await fetch('/api/marquee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching marquee messages:', error)
      return []
    }
  }

  static async getProducts(params: {
    page?: number
    limit?: number
    sort?: string
    search?: string
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    featured?: boolean
  } = {}): Promise<{
    products: ProductWithDetails[]
    pagination: { page: number; limit: number; total: number; pages: number }
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.sort) searchParams.append('sort', params.sort)
      if (params.search) searchParams.append('search', params.search)
      if (params.category) searchParams.append('category', params.category)
      if (params.brand) searchParams.append('brand', params.brand)
      if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString())
      if (params.featured) searchParams.append('featured', 'true')

      const response = await fetch(`/api/products?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return {
        products: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 }
      }
    }
  }

  static async getAllMarqueeMessages(params: {
    page?: number
    limit?: number
    type?: string
    search?: string
  } = {}): Promise<{
    messages: MarqueeMessageWithCreator[]
    pagination: { page: number; limit: number; total: number; pages: number }
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.type) searchParams.append('type', params.type)
      if (params.search) searchParams.append('search', params.search)

      const response = await fetch(`/api/marquee/list?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching marquee messages:', error)
      return {
        messages: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      }
    }
  }

  static async getMarqueeMessageById(id: string): Promise<MarqueeMessageWithCreator | null> {
    try {
      const response = await fetch(`/api/marquee/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching marquee message:', error)
      return null
    }
  }

  // Billboard Methods
  static async getBillboards(params: {
    page?: number
    limit?: number
    search?: string
    position?: string
  } = {}): Promise<{
    billboards: BillboardWithCreator[]
    pagination: { page: number; limit: number; total: number; pages: number }
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.search) searchParams.append('search', params.search)
      if (params.position) searchParams.append('position', params.position)

      const response = await fetch(`/api/billboards?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching billboards:', error)
      return {
        billboards: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 }
      }
    }
  }

  static async getBillboardById(id: string): Promise<BillboardWithCreator | null> {
    try {
      const response = await fetch(`/api/billboards/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching billboard:', error)
      return null
    }
  }

  // Order Methods
  static async getOrders(params: {
    page?: number
    limit?: number
    status?: string
    search?: string
    userId?: string
  } = {}): Promise<{
    orders: OrderWithDetails[]
    pagination: { page: number; limit: number; total: number; pages: number }
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.status) searchParams.append('status', params.status)
      if (params.search) searchParams.append('search', params.search)
      if (params.userId) searchParams.append('userId', params.userId)

      const response = await fetch(`/api/orders?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching orders:', error)
      return {
        orders: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 }
      }
    }
  }

  static async getOrderById(id: string): Promise<OrderWithDetails | null> {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }

  // Note: Admin customer methods removed - /api/customers is for admin only
  // Shop uses account methods below instead

  // Customer Analytics Methods (for customer account dashboard)
  static async getCustomerAnalytics(): Promise<{
    totalOrders: number
    totalSpent: number
    favoriteCategories: { name: string; count: number }[]
    recentPurchases: any[]
    spendingTrend: { month: string; amount: number }[]
  }> {
    try {
      const response = await fetch('/api/account/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching customer analytics:', error)
      return {
        totalOrders: 0,
        totalSpent: 0,
        favoriteCategories: [],
        recentPurchases: [],
        spendingTrend: []
      }
    }
  }

  // Product Variants Methods
  static async getProductVariants(productId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/products/${productId}/variants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching product variants:', error)
      return []
    }
  }

  static async createProductVariant(productId: string, variantData: CreateVariantData): Promise<any | null> {
    try {
      const response = await fetch(`/api/products/${productId}/variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variantData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating product variant:', error)
      return null
    }
  }

  static async updateProductVariant(variantId: string, variantData: UpdateVariantData): Promise<any | null> {
    try {
      const response = await fetch(`/api/product-variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variantData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating product variant:', error)
      return null
    }
  }

  // Customer Profile Methods (for account management)
  static async getCurrentCustomerProfile(): Promise<CustomerWithDetails | null> {
    try {
      const response = await fetch('/api/account/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      return null
    }
  }

  static async updateCustomerProfile(profileData: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    dateOfBirth?: string
  }): Promise<CustomerWithDetails | null> {
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating customer profile:', error)
      return null
    }
  }

  static async getCustomerAddresses(): Promise<any[]> {
    try {
      const response = await fetch('/api/account/addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching customer addresses:', error)
      return []
    }
  }

  static async addCustomerAddress(addressData: {
    type: string
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    province: string
    postalCode: string
    country: string
    phone?: string
  }): Promise<any | null> {
    try {
      const response = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding customer address:', error)
      return null
    }
  }
}
