import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";

export default function ProductCard({ product }) {
  const price = typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const imageUrl = product.image || FALLBACK_IMAGE;

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="card card-compact bg-base-200 shadow hover:shadow-xl transition-shadow h-full flex flex-col">
        <figure className="relative aspect-square bg-base-300 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          {product.featured && (
            <span className="badge badge-primary absolute top-2 left-2">
              Featured
            </span>
          )}
        </figure>
        <div className="card-body flex-1">
          <h2 className="card-title text-base line-clamp-2">{product.name}</h2>
          <p className="text-sm opacity-80 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-lg font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          </div>
          {product.stock != null && product.stock < 21 && product.stock > 0 && (
            <p className="text-xs text-warning">Only {product.stock} left</p>
          )}
        </div>
      </div>
    </Link>
  );
}
