import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { parseCSV } from "../utils/csvParser";
import { ingestRow } from "../services/ingestService";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file required" });
  }

  let count = 0;

  try {
    await parseCSV(req.file.path, async (row) => {
      await ingestRow(row);
      count++;
    });

    res.json({
      status: "success",
      rowsInserted: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "CSV ingestion failed" });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

export default router;
