import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import router from "./routes/bookRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization "],
}));

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4000;

// Database connect karo
connectDB();

app.use("/api", authRouter)
app.use("/api", router)

app.listen(port, () => {
    console.log(`Server running on port ${port} 🚀`);
});