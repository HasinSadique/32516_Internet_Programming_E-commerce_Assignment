import categoriesData from "@/data/dummy-data/categories.json";

const allCategories = categoriesData.map((category) => ({ ...category }));

export function getAllCategories() {
  return allCategories.map((category) => ({ ...category }));
}

export function getCategoryById(id) {
  const category = allCategories.find((item) => item.id === id);
  return category ? { ...category } : null;
}
