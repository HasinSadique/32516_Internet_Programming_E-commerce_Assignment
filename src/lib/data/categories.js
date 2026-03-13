/**
 * Categories data layer.
 * Currently reads from JSON in data/dummy-data.
 * Replace with MongoDB when ready.
 */

import fs from "fs";
import path from "path";

const CATEGORIES_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "dummy-data",
  "categories.json"
);

function readCategories() {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading categories:", err);
    return [];
  }
}

export function getAllCategories() {
  return readCategories();
}

export function getCategoryById(id) {
  const categories = readCategories();
  return categories.find((c) => c.id === id) ?? null;
}
