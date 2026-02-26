import { Router } from "express";
import {
  getFlows,
  getFlowById,
  getMetricsForTimeRange,
} from "../services/flowService";

const router = Router();

function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

/**
 * GET /flows
 * Optional query params:
 * - srcIp
 * - dstIp
 * - protocol
 * - limit
 */
router.get("/", async (req, res) => {
  try {
    const filters: {
      srcIp?: string;
      dstIp?: string;
      protocol?: string;
      limit?: number;
    } = {};

    if (typeof req.query.srcIp === "string") {
      filters.srcIp = req.query.srcIp;
    }

    if (typeof req.query.dstIp === "string") {
      filters.dstIp = req.query.dstIp;
    }

    if (typeof req.query.protocol === "string") {
      filters.protocol = req.query.protocol;
    }

    if (typeof req.query.limit === "string") {
      filters.limit = Number(req.query.limit);
    }

    const flows = await getFlows(filters);
    res.json(serializeBigInt(flows));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flows" });
  }
});

/**
 * GET /flows/:id
 */
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid flow id" });
  }

  const flow = await getFlowById(id);
  if (!flow) {
    return res.status(404).json({ error: "Flow not found" });
  }

  res.json(serializeBigInt(flow));
});

/**
 * GET /flows/metrics/timeseries
 * Required:
 * - from
 * - to
 * Optional:
 * - srcIp
 */
router.get("/metrics/timeseries", async (req, res) => {
  const from = BigInt(req.query.from as string);
  const to = BigInt(req.query.to as string);

  try {
    const metrics = await getMetricsForTimeRange({
      srcIp: req.query.srcIp as string | undefined,
      from,
      to,
    });

    res.json(serializeBigInt(metrics));
  } catch {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

export default router;
