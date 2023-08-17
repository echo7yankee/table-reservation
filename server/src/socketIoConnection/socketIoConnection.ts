import { Server } from "socket.io";
import { Server as ServerType } from "http";
import { ReservationModel } from "../database/models/reservation";
import { sendReservationConfirmationSMS } from "../twilio/sendReservationConfirmationSMS";

export const connectSocketIo = (server: ServerType) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:3000" },
    });
    io.on("connection", (socket) => {
        socket.on(
            "table-reservation-client-user",
            async (reservationFromClient) => {
                try {
                    const reservation = new ReservationModel(
                        reservationFromClient
                    );

                    await reservation.save();

                    await sendReservationConfirmationSMS(reservationFromClient);

                    const reservations = await ReservationModel.find();
                    // Emit the message back to the frontend
                    socket.broadcast.emit(
                        "table-reservation-admin-user",
                        reservations
                    );
                } catch (error) {
                    console.log("error", error);
                }
            }
        );

        socket.on("cancel-reservation", async (tableId) => {
            try {
                if (!tableId) {
                    throw new Error("No tableId provided!");
                }

                await ReservationModel.deleteOne({ tableId });

                const reservations = await ReservationModel.find();
                // Emit the message back to the frontend
                socket.broadcast.emit(
                    "table-reservation-admin-user",
                    reservations
                );
            } catch (error) {
                console.log("error", error);
            }
        });
    });
};
