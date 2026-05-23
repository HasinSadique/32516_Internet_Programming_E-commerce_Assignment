import { requireCustomerSession } from "@/lib/auth/customerSession";

export default async function CheckoutLayout({ children }) {
  await requireCustomerSession("/login", "/cart/checkout");
  return children;
}
