import Image from "next/image";
import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
import { getAllCategories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";

function pickFeaturedProducts(products) {
  if (!products.length) return [];

  const featured = products.filter((product) => product.featured);
  return (featured.length ? featured : products).slice(0, 4);
}

export default async function Homepage() {
  const categories = getAllCategories();
  const products = await getAllProducts();
  const showcaseProducts = pickFeaturedProducts(products);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="relative w-full h-[500px] overflow-hidden rounded-2xl mb-10">
        {/* Background Image */}
        <Image
          src="/Autotech_hero_image.png"
          alt="AutoTech Solutions"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-700 via-black/70 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="max-w-2xl text-white">
            <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
              Upgrade your drive with premium car audio gear.
            </h1>

            <p className="mt-4 text-sm md:text-base text-blue-100 max-w-xl">
              Explore our best sellers in amplifiers, speakers, and subwoofers,
              then add your favorites to cart in a few clicks.
            </p>

            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Browse all products
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* lllll */}
      {/* <section className="relative w-full h-[500px] overflow-hidden rounded-2xl">
        <Image
          src="/Autotech_hero_image.png"
          alt="AutoTech Solutions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent rounded-2xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
              Welcome
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
              Upgrade your drive with premium car audio gear.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-blue-100 md:text-base">
              Explore our best sellers in amplifiers, speakers, and subwoofers,
              then add your favorites to cart in a few clicks.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex rounded-lg bg-white px-5 py-2.5 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                Shop products
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* llll */}
      {/* <section className="mb-10 overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-r bg-transparen p-8 text-white shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
          Welcome
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
          Upgrade your drive with premium car audio gear.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-blue-100 md:text-base">
          Explore our best sellers in amplifiers, speakers, and subwoofers, then
          add your favorites to cart in a few clicks.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex rounded-lg bg-white px-5 py-2.5 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Shop products
          </Link>
        </div>
      </section> */}

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="text-sm text-slate-600">
              Handpicked picks from our current catalog.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={showcaseProducts} />
      </section>
    </div>
  );
}
