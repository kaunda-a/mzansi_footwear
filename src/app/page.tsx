import Header from "@/components/layout/header";
import { StoreFooter } from "@/components/layout/footer";
import { MarqueeContainer } from "@/components/catalog/marquee/marquee-container";
import { HeroBillboard } from "@/components/catalog/billboard/hero-billboard";
import { SecondaryBillboard } from "@/components/catalog/billboard/secondary-billboard";
import { FeaturedProducts } from "@/components/catalog/featured/featured-products";
import { PopularProducts } from "@/components/catalog/featured/popular-products";
import { TrendingProducts } from "@/components/catalog/trending/trending-products";
import { CategorySection } from "@/components/catalog/category/category-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Carousel Billboard */}
        <HeroBillboard />

        {/* Category Navigation */}
        <CategorySection />

        {/* Trending Products */}
        <div className="container mx-auto px-4 py-8">
          <TrendingProducts />
        </div>

        {/* Popular Products */}
        <PopularProducts />
        
        {/* Secondary Billboard */}
        <SecondaryBillboard />
        
        {/* Featured Products */}
        <FeaturedProducts />
      </main>
      
      <MarqueeContainer />
      <StoreFooter />
    </div>
  );
}
