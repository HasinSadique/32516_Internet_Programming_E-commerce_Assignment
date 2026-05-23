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
  };
}
