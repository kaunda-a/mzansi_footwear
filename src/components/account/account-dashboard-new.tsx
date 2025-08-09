'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  IconPackage, 
  IconHeart, 
  IconUser, 
  IconMapPin,
  IconCreditCard,
  IconBell,
  IconShield,
  IconArrowRight,
  IconTruck,
  IconCheck
} from '@tabler/icons-react';
import { Api } from '@/lib/api';
import { formatPrice } from '@/lib/format';

interface AccountDashboardProps {}

export function AccountDashboard({}: AccountDashboardProps) {
  const [customer, setCustomer] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAccountData() {
      try {
        setLoading(true)
        setError(null)
        
        const [customerData, analyticsData] = await Promise.all([
          Api.getCurrentCustomerProfile(),
          Api.getCustomerAnalytics()
        ])
        
        setCustomer(customerData)
        setAnalytics(analyticsData)
      } catch (err) {
        setError('Failed to load account data')
        console.error('Error loading account data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccountData()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading account...</div>
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics?.totalOrders || 0}</p>
              </div>
              <IconPackage className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatPrice(analytics?.totalSpent || 0)}</p>
              </div>
              <IconCreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <IconHeart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconTruck className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/orders">
                View All
                <IconArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analytics?.recentPurchases?.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentPurchases.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()} • {order.itemCount} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconPackage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
              <Button className="mt-4" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <IconUser className="h-8 w-8 mx-auto text-blue-500" />
              <h3 className="font-semibold">Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/profile">Update Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <IconMapPin className="h-8 w-8 mx-auto text-green-500" />
              <h3 className="font-semibold">Addresses</h3>
              <p className="text-sm text-muted-foreground">Manage shipping addresses</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/addresses">Manage Addresses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <IconBell className="h-8 w-8 mx-auto text-orange-500" />
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">Update preferences</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/notifications">Preferences</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <IconShield className="h-8 w-8 mx-auto text-purple-500" />
              <h3 className="font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">Password and security</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/security">Security Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
