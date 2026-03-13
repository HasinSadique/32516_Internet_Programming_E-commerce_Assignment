import {
  getAllProducts,
  createProduct,
} from "@/lib/data/products";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const categoryId = searchParams.get("categoryId");
    const products = getAllProducts({
      featuredOnly: featured === "true",
      categoryId: categoryId || null,
    });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const product = createProduct(body);
    if (!product) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
