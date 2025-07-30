'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  MapPin,
  Package,
  Settings,
  LogOut,
  CreditCard,
  UserCircle,
  Phone,
  Mail
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCart } from '@/hooks/use-cart';

const categories = [
  { name: 'Men\'s Shoes', href: '/products?category=mens' },
  { name: 'Women\'s Shoes', href: '/products?category=womens' },
  { name: 'Kids Shoes', href: '/products?category=kids' },
  { name: 'Sneakers', href: '/products?category=sneakers' },
  { name: 'Formal', href: '/products?category=formal' },
  { name: 'Casual', href: '/products?category=casual' },
  { name: 'Sports', href: '/products?category=sports' },
  { name: 'Sale', href: '/products?sale=true' }
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { items } = useCart();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Deliver to South Africa</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/help" className="hover:underline">
                Customer Service
              </Link>
              <Link href="/track-order" className="hover:underline">
                Track Your Order
              </Link>
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>+27 11 123 4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <span className="font-bold text-lg">MF</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-primary">Mzansi Footwear</h1>
              <p className="text-xs text-muted-foreground">Step into Style</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className={`flex items-center border rounded-lg transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-primary border-primary' : 'border-input'
              }`}>
                <Input
                  type="search"
                  placeholder="Search for shoes, brands, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-lg"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="rounded-l-none px-6"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search Suggestions */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-background border border-t-0 rounded-b-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground mb-2">Popular searches</div>
                    {['Nike Air Max', 'Adidas Sneakers', 'Formal Shoes', 'Running Shoes'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          router.push(`/products?search=${encodeURIComponent(suggestion)}`);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                      >
                        <Search className="h-3 w-3 inline mr-2" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className="h-5 w-5" />
              <span className="ml-1 hidden lg:inline">Wishlist</span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Badge>
                )}
                <span className="ml-1 hidden lg:inline">Cart</span>
              </Link>
            </Button>

            {/* Account */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden md:inline">
                      Hi, {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/addresses">
                      <MapPin className="mr-2 h-4 w-4" />
                      Addresses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/payment-methods">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} size="sm">
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Browse categories and manage your account
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Categories */}
                  <div>
                    <h3 className="font-semibold mb-2">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="block py-2 text-sm hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Account */}
                  {session ? (
                    <div>
                      <h3 className="font-semibold mb-2">Account</h3>
                      <div className="space-y-2">
                        <Link href="/account/profile" className="block py-2 text-sm hover:text-primary">
                          Profile
                        </Link>
                        <Link href="/account/orders" className="block py-2 text-sm hover:text-primary">
                          Orders
                        </Link>
                        <Link href="/account/addresses" className="block py-2 text-sm hover:text-primary">
                          Addresses
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block py-2 text-sm hover:text-primary text-left w-full"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => signIn()} className="w-full">
                      Sign In
                    </Button>
                  )}

                  {/* Mobile Contact */}
                  <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>+27 11 123 4567</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>support@mzansifootwear.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 py-2 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
