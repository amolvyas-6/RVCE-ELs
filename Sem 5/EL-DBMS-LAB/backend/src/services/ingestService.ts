import prisma from "../db/prisma";

export async function ingestRow(row: any) {
  const srcHost = await prisma.host.upsert({
    where: { ip: row.srcip },
    update: {},
    create: { ip: row.srcip },
  });

  const dstHost = await prisma.host.upsert({
    where: { ip: row.dstip },
    update: {},
    create: { ip: row.dstip },
  });

  const protocol = await prisma.protocol.upsert({
    where: { name: row.proto },
    update: {},
    create: { name: row.proto },
  });

  const service =
    row.service && row.service !== "-"
      ? await prisma.service.upsert({
          where: { name: row.service },
          update: {},
          create: { name: row.service },
        })
      : null;

  const flow = await prisma.flow.create({
    data: {
      srcHostId: srcHost.id,
      dstHostId: dstHost.id,
      protocolId: protocol.id,
      serviceId: service?.id,
      srcPort: Number(row.sport) || 0,
      dstPort: Number(row.dsport) || 0,
      state: row.state,
      startTime: BigInt(row.Stime),
      endTime: BigInt(row.Ltime),
    },
  });

  await prisma.flowMetrics.create({
    data: {
      flowId: flow.id,
      sbytes: Number(row.sbytes),
      dbytes: Number(row.dbytes),
      spkts: Number(row.Spkts),
      dpkts: Number(row.Dpkts),
      sload: Number(row.Sload),
      dload: Number(row.Dload),
      sjit: row.Sjit ? Number(row.Sjit) : null,
      djit: row.Djit ? Number(row.Djit) : null,
      tcprtt: row.tcprtt ? Number(row.tcprtt) : null,
      synack: row.synack ? Number(row.synack) : null,
      ackdat: row.ackdat ? Number(row.ackdat) : null,
    },
  });

  if (row.Label !== undefined) {
    await prisma.attackLabel.create({
      data: {
        flowId: flow.id,
        category: row.attack_cat || null,
        label: Number(row.Label),
      },
    });
  }
}
