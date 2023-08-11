import express from "express";
import connectDB from "./database/connectDB";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
// Create express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static("public")); // Serve static files (if needed)

// Routes
app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript!");
});

const PORT = process.env.PORT || 8000;

// Start the server and connect to the database
connectDB(app, PORT);
