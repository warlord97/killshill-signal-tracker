import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signalRoutes from "./routes/signalRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/signals", signalRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "KillShill Signal Tracker API is running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
