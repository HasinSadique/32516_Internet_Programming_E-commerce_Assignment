import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth/adminSession";

export default async function AdminLandingPage() {
  const session = await getAdminSessionFromCookies();
  redirect(session ? "/admin/dashboard" : "/admin/login");
}
