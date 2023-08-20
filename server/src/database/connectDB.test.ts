import mongoose from "mongoose";
import { Server } from "http";
import connectDB from "./connectDB";

jest.mock("mongoose", () => ({
    set: jest.fn(),
    connect: jest.fn(),
}));

describe("connectDB", () => {
    let app: Server;
    let listenSpy: jest.SpyInstance;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        app = {
            listen: jest.fn(),
        } as unknown as Server;
        listenSpy = jest.spyOn(app, "listen");
        consoleLogSpy = jest.spyOn(console, "log");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should connect to MongoDB", async () => {
        const PORT = 8000;
        const MONGO_CONNECT = "mongodb://localhost:27017/mydatabase";

        process.env.MONGO_CONNECT = MONGO_CONNECT;

        await connectDB(PORT, app);

        expect(mongoose.connect).toHaveBeenCalledWith(MONGO_CONNECT, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            keepAlive: true,
        });
    });

    it("should log an error message if the connection to MongoDB fails", async () => {
        const PORT = 8000;
        const MONGO_CONNECT = "mongodb://localhost:27017/mydatabase";

        process.env.MONGO_CONNECT = MONGO_CONNECT;

        (mongoose.connect as jest.Mock).mockRejectedValue(
            new Error("connection error")
        );

        await connectDB(PORT, app);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            "Failed to connect",
            expect.any(Error)
        );
    });
});
