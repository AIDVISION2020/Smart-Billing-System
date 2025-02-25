//! module imports
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

//! file imports
import syncDB from "./config/dbsync.config.js";
import goodsRoutes from "./routes/goods.routes.js";
import authRoutes from "./routes/auth.routes.js";
import branchRoutes from "./routes/branch.routes.js";

const __dirname = path.resolve(); // Get the current directory
const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config(); // Load env variables
app.use(express.json()); // To extract from req.body
app.use(cookieParser()); // To parse cookie values

app.use("/api/goods", goodsRoutes); // Use the goods routes
app.use("/api/auth", authRoutes); // Use the auth routes
app.use("/api/branch", branchRoutes); // Use the branch routes

app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Serve the static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
}); // Send the index.html file

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  syncDB();
});
