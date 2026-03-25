import { GET, GET_BY_ID } from "@/app/api/products/route";

function normalizeProduct(product) {
  return {
    _id: product._id,
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
  console.log("id", id);
  if (!id) return null;
  const response = await GET_BY_ID(id);
  const payload = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch product by id:", payload?.error || payload);
    return null;
  }

  console.log("payload", payload);
  return normalizeProduct(payload);

  // // For demo/mock data, you may have an array called PRODUCTS (not shown in this file)
  // if (typeof PRODUCTS !== "undefined") {
  //   const numericId = Number(id);
  //   const product = PRODUCTS.find((prod) => Number(prod.id) === numericId);
  //   return product ? normalizeProduct(product) : null;
  // }

  // // If PRODUCT fetching isn't available, return null
  // return null;
}
