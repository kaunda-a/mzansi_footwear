'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import { 
  IconPackage,
  IconTruck,
  IconArrowRight,
  IconTrendingUp,
  IconCalendar
} from '@tabler/icons-react';

export default function AccountDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const analyticsData = await Api.getCustomerAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics?.totalOrders || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">All time purchases</p>
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
                <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
              </div>
              <IconTrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorite Category</p>
                <p className="text-lg font-bold">{analytics?.favoriteCategories?.[0]?.name || 'None'}</p>
                <p className="text-xs text-muted-foreground mt-1">Most purchased</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">
                  {analytics?.favoriteCategories?.[0]?.count || 0}
                </span>
              </div>
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
                View All Orders
                <IconArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analytics?.recentPurchases?.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentPurchases.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconPackage className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <IconCalendar className="h-3 w-3" />
                        {new Date(order.date).toLocaleDateString()} • {order.itemCount} items
                      </p>
                    </div>
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
            <div className="text-center py-12">
              <IconPackage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spending Trend */}
      {analytics?.spendingTrend?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrendingUp className="h-5 w-5" />
              Spending Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {analytics.spendingTrend.map((month: any) => (
                <div key={month.month} className="text-center p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{month.month}</p>
                  <p className="font-semibold">{formatPrice(month.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/account/profile">
                Update Profile Information
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/account/addresses">
                Manage Shipping Addresses
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/account/orders">
                Track Your Orders
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Password</span>
              <Badge variant="secondary">Secure</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Verified</span>
              <Badge variant="default">Verified</Badge>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/security">Security Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
