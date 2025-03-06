"use server"

import { cookies } from "next/headers";

export async function logoutUserAction() {
  try {
    await cookies().delete("token", { path: "/" });
    return {
      success: "Logged out successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to logout! please try after sometime",
      status: 500,
    };
  }
}
