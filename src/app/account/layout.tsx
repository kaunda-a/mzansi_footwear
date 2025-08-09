'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Settings, 
  Heart,
  Bell,
  Shield,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { Api } from '@/lib/api';

const accountNavItems = [
  {
    title: 'Profile',
    href: '/account/profile',
    icon: User,
    description: 'Personal information and preferences'
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Package,
    description: 'Track and manage your orders'
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
    description: 'Manage shipping and billing addresses'
  },
  {
    title: 'Payment Methods',
    href: '/account/payment-methods',
    icon: CreditCard,
    description: 'Saved cards and payment options'
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
    description: 'Items you want to buy later'
  },
  {
    title: 'Notifications',
    href: '/account/notifications',
    icon: Bell,
    description: 'Email and SMS preferences'
  },
  {
    title: 'Security',
    href: '/account/security',
    icon: Shield,
    description: 'Password and security settings'
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Settings,
    description: 'Account preferences and privacy'
  }
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/account');
      return;
    }

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
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Account Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {session.user?.name || 'User'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden md:flex">
                Member since 2024
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{session.user?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <nav className="space-y-1">
                  {accountNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted group"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="group-hover:text-foreground">{item.title}</span>
                    </Link>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <Link
                    href="/help"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted group"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="group-hover:text-foreground">Help & Support</span>
                  </Link>
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted group w-full text-left"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="group-hover:text-foreground">Sign Out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                  <Badge variant="secondary">
                    {loading ? '...' : analytics?.totalOrders || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wishlist Items</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <Badge variant="secondary">
                    {loading ? '...' : `R${(analytics?.totalSpent || 0).toFixed(0)}`}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Favorite Category</span>
                  <Badge variant="secondary">
                    {loading ? '...' : analytics?.favoriteCategories?.[0]?.name || 'None'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
