import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import AddToCartButton from "./AddToCartButton";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product | Shop" };
  return {
    title: `${product.name} | Shop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const price =
    typeof product.price === "number"
      ? product.price
      : Number(product.price) || 0;
  const imageUrl = product.image || FALLBACK_IMAGE;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>
          </li>
          <li className="text-slate-400">/</li>
          <li>
            <Link href="/products" className="hover:text-slate-700">
              Products
            </Link>
          </li>
          <li className="text-slate-400">/</li>
          <li className="text-slate-600">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover block"
          />
        </div>
        <div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{product.name}</h1>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-blue-600">
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="mb-6 text-slate-700">{product.description}</p>
          <p className="mb-6 text-sm text-slate-600">
            {product.stock > 0 ? (
              <span className="text-emerald-600">
                In stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
