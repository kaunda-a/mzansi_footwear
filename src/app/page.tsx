import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import { MarqueeContainer } from "@/components/catalog/marquee/marquee-container";
import { HeroBillboard } from "@/components/catalog/billboard/hero-billboard";
import { SecondaryBillboard } from "@/components/catalog/billboard/secondary-billboard";
import { HeaderBillboard } from "@/components/catalog/billboard/header-billboard";
import { FooterBillboard } from "@/components/catalog/billboard/footer-billboard";
import { FeaturedProducts } from "@/components/catalog/featured/featured-products";
import { PopularProducts } from "@/components/catalog/featured/popular-products";
import { TrendingProducts } from "@/components/catalog/trending/trending-products";
import { ModalBillboard } from "@/components/catalog/billboard/modal-billboard";
import { DashboardTopBillboard } from "@/components/catalog/billboard/dashboard-top-billboard";
import { DashboardBottomBillboard } from "@/components/catalog/billboard/dashboard-bottom-billboard";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* New Header Billboard */}
      <HeaderBillboard />

      <main className="flex-1">
        {/* Hero Carousel Billboard */}
        <HeroBillboard />

       
        {/* Trending Products */}
        <div className="bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <TrendingProducts />
          </div>
        </div>

         {/* Dashboard Top Billboard - After hero, before products */}
        <div className="container mx-auto px-4 py-4">
          <DashboardTopBillboard />
        </div>


        {/* Popular Products */}
        <PopularProducts />
        
        {/* Secondary Billboard */}
        <SecondaryBillboard />

        {/* Dashboard Bottom Billboard  */}
        <div className="container mx-auto px-4 py-6">
          <DashboardBottomBillboard />
        </div>
        
        {/* Featured Products */}
        <FeaturedProducts />

     
      </main>
      
      <MarqueeContainer />
      
      {/* New Footer Billboard */}
      <FooterBillboard />
      
      <StoreFooter />
      
      {/* Modal Billboard - Shows automatically after 30 seconds */}
      <ModalBillboard />
    </div>
  );
}
