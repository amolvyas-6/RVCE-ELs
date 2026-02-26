-- CreateTable
CREATE TABLE "Host" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" SERIAL NOT NULL,
    "srcHostId" INTEGER NOT NULL,
    "dstHostId" INTEGER NOT NULL,
    "protocolId" INTEGER NOT NULL,
    "serviceId" INTEGER,
    "srcPort" INTEGER NOT NULL,
    "dstPort" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "startTime" BIGINT NOT NULL,
    "endTime" BIGINT NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowMetrics" (
    "id" SERIAL NOT NULL,
    "flowId" INTEGER NOT NULL,
    "sbytes" INTEGER NOT NULL,
    "dbytes" INTEGER NOT NULL,
    "spkts" INTEGER NOT NULL,
    "dpkts" INTEGER NOT NULL,
    "sload" DOUBLE PRECISION NOT NULL,
    "dload" DOUBLE PRECISION NOT NULL,
    "sjit" DOUBLE PRECISION,
    "djit" DOUBLE PRECISION,
    "tcprtt" DOUBLE PRECISION,
    "synack" DOUBLE PRECISION,
    "ackdat" DOUBLE PRECISION,

    CONSTRAINT "FlowMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttackLabel" (
    "id" SERIAL NOT NULL,
    "flowId" INTEGER NOT NULL,
    "category" TEXT,
    "label" INTEGER NOT NULL,

    CONSTRAINT "AttackLabel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Host_ip_key" ON "Host"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_name_key" ON "Protocol"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FlowMetrics_flowId_key" ON "FlowMetrics"("flowId");

-- CreateIndex
CREATE UNIQUE INDEX "AttackLabel_flowId_key" ON "AttackLabel"("flowId");

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_srcHostId_fkey" FOREIGN KEY ("srcHostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_dstHostId_fkey" FOREIGN KEY ("dstHostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowMetrics" ADD CONSTRAINT "FlowMetrics_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackLabel" ADD CONSTRAINT "AttackLabel_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
