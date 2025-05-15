import { Hono } from "hono";
import type { Context } from "hono";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const auth = new Hono();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "soundmood",
});

auth.post("/login", async (c: Context) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Champs requis manquants." }, 400);
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ) as unknown as [mysql.RowDataPacket[]];

    const user = rows.length > 0 ? rows[0] : null;

    if (!user) {
      return c.json({ error: "Utilisateur non trouvé." }, 404);
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return c.json({ error: "Mot de passe incorrect." }, 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "2h" }
    );

    return c.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("Erreur login :", error);
    return c.json({ error: "Erreur serveur" }, 500);
  }
});

export default auth;