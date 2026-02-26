import { Router } from "express";
import { registerUser, loginUser, getUserById } from "../services/authService";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * POST /auth/register
 * body: { email, password, name }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const result = await registerUser(email, password, name);

    res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    res.status(400).json({ error: message });
  }
});

/**
 * POST /auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(401).json({ error: message });
  }
});

/**
 * POST /auth/logout
 * Note: With JWT, logout is handled client-side by removing the token.
 * This endpoint exists for API consistency and potential future token blacklisting.
 */
router.post("/logout", authMiddleware, async (_req, res) => {
  // With stateless JWT, we simply acknowledge the logout request.
  // The client is responsible for removing the token.
  // Future enhancement: implement token blacklisting with Redis
  res.json({ message: "Logged out successfully" });
});

/**
 * GET /auth/me
 * Returns the current authenticated user
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
