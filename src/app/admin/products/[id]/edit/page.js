import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";
import ProductForm from "@/components/admin/ProductForm";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Edit | Admin" };
  return { title: `Edit ${product.name} | Admin` };
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const categories = getAllCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
