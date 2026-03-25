import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";

export default function ProductCard({ product }) {
  const price =
    typeof product.price === "number"
      ? product.price
      : Number(product.price) || 0;
  const imageUrl = product.image || FALLBACK_IMAGE;

  return (
    <Link href={`/products/${product._id}`} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl">
        <figure className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          {product.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </figure>
        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
            {product.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {product.description}
          </p>
          <div className="mt-auto flex items-center gap-2 pt-2">
            <span className="text-lg font-bold text-blue-600">${price.toFixed(2)}</span>
          </div>
          {product.stock != null && product.stock < 21 && product.stock > 0 && (
            <p className="text-xs text-amber-600">
              Only {product.stock} left
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
