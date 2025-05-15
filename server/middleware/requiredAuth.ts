import type { Context, Next } from "hono";
import { verify } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Non autorisé" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, SECRET);
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Token invalide" }, 403);
  }
}