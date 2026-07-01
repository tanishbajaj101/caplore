import express from "express";
import pg from "pg";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const port = Number(process.env.PORT) || 3000;
const databaseUrl = process.env.DATABASE_URL;
const allowedOrigins = new Set(
  (
    process.env.ALLOWED_ORIGINS ?? "https://caplore.vercel.app"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      email VARCHAR(254) NOT NULL,
      phone VARCHAR(16) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function parseSubmission(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return { error: "Enter a name between 2 and 80 characters." };
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { error: "Enter a valid email address." };
  }

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    return { error: "Enter a valid international phone number." };
  }

  return { value: { name, email, phone } };
}

const app = express();
app.disable("x-powered-by");
app.use("/api", (request, response, next) => {
  const origin = request.get("origin");

  if (origin && allowedOrigins.has(origin)) {
    response.set("Access-Control-Allow-Origin", origin);
    response.vary("Origin");
    response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");
  }

  if (request.method === "OPTIONS") {
    return origin && allowedOrigins.has(origin)
      ? response.sendStatus(204)
      : response.sendStatus(403);
  }

  return next();
});
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));

app.get("/api/health", async (_request, response) => {
  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed", error);
    response.status(503).json({ status: "unavailable" });
  }
});

app.post("/api/submissions", async (request, response) => {
  const submission = parseSubmission(request.body ?? {});

  if (submission.error) {
    return response.status(400).json({ error: submission.error });
  }

  try {
    const result = await pool.query(
      `INSERT INTO form_submissions (name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [
        submission.value.name,
        submission.value.email,
        submission.value.phone,
      ],
    );

    return response.status(201).json({
      success: true,
      submission: result.rows[0],
    });
  } catch (error) {
    console.error("Could not save form submission", error);
    return response
      .status(500)
      .json({ error: "Could not save your details. Please try again." });
  }
});

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(projectRoot, "dist");

app.use(express.static(distDirectory));
app.use((request, response, next) => {
  if (request.method === "GET" && !request.path.startsWith("/api/")) {
    return response.sendFile(path.join(distDirectory, "index.html"));
  }

  return next();
});

app.use("/api", (_request, response) => {
  response.status(404).json({ error: "Not found." });
});

async function start() {
  try {
    await initializeDatabase();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Could not initialize PostgreSQL", error);
    process.exit(1);
  }
}

async function shutdown() {
  await pool.end();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();
