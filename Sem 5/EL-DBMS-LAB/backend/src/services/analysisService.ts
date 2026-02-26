import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

export async function runAnalysis(payload: {
  from: bigint;
  to: bigint;
  srcIp?: string;
}) {
  const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
    from_ts: payload.from.toString(),
    to_ts: payload.to.toString(),
    srcIp: payload.srcIp,
  });

  return response.data;
}
