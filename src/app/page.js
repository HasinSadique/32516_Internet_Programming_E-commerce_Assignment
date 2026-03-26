import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import ProductGrid from "@/components/products/ProductGrid";

export const metadata = {
  title: "Shop | E-Commerce Store",
  description: "Discover quality products at great prices.",
};

export default async function HomePage() {
  const featuredProducts = await getAllProducts({ featuredOnly: true });

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-blue-50 via-sky-50 to-fuchsia-50 p-8 md:p-16 shadow-md mb-16 flex flex-col items-center">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="600" cy="60" rx="260" ry="64" fill="#Dbeafe" />
            <ellipse cx="400" cy="340" rx="260" ry="64" fill="#a7f3d0" />
          </svg>
        </div>
        <div className="z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 drop-shadow-md">
            Elevate your style.
          </h1>
          <p className="mx-auto max-w-2xl text-xl md:text-2xl text-slate-600 font-medium mb-8">
            Discover the latest trends, snag exclusive deals, and enjoy a
            seamless shopping experience.
          </p>
          <Link
            href="/products"
            className="inline-flex gap-2 items-center rounded-full bg-blue-700 px-8 py-3 text-lg font-semibold text-white shadow-xl transition-all hover:bg-blue-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span>Shop All Products</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>
        </div>
      </section>
      <section className="">
        <div className="flex items-center justify-between mb-7 gap-4">
          <h2 className="text-3xl font-bold text-slate-900">Featured</h2>
          <Link
            href="/products"
            className="underline hover:text-blue-700 font-medium text-slate-800 transition-colors"
          >
            View All Products
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
        {/* <div className="flex justify-center lg:hidden">
          <Link
            href="/products"
            className="mt-8 inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-2 font-medium text-slate-800 shadow hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            View All Products
          </Link>
        </div> */}
      </section>
    </main>
  );
}
