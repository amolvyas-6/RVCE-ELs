import fs from "fs";
import csv from "csv-parser";

export function parseCSV(
  filePath: string,
  onRow: (row: any) => Promise<void>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", async (row) => {
      stream.pause();
      try {
        await onRow(row);
        stream.resume();
      } catch (err) {
        stream.destroy(err as Error);
      }
    });

    stream.on("end", resolve);
    stream.on("error", reject);
  });
}
