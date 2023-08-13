import { Server } from "socket.io";
import { Server as ServerType } from "http";
import { ReservationModel } from "../database/models/reservation";

export const connectSocketIo = (server: ServerType) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:3000" },
    });
    io.on("connection", (socket) => {
        socket.on(
            "table-reservation-client-user",
            async (reservationFromClient) => {
                try {
                    if (reservationFromClient) {
                        const reservation = new ReservationModel({
                            tableNumber: reservationFromClient.tableNumber,
                        });

                        await reservation.save();

                        const reservations = await ReservationModel.find();
                        // Emit the message back to the frontend
                        socket.broadcast.emit(
                            "table-reservation-admin-user",
                            reservations
                        );
                    }
                } catch (error) {
                    console.log("error", error);
                }
            }
        );
    });
};
