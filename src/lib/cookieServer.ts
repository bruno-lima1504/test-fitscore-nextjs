import { cookies } from "next/headers";

export async function getCookieServer() {
  const cookieStores = await cookies();
  const token = cookieStores.get("fitscore-session")?.value;
  return token || null;
}
