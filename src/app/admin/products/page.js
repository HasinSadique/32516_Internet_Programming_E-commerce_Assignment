import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import DeleteProductButton from "./DeleteProductButton";

const FALLBACK_IMAGE = "https://placehold.co/48x48?text=N/A";

export const metadata = {
  title: "Products | Admin",
};

export default async function AdminProductsPage() {
  const products = getAllProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          <span>No products yet.</span>
          <Link href="/admin/products/new" className="btn btn-sm">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-base-300">
                      <img
                        src={product.image || FALLBACK_IMAGE}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>
                  <td className="font-medium">{product.name}</td>
                  <td>${(product.price ?? 0).toFixed(2)}</td>
                  <td>
                    <span className={product.stock < 10 ? "text-warning" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.featured ? "Yes" : "No"}</td>
                  <td className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
