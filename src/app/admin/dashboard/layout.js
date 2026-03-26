import { requireAdminSession } from "@/lib/auth/adminSession";

export default async function AdminDashboardLayout({ children }) {
  await requireAdminSession();
  return children;
}
