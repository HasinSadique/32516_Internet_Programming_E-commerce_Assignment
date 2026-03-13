import { getAllCategories } from "@/lib/data/categories";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Add product | Admin",
};

export default function NewProductPage() {
  const categories = getAllCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add new product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
