import { getAllProducts } from "@/lib/data/products";
import ProductGrid from "@/components/products/ProductGrid";

export const metadata = {
  title: "Products | Shop",
  description: "Browse all products.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8"> All Products </h1>{" "}
      <ProductGrid products={products} />{" "}
    </div>
  );
}
