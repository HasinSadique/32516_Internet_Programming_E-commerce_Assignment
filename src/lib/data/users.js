import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";

const CUSTOMERS_COLLECTION = "customers";

export async function findCustomerByEmail(email) {
  const collection = await getCollection(CUSTOMERS_COLLECTION);
  return collection.findOne({
    email: String(email || "")
      .trim()
      .toLowerCase(),
  });
}

export async function findCustomerById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getCollection(CUSTOMERS_COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createCustomer(customer) {
  const collection = await getCollection(CUSTOMERS_COLLECTION);
  const result = await collection.insertOne({
    fullName: customer.fullName,
    dateOfBirth: customer.dateOfBirth,
    address: customer.address,
    postalCode: customer.postalCode,
    email: customer.email,
    phone: customer.phone,
    passwordHash: customer.passwordHash,
    createdAt: new Date(),
  });

  return {
    _id: result.insertedId,
    ...customer,
  };
}

export function toPublicCustomer(customer) {
  if (!customer) {
    return null;
  }

  return {
    id: customer._id.toString(),
    fullName: customer.fullName,
    dateOfBirth: customer.dateOfBirth,
    address: customer.address,
    postalCode: customer.postalCode,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt ?? null,
  };
}

export async function getAllCustomers() {
  const collection = await getCollection(CUSTOMERS_COLLECTION);
  const customers = await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return customers.map(toPublicCustomer);
}

export async function deleteCustomerAndRelatedData(id) {
  if (!ObjectId.isValid(id)) {
    return { deleted: false, reason: "invalid_id" };
  }

  const customer = await findCustomerById(id);
  if (!customer) {
    return { deleted: false, reason: "not_found" };
  }

  const customerId = customer._id.toString();
  const customerEmail = String(customer.email || "")
    .trim()
    .toLowerCase();

  const ordersCollection = await getCollection("orders");
  const orderFilter = {
    $or: [{ customerId }, { "customer.email": customerEmail }],
  };
  const ordersResult = await ordersCollection.deleteMany(orderFilter);

  const customersCollection = await getCollection(CUSTOMERS_COLLECTION);
  const customerResult = await customersCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (customerResult.deletedCount === 0) {
    return { deleted: false, reason: "not_found" };
  }

  return {
    deleted: true,
    ordersDeleted: ordersResult.deletedCount,
  };
}
