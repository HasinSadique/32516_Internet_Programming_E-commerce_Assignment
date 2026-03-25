import { GET, GET_BY_ID } from "@/app/api/products/route";

function normalizeIdentifier(value) {
  if (value == null) return "";
  if (typeof value === "object" && value.$oid) {
    return String(value.$oid);
  }
  return String(value);
}

function normalizeProduct(product) {
  const normalizedMongoId = normalizeIdentifier(product?._id);

  return {
    _id: normalizedMongoId,
    name: product.name?.trim() || "",
    description: product.description?.trim() || "",
    price: Number(product.price) || 0,
    categoryId: product.categoryId || "",
    image: product.image || "",
    stock: Number(product.stock) || 0,
    featured: Boolean(product.featured),
    createdAt: product.createdAt || null,
    updatedAt: product.updatedAt || null,
  };
}

function sortProducts(products, sortBy, order = "asc") {
  const direction = order === "desc" ? -1 : 1;

  return [...products].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * direction;
    }

    if (aValue > bValue) return 1 * direction;
    if (aValue < bValue) return -1 * direction;
    return 0;
  });
}

export async function getAllProducts(options = {}) {
  const { featuredOnly = false, sortBy, order = "asc" } = options;
  const response = await GET();
  const payload = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch all products:", payload?.error || payload);
    return [];
  }
  let products = Array.isArray(payload) ? payload.map(normalizeProduct) : [];
  if (featuredOnly) {
    products = products.filter((product) => product.featured);
  }
  if (sortBy) {
    products = sortProducts(products, sortBy, order);
  }
  return products;
}

export async function getProductById(id) {
  if (!id) return null;
  const response = await GET_BY_ID(id);
  const payload = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch product by id:", payload?.error || payload);
    return null;
  }

  return normalizeProduct(payload);
}
