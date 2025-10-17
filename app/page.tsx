import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();

  const userRole = cookieStore.get("role")?.value;
  const parsedRole = JSON.parse(userRole || "null");
  console.log(parsedRole, "PP");

  const getHomeRoute = (role: string | undefined) => {
    if (role === "admin") {
      return "/dashboard";
    } else if (role === "staff") {
      return "/staff-dashboard";
    } else if (role) {
      return "/dashboard";
    } else {
      return "/login";
    }
  };

  const homeRoute = getHomeRoute(parsedRole?.role);

  redirect(homeRoute);
}
