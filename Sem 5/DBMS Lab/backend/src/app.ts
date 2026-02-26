import express from "express";
import healthRouter from "./routes/health";
import ingestRouter from "./routes/ingest";
import flowsRouter from "./routes/flows";
import analysisRouter from "./routes/analysis";
import authRouter from "./routes/auth";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use("/health", healthRouter);
app.use("/ingest", ingestRouter);
app.use("/flows", flowsRouter);
app.use("/analysis", analysisRouter);
app.use("/auth", authRouter);

export default app;
