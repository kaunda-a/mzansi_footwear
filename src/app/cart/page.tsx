import { Navbar } from '@/components/layout/navbar';
import { StoreFooter } from '@/components/layout/store-footer';
import { CartView } from '@/components/cart/cart-view';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export const metadata = {
  title: 'Shopping Cart - Mzansi Footwear',
  description: 'Review your selected items and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        {/* Breadcrumbs */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Cart Content */}
        <div className="container mx-auto px-4 py-8">
          <CartView />
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
