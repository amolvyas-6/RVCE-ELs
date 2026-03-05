import app from "./app";
import prisma from "./db/prisma";
import { connectMongoDB } from "./utils/mongodb";

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log("✅ Database connected");

    // Connect Mongo
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
}

startServer();
