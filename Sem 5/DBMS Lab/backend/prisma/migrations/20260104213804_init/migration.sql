/*
  Warnings:

  - Added the required column `dload` to the `FlowMetrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dpkts` to the `FlowMetrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sload` to the `FlowMetrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spkts` to the `FlowMetrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlowMetrics" ADD COLUMN     "djit" DOUBLE PRECISION,
ADD COLUMN     "dload" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dpkts" INTEGER NOT NULL,
ADD COLUMN     "sjit" DOUBLE PRECISION,
ADD COLUMN     "sload" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spkts" INTEGER NOT NULL;
