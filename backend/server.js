//! module imports
import express from "express";
import dotenv from "dotenv";
import path from "path";

//! file imports
import syncDB from "./config/dbsync.config.js";
import goodsRoutes from "./routes/goods.routes.js";

const __dirname = path.resolve(); // Get the current directory
const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config(); // Load env variables
app.use(express.json()); // To extract from req.body
app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Serve the static files

app.use("/api/goods", goodsRoutes); // Use the goods routes

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
}); // Send the index.html file

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  syncDB();
});
