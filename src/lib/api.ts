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
  UserWithDetails,
} from "@/lib/services";
import { MarqueeService } from "@/lib/services/marquee";
import { ProductService } from "@/lib/services/products";

export class Api {
  private static getBaseUrl(): string {
    if (typeof window !== "undefined") {
      // Client-side
      return "";
    }
    // Server-side
    return (
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000"
    );
  }

  static async getActiveMarqueeMessages(): Promise<
    MarqueeMessageWithCreator[]
  > {
    try {
      // Use direct service call on server-side, HTTP request on client-side
      if (typeof window === "undefined") {
        // Server-side - call service directly
        return await MarqueeService.getActiveMessages();
      } else {
        // Client-side - make HTTP request
        const response = await fetch("/api/marquee", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching marquee messages:", error);
      return [];
    }
  }

  static async getProducts(
    params: {
      page?: number;
      limit?: number;
      sort?: string;
      search?: string;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      featured?: boolean;
      size?: string;
      color?: string;
    } = {},
  ): Promise<{
    products: ProductWithDetails[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      // Use direct service call on server-side, HTTP request on client-side
      if (typeof window === "undefined") {
        // Server-side - call service directly
        const filters: any = {
          isActive: true,
          status: "ACTIVE" as const,
          search: params.search,
          categoryId: params.category,
          brandId: params.brand,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          isFeatured: params.featured ? true : undefined,
          size: params.size,
          color: params.color,
        };

        const sortConfig = (() => {
          switch (params.sort) {
            case "oldest":
              return { field: "createdAt" as const, direction: "asc" as const };
            case "price-low-high":
              return { field: "price" as const, direction: "asc" as const };
            case "price-high-low":
              return { field: "price" as const, direction: "desc" as const };
            case "name-a-z":
              return { field: "name" as const, direction: "asc" as const };
            case "name-z-a":
              return { field: "name" as const, direction: "desc" as const };
            case "trending":
              // For trending, we sort by reviewCount first, then by createdAt
              return { field: "reviewCount" as const, direction: "desc" as const };
            case "newest":
            default:
              return {
                field: "createdAt" as const,
                direction: "desc" as const,
              };
          }
        })();

        return await ProductService.getProducts({
          filters,
          sort: sortConfig,
          page: params.page || 1,
          limit: params.limit || 12,
        });
      } else {
        // Client-side - make HTTP request
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sort) searchParams.append("sort", params.sort);
        if (params.search) searchParams.append("search", params.search);
        if (params.category) searchParams.append("category", params.category);
        if (params.brand) searchParams.append("brand", params.brand);
        if (params.minPrice)
          searchParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          searchParams.append("maxPrice", params.maxPrice.toString());
        if (params.featured) searchParams.append("featured", "true");
        if (params.size) searchParams.append("size", params.size);
        if (params.color) searchParams.append("color", params.color);

        const response = await fetch(
          `/api/products?${searchParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        products: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 },
      };
    }
  }

  static async getAllMarqueeMessages(
    params: {
      page?: number;
      limit?: number;
      type?: string;
      search?: string;
    } = {},
  ): Promise<{
    messages: MarqueeMessageWithCreator[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.type) searchParams.append("type", params.type);
      if (params.search) searchParams.append("search", params.search);

      const baseUrl = this.getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/marquee/list?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching marquee messages:", error);
      return {
        messages: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      };
    }
  }

  static async getMarqueeMessageById(
    id: string,
  ): Promise<MarqueeMessageWithCreator | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/marquee/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching marquee message:", error);
      return null;
    }
  }

  // Billboard Methods
  static async getBillboards(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      position?: string;
    } = {},
  ): Promise<{
    billboards: BillboardWithCreator[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.position) searchParams.append("position", params.position);

      const baseUrl = this.getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/billboards?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching billboards:", error);
      return {
        billboards: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 },
      };
    }
  }

  static async getBillboardById(
    id: string,
  ): Promise<BillboardWithCreator | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/billboards/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching billboard:", error);
      return null;
    }
  }

  // Order Methods
  static async getOrders(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      userId?: string;
    } = {},
  ): Promise<{
    orders: OrderWithDetails[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.status) searchParams.append("status", params.status);
      if (params.search) searchParams.append("search", params.search);
      if (params.userId) searchParams.append("userId", params.userId);

      const baseUrl = this.getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/orders?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        orders: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 },
      };
    }
  }

  static async getOrderById(id: string): Promise<OrderWithDetails | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }

  // Note: Admin customer methods removed - /api/customers is for admin only
  // Shop uses account methods below instead

  // Customer Analytics Methods (for customer account dashboard)
  static async getCustomerAnalytics(): Promise<{
    totalOrders: number;
    totalSpent: number;
    favoriteCategories: { name: string; count: number }[];
    recentPurchases: any[];
    spendingTrend: { month: string; amount: number }[];
  }> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/analytics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        favoriteCategories: [],
        recentPurchases: [],
        spendingTrend: [],
      };
    }
  }

  // Product Variants Methods
  static async getProductVariants(productId: string): Promise<any[]> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/products/${productId}/variants`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching product variants:", error);
      return [];
    }
  }

  static async createProductVariant(
    productId: string,
    variantData: CreateVariantData,
  ): Promise<any | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/products/${productId}/variants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variantData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating product variant:", error);
      return null;
    }
  }

  static async updateProductVariant(
    variantId: string,
    variantData: UpdateVariantData,
  ): Promise<any | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/product-variants/${variantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variantData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating product variant:", error);
      return null;
    }
  }

  // Customer Profile Methods (for account management)
  static async getCurrentCustomerProfile(): Promise<CustomerWithDetails | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      return null;
    }
  }

  static async updateCustomerProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
  }): Promise<CustomerWithDetails | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating customer profile:", error);
      return null;
    }
  }

  static async getCustomerAddresses(): Promise<any[]> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/addresses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching customer addresses:", error);
      return [];
    }
  }

  static async addCustomerAddress(addressData: {
    type: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
    phone?: string;
    isDefault?: boolean;
  }): Promise<any | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding customer address:", error);
      return null;
    }
  }

  static async updateCustomerAddress(
    id: string,
    addressData: Partial<{
      type: string;
      firstName: string;
      lastName: string;
      company?: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      province: string;
      postalCode: string;
      country?: string;
      phone?: string;
      isDefault?: boolean;
    }>,
  ): Promise<any | null> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating customer address:", error);
      return null;
    }
  }

  static async deleteCustomerAddress(id: string): Promise<boolean> {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/account/addresses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting customer address:", error);
      return false;
    }
  }
}
