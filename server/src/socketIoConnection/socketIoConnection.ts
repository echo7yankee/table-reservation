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

                    // Don't create reservation if there is an another reservation with the same phone number
                    // TODO: Uncomment this code when you want to prevent users from making multiple reservations
                    // if (existingReservation) {
                    //     socket.emit("table-reservation-client-user", {
                    //         success: false,
                    //         message: `You already have a reservation with us. Please contact our support if you have any questions.`,
                    //     });
                    //     return;
                    // }

                    const reservation = new ReservationModel(
                        reservationFromClient
                    );

                    await reservation.save();
                    await sendReservationConfirmationSMS({
                        phoneNumber: reservationFromClient.phoneNumber,
                        body: `Your reservation for table ${reservationFromClient.table} is confirmed. Reservation code: ${reservationFromClient.tableId}. This code is needed to confirm your reservation at the restaurant or if you want to cancel it. Thank you for choosing us`,
                    });

                    // Emit the message back to the frontend client
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

        socket.on("cancel-reservation", async ({ tableId, phoneNumber }) => {
            try {
                if (!tableId) {
                    throw new Error("No tableId provided!");
                }

                const deletedReservation = await ReservationModel.deleteOne({
                    tableId,
                });

                // Return error if there is no reservation with the provided tableId
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

                // Emit the message back to the frontend client
                socket.emit("cancel-reservation", {
                    success: true,
                    message: `We're sorry to hear that you've canceled your reservation for Table ${tableId}. If you change your mind, feel free to make a new reservation with us. We look forward to serving you soon!`,
                });

                await sendReservationConfirmationSMS({
                    phoneNumber,
                    body: `We're sorry to hear that you've canceled your reservation for Table ${tableId}. If you change your mind, feel free to make a new reservation with us. We look forward to serving you soon!`,
                });
            } catch (error) {
                console.log("error", error);
            }
        });
    });
};
