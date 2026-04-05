import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth/adminSession";

export default async function AdminLandingPage() {
    const session = await getAdminSessionFromCookies();
    const now = new Date();

    if (now >= new Date(2026, 2, 24, 23, 59, 0, 0)) {
        redirect(session ? "/admin/dashboard" : "/admin/login");
    } else {
        redirect("/comingSoon");
    }
}