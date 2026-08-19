import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { clerkMiddleware } from "./clerk";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";

const app = express();
const server = createServer(app);

// ─── Security Headers ───────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://*.clerk.accounts.dev", "https://*.clerk.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "blob:", "https://*.clerk.accounts.dev", "https://*.clerk.com"],
      workerSrc: ["'self'", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Permite el evento unload (lo usa Clerk) y bloquea features innecesarias
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "unload=(self), camera=(), microphone=(), geolocation=()"
  );
  next();
});

// ─── CORS ───────────────────────────────────────────────────────────
const allowedOrigins = (
  ENV.allowedOrigins ||
  "http://localhost:3000,http://localhost:3002,http://localhost:5173,http://localhost:4173,http://127.0.0.1:3000,http://127.0.0.1:3002,http://127.0.0.1:5173,https://generador-depositos-excel.onrender.com,https://generador-depositos-excel-qt48.onrender.com"
)
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Rate Limiting ──────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, try again in 15 minutes." },
});

app.use(generalLimiter);

// ─── Body Parser (reducido de 50MB a 2MB) ───────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

// ─── Clerk auth middleware ───────────────────────────────────────────
app.use(clerkMiddleware({
  publishableKey: ENV.clerkPublishableKey,
  secretKey: ENV.clerkSecretKey,
}));

// ─── Rate limit en auth endpoints ───────────────────────────────────
app.use("/api/trpc/auth", authLimiter);

// ─── tRPC API ───────────────────────────────────────────────────────
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// ─── Static files (production) ──────────────────────────────────────
// IMPORTANTE: debe ir ANTES del error handler para que los archivos
// estáticos (CSS, JS, imágenes) se sirvan con el Content-Type correcto.
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}

// ─── Global Error Handler ───────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err.message);

  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }

  res.status(500).json({
    error: ENV.isProduction
      ? "Internal server error"
      : err.message,
  });
});

async function startServer() {
  console.log(`Starting server in ${process.env.NODE_ENV} mode...`);

  // development mode uses Vite dev server
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }

  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

// Only start the server standalone if not in a Vercel environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer().catch(console.error);
}

export default app;
