import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "dummy-data",
  "products.json",
);

function readProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading products:", err);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing products:", err);
    return false;
  }
}

export function getAllProducts(options = {}) {
  const { featuredOnly = false, categoryId = null } = options;
  let products = readProducts();
  if (featuredOnly) products = products.filter((p) => p.featured);
  if (categoryId != null && categoryId !== "")
    products = products.filter((p) => p.categoryId === categoryId);
  return products;
}

export function getProductById(id) {
  const products = readProducts();
  return products.find((p) => p.id == id) ?? null;
}

export function createProduct(input) {
  const products = readProducts();
  const maxId = products.reduce(
    (max, p) => (Number(p.id) > max ? Number(p.id) : max),
    0,
  );
  const id = maxId + 1;
  const now = new Date().toISOString();
  const product = {
    id,
    name: input.name ?? "",
    description: input.description ?? "",
    price: Number(input.price) ?? 0,
    categoryId: input.categoryId ?? "",
    image: input.image ?? "",
    stock: Number(input.stock) ?? 0,
    featured: Boolean(input.featured),
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  return writeProducts(products) ? product : null;
}

export function updateProduct(id, input) {
  const products = readProducts();
  const index = products.findIndex((p) => p.id == id);
  if (index === -1) return null;
  const existing = products[index];
  const updated = {
    ...existing,
    name: input.name !== undefined ? input.name : existing.name,
    description:
      input.description !== undefined
        ? input.description
        : existing.description,
    price: input.price !== undefined ? Number(input.price) : existing.price,
    categoryId:
      input.categoryId !== undefined ? input.categoryId : existing.categoryId,
    image: input.image !== undefined ? input.image : existing.image,
    stock: input.stock !== undefined ? Number(input.stock) : existing.stock,
    featured:
      input.featured !== undefined
        ? Boolean(input.featured)
        : existing.featured,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updated;
  return writeProducts(products) ? updated : null;
}

export function deleteProduct(id) {
  const products = readProducts();
  const next = products.filter((p) => p.id != id);
  if (next.length === products.length) return false;
  return writeProducts(next);
}
