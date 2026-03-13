import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import ProductGrid from "@/components/products/ProductGrid";

export const metadata = {
  title: "Shop | E-Commerce Store",
  description: "Discover quality products at great prices.",
};

export default function HomePage() {
  const featuredProducts = getAllProducts({ featuredOnly: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="hero min-h-[320px] bg-base-200 rounded-2xl mb-12">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Welcome to Shop</h1>
            <p className="py-4 text-lg opacity-90">
              Discover quality products at great prices. Browse our collection
              and find your next favorite.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductGrid products={featuredProducts} />
        <div className="text-center mt-8">
          <Link href="/products" className="btn btn-outline">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
