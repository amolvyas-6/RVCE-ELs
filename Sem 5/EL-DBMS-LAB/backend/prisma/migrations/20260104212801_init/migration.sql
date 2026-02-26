/*
  Warnings:

  - You are about to drop the column `djit` on the `FlowMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `dload` on the `FlowMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `dpkts` on the `FlowMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `sjit` on the `FlowMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `sload` on the `FlowMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `spkts` on the `FlowMetrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FlowMetrics" DROP COLUMN "djit",
DROP COLUMN "dload",
DROP COLUMN "dpkts",
DROP COLUMN "sjit",
DROP COLUMN "sload",
DROP COLUMN "spkts";
