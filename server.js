import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./server/config/db.js";

import { notFound, errorHandler } from "./server/middleware/error.middleware.js";


import authRoutes from "./server/routes/auth.routes.js";
import tripRoutes from "./server/routes/trip.routes.js";
import aiRoutes from "./server/routes/ai.routes.js";

dotenv.config()
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";


await connectDB();

const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, 
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});





app.use("/api/auth", authRoutes);   
app.use("/api/trips", tripRoutes);  
app.use("/api/ai", aiRoutes);  


app.use(notFound);
app.use(errorHandler);




app.listen(PORT, "0.0.0.0", () => {
  console.log(`
    ┌────────────────────────────────────────────────────────┐
    │ 🌍 TravelGen AI Server Active                          │
    ├────────────────────────────────────────────────────────┤
    │ 🟢 Status   : Running Successfully                     │
    │ 🔌 Port     : ${PORT}                                    │
    │ 🔗 Proxy    : Listening on all network interfaces      │
    └────────────────────────────────────────────────────────┘
  `);
});


