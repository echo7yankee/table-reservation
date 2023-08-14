import express from "express";
import cors from "cors";
import connectDB from "./database/connectDB";
import dotenv from "dotenv";
import http from "http";
import { connectSocketIo } from "./socketIoConnection/socketIoConnection";

// Load environment variables
dotenv.config();
// Create express app
const app = express();
const server = http.createServer(app);
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static("public")); // Serve static files (if needed)

connectSocketIo(server);
const PORT = process.env.PORT || 8000;
// Start the server and connect to the database
connectDB(PORT, server);

import ReservationRouter from "./routes/reservation";

// Routes
app.use("/reservations", ReservationRouter);
