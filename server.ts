import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClerkClient, verifyJwt } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database for Credits (In-memory for demo)
  // In a real app, you'd use a database like MongoDB or PostgreSQL
  const userCredits: Record<string, number> = {};

  // Middleware to verify Clerk session
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      // Verify the session token
      const session = await verifyJwt(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      req.auth = { userId: session.payload.sub };
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API Routes
  app.get("/api/credits", authenticate, (req: any, res) => {
    const userId = req.auth.userId;
    if (!(userId in userCredits)) {
      userCredits[userId] = 10; // Initial free credits
    }
    res.json({ credits: userCredits[userId] });
  });

  app.post("/api/credits/spend", authenticate, (req: any, res) => {
    const userId = req.auth.userId;
    if (!(userId in userCredits)) {
      userCredits[userId] = 10;
    }

    if (userCredits[userId] > 0) {
      userCredits[userId] -= 1;
      res.json({ success: true, credits: userCredits[userId] });
    } else {
      res.status(400).json({ error: "Insufficient credits" });
    }
  });

  app.post("/api/credits/add", authenticate, (req: any, res) => {
    const userId = req.auth.userId;
    const { amount } = req.body;
    
    if (!(userId in userCredits)) {
      userCredits[userId] = 10;
    }

    userCredits[userId] += (amount || 10);
    res.json({ success: true, credits: userCredits[userId] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
