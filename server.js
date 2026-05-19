import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./server/config/db.js";

dotenv.config()
const PORT = process.env.PORT || 5000;

await connectDB();

const app = express();


app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║       🌍 TravelGen AI Server             ║
  ║──────────────────────────────────────────║
  ║  Status    : Running                     ║
  ║  Port      : ${PORT}                        ║
  ║  API Base  : http://localhost:${PORT}/api   ║
  ╚══════════════════════════════════════════╝
  `);
});

