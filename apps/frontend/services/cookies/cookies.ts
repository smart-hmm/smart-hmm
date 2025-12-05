"use server";

import { cookies } from "next/headers";

export async function getCookie(key: string) {
  const store = await cookies();  
  return store.get(key);
}

export async function setCookie(key: string, value: string, expiresAt: Date) {
  const store = await cookies();
  store.set(key, value, { expires: expiresAt });
}

