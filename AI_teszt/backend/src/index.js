import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { getDb, initializeDatabase } from "./db.js";
import { createToken, optionalAuth, requireAdmin, requireAuth } from "./auth.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@blog.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

app.use(cors());
app.use(express.json());

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

async function ensureAdminUser() {
  const db = getDb();
  const [rows] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [ADMIN_EMAIL]);

  if (rows.length === 0) {
    const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    await db.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
      ["Admin", ADMIN_EMAIL, passwordHash]
    );
    console.log(`Admin letrehozva: ${ADMIN_EMAIL}`);
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post(
  "/api/auth/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nev, email es jelszo kotelezo." });
    }

    const db = getDb();
    const [existingRows] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);

    if (existingRows.length > 0) {
      return res.status(409).json({ message: "Ez az email mar regisztralva van." });
    }

    const hash = bcrypt.hashSync(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name, email, hash]
    );

    const [userRows] = await db.execute("SELECT id, name, email, role FROM users WHERE id = ?", [
      result.insertId
    ]);

    const user = userRows[0];
    const token = createToken(user, JWT_SECRET);

    res.status(201).json({ token, user });
  })
);

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email es jelszo kotelezo." });
    }

    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = rows[0];

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: "Hibas email vagy jelszo." });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = createToken(safeUser, JWT_SECRET);
    res.json({ token, user: safeUser });
  })
);

app.get(
  "/api/posts",
  optionalAuth(JWT_SECRET),
  asyncHandler(async (req, res) => {
    const db = getDb();
    const [postRows] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at, u.name AS author,
      COUNT(l.id) AS like_count
      FROM posts p
      JOIN users u ON u.id = p.created_by
      LEFT JOIN likes l ON l.post_id = p.id
      GROUP BY p.id, p.title, p.content, p.created_at, u.name
      ORDER BY p.created_at DESC`
    );

    let likedPostIds = new Set();

    if (req.user) {
      const [likedRows] = await db.execute("SELECT post_id FROM likes WHERE user_id = ?", [req.user.id]);
      likedPostIds = new Set(likedRows.map((row) => Number(row.post_id)));
    }

    const posts = postRows.map((post) => ({
      ...post,
      like_count: Number(post.like_count),
      likedByUser: likedPostIds.has(Number(post.id))
    }));

    res.json(posts);
  })
);

app.post(
  "/api/posts",
  requireAuth(JWT_SECRET),
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Cim es tartalom kotelezo." });
    }

    const db = getDb();
    const [result] = await db.execute("INSERT INTO posts (title, content, created_by) VALUES (?, ?, ?)", [
      title,
      content,
      req.user.id
    ]);

    const [rows] = await db.execute(
      `SELECT p.id, p.title, p.content, p.created_at, u.name AS author
      FROM posts p
      JOIN users u ON u.id = p.created_by
      WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  })
);

app.post(
  "/api/posts/:id/like",
  requireAuth(JWT_SECRET),
  asyncHandler(async (req, res) => {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ message: "Ervenytelen poszt azonosito." });
    }

    const db = getDb();
    const [postRows] = await db.execute("SELECT id FROM posts WHERE id = ? LIMIT 1", [postId]);

    if (postRows.length === 0) {
      return res.status(404).json({ message: "Poszt nem talalhato." });
    }

    const [likeRows] = await db.execute(
      "SELECT id FROM likes WHERE user_id = ? AND post_id = ? LIMIT 1",
      [req.user.id, postId]
    );

    let liked;

    if (likeRows.length > 0) {
      await db.execute("DELETE FROM likes WHERE id = ?", [likeRows[0].id]);
      liked = false;
    } else {
      await db.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [req.user.id, postId]);
      liked = true;
    }

    const [countRows] = await db.execute("SELECT COUNT(*) AS count FROM likes WHERE post_id = ?", [postId]);

    res.json({ liked, like_count: Number(countRows[0].count) });
  })
);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Szerver hiba tortent." });
});

async function start() {
  await initializeDatabase();
  await ensureAdminUser();

  app.listen(PORT, () => {
    console.log(`Backend fut: http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Inditasi hiba:", err.message);
  process.exit(1);
});
