import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";

function buildProductQuery(id) {
  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    return null;
  }
  return { _id: new ObjectId(id) };
}

function sanitizeProductPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid request body." };
  }

  const next = {};

  if (payload.name !== undefined) {
    const name = String(payload.name ?? "").trim();
    if (!name) return { error: "Product name cannot be empty." };
    next.name = name;
  }

  if (payload.description !== undefined) {
    next.description = String(payload.description ?? "").trim();
  }

  if (payload.price !== undefined) {
    const price = Number(payload.price);
    if (Number.isNaN(price) || price < 0) {
      return { error: "Price must be a valid non-negative number." };
    }
    next.price = price;
  }

  if (payload.categoryId !== undefined) {
    next.categoryId = String(payload.categoryId ?? "").trim();
  }

  if (payload.image !== undefined) {
    next.image = String(payload.image ?? "").trim();
  }

  if (payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      return { error: "Stock must be a valid non-negative integer." };
    }
    next.stock = stock;
  }

  if (payload.featured !== undefined) {
    next.featured = Boolean(payload.featured);
  }

  return { data: next };
}

function requireAdminApiSession(request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 401 },
    );
  }
  return null;
}

async function getRouteId(params) {
  const resolvedParams = await params;
  return resolvedParams?.id;
}

export async function GET(_, { params }) {
  try {
    const id = await getRouteId(params);
    const query = buildProductQuery(id);
    if (!query) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    const productsCollection = await getCollection("products");
    const product = await productsCollection.findOne(query);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const unauthorizedResponse = requireAdminApiSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const id = await getRouteId(params);
    const query = buildProductQuery(id);
    if (!query) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    const body = await request.json();
    const { data, error } = sanitizeProductPayload(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    const productsCollection = await getCollection("products");
    const updateResult = await productsCollection.updateOne(query, {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await productsCollection.findOne(query);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const unauthorizedResponse = requireAdminApiSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const id = await getRouteId(params);
    const query = buildProductQuery(id);
    if (!query) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    const productsCollection = await getCollection("products");
    const result = await productsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
