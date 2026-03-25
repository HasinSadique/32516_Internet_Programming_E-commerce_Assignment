import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function buildProductQuery(id) {
  if (typeof id === "string" && ObjectId.isValid(id)) {
    return { _id: new ObjectId(id) };
  }
  return { _id: id };
}

function sanitizeProductPayload(payload, { allowPartial = false } = {}) {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid request body." };
  }

  const next = {};

  if (!allowPartial || payload.name !== undefined) {
    const name = String(payload.name ?? "").trim();
    if (!name) return { error: "Product name is required." };
    next.name = name;
  }

  if (!allowPartial || payload.description !== undefined) {
    next.description = String(payload.description ?? "").trim();
  }

  if (!allowPartial || payload.price !== undefined) {
    const price = Number(payload.price);
    if (Number.isNaN(price) || price < 0) {
      return { error: "Price must be a valid non-negative number." };
    }
    next.price = price;
  }

  if (!allowPartial || payload.categoryId !== undefined) {
    next.categoryId = String(payload.categoryId ?? "").trim();
  }

  if (!allowPartial || payload.image !== undefined) {
    next.image = String(payload.image ?? "").trim();
  }

  if (!allowPartial || payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      return { error: "Stock must be a valid non-negative integer." };
    }
    next.stock = stock;
  }

  if (!allowPartial || payload.featured !== undefined) {
    next.featured = Boolean(payload.featured);
  }

  return { data: next };
}

export async function GET(request) {
  try {
    const productsCollection = await getCollection("products");
    const products = await productsCollection.find({}).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 },
    );
  }
}

export async function GET_BY_ID(id) {
  try {
    const query = buildProductQuery(id);
    const productsCollection = await getCollection("products");
    const product = await productsCollection.findOne(query);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in GET_BY_ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { data, error } = sanitizeProductPayload(payload);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const productsCollection = await getCollection("products");
    const [highestIdProduct] = await productsCollection
      .find({ id: { $type: "number" } }, { projection: { id: 1 } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const now = new Date().toISOString();
    const nextId =
      Number.isInteger(Number(payload.id)) && Number(payload.id) > 0
        ? Number(payload.id)
        : (highestIdProduct?.id ?? 0) + 1;

    const productToInsert = {
      id: nextId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await productsCollection.insertOne(productToInsert);
    return NextResponse.json(
      { _id: result.insertedId, ...productToInsert },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  return NextResponse.json(
    { error: "Use PUT /api/products/:id to update a product." },
    { status: 405 },
  );
}

export async function DELETE(request) {
  return NextResponse.json(
    { error: "Use DELETE /api/products/:id to delete a product." },
    { status: 405 },
  );
}
