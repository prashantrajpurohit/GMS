"use server";

import { cookies } from "next/headers";

export async function getUserOptions() {
  try {
    const cookieStore = await cookies();
    const roleData = cookieStore.get("role")?.value;

    if (!roleData) return [];

    const parsed = JSON.parse(roleData);
    return parsed?.options || [];
  } catch (error) {
    console.error("Error getting user options:", error);
    return [];
  }
}
