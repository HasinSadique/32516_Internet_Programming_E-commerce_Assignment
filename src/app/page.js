import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import ProductGrid from "@/components/products/ProductGrid";

export const metadata = {
  title: "Shop | E-Commerce Store",
  description: "Discover quality products at great prices.",
};

export default async function HomePage() {
  const featuredProducts = await getAllProducts({ featuredOnly: true });
  // console.log("featuredProducts", featuredProducts);
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 rounded-2xl bg-slate-100 px-6 py-12 text-center md:px-12">
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Welcome to Shop
        </h1>
        <p className="mx-auto max-w-2xl py-4 text-lg text-slate-700">
          Discover quality products at great prices. Browse our collection and
          find your next favorite.
        </p>
        <Link
          href="/products"
          className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Shop All Products
        </Link>
      </section>
      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Featured Products
        </h2>
        <ProductGrid products={featuredProducts} />
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
