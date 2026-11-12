import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

// Guard for /api/admin/* routes (middleware only covers page routes).
export async function isAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
