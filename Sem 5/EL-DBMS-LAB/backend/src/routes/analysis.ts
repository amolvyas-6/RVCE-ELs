import { Router } from "express";
import { runAnalysis } from "../services/analysisService";

const router = Router();

/**
 * POST /analysis/run
 * body: { from, to, srcIp? }
 */
router.post("/run", async (req, res) => {
  try {
    const { from, to, srcIp } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "`from` and `to` required" });
    }

    const result = await runAnalysis({
      from: BigInt(from),
      to: BigInt(to),
      srcIp,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
