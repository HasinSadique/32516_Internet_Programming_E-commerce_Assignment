import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import AddToCartButton from "./AddToCartButton";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product | Shop" };
  return {
    title: `${product.name} | Shop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const price =
    typeof product.price === "number"
      ? product.price
      : Number(product.price) || 0;
  const imageUrl = product.image || FALLBACK_IMAGE;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li className="opacity-80">{product.name}</li>
        </ul>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-base-200 rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover block"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="text-base-content/90 mb-6">{product.description}</p>
          <p className="text-sm opacity-80 mb-6">
            {product.stock > 0 ? (
              <span className="text-success">
                In stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-error">Out of stock</span>
            )}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
