// These are server actions that can call from the client
"use server";

import { signIn, signOut } from ".";

export async function toLogin() {
  await signIn();
}

export async function login(formData) {
  try {
    await signIn("credentials", { redirect: false, ...formData });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
