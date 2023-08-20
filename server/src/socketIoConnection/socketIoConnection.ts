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
                    const existingReservation = await ReservationModel.findOne({
                        phoneNumber: reservationFromClient.phoneNumber,
                    });

                    if (existingReservation) {
                        socket.emit("table-reservation-client-user", {
                            success: false,
                            message: `You already have a reservation with us. Please contact our support if you have any questions.`,
                        });
                        return;
                    }

                    const reservation = new ReservationModel(
                        reservationFromClient
                    );

                    await reservation.save();
                    await sendReservationConfirmationSMS(reservationFromClient);

                    socket.emit("table-reservation-client-user", {
                        success: true,
                        message: `Thank you for making a reservation with us. We look forward to serving you soon!`,
                    });

                    const reservations = await ReservationModel.find();
                    // Emit the message back to the frontend admin
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

                const deletedReservation = await ReservationModel.deleteOne({
                    tableId,
                });

                if (!deletedReservation.deletedCount) {
                    socket.emit("cancel-reservation", {
                        success: false,
                        message: `We couldn't find a reservation with the ID ${tableId}. Please double-check your reservation details or contact our support if you have any questions.`,
                    });

                    return;
                }

                const reservations = await ReservationModel.find();
                // Emit the message back to the frontend admin
                socket.broadcast.emit(
                    "table-reservation-admin-user",
                    reservations
                );

                socket.emit("cancel-reservation", {
                    success: true,
                    message: `We're sorry to hear that you've canceled your reservation for Table ${tableId}. If you change your mind, feel free to make a new reservation with us. We look forward to serving you soon!`,
                });
            } catch (error) {
                console.log("error", error);
            }
        });
    });
};
