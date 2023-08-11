import mongoose from "mongoose";
import { Express } from "express";

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // Keep this to satisfy typescript, but it's deprecated.
    keepAlive: true,
};

const connectDB = (app: Express, PORT: string | number) => {
    (async () => {
        try {
            // Connect to the database
            await mongoose.connect(
                process.env.MONGO_CONNECT as string,
                options
            );

            // Start the server
            app.listen(PORT, () => {
                console.log(`Server Port: ${PORT}`);
                console.log("Connected to mongoDB with mongoose!");
            });
        } catch (error) {
            console.log("Failed to connect", error);
        }
    })();
};

export default connectDB;
