import prisma from "../db/prisma";

export async function getFlows(filters: {
  srcIp?: string;
  dstIp?: string;
  protocol?: string;
  limit?: number;
}) {
  return prisma.flow.findMany({
    where: {
      srcHost: filters.srcIp ? { ip: filters.srcIp } : undefined,
      dstHost: filters.dstIp ? { ip: filters.dstIp } : undefined,
      protocol: filters.protocol ? { name: filters.protocol } : undefined,
    },
    include: {
      srcHost: true,
      dstHost: true,
      protocol: true,
      service: true,
    },
    take: filters.limit ?? 100,
    orderBy: { startTime: "desc" },
  });
}

export async function getFlowById(flowId: number) {
  return prisma.flow.findUnique({
    where: { id: flowId },
    include: {
      srcHost: true,
      dstHost: true,
      protocol: true,
      service: true,
      metrics: true,
      attackLabel: true,
    },
  });
}

export async function getMetricsForTimeRange(params: {
  srcIp?: string;
  from: bigint;
  to: bigint;
}) {
  return prisma.flowMetrics.findMany({
    where: {
      flow: {
        startTime: { gte: params.from, lte: params.to },
        srcHost: params.srcIp ? { ip: params.srcIp } : undefined,
      },
    },
    select: {
      sbytes: true,
      dbytes: true,
      spkts: true,
      dpkts: true,
      sload: true,
      dload: true,
      flow: {
        select: {
          startTime: true,
          protocol: { select: { name: true } },
        },
      },
    },
    orderBy: {
      flow: { startTime: "asc" },
    },
  });
}
