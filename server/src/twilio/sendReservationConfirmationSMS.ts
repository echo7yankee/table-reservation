import twilio from "twilio";

type SendReservationConfirmationSMSType = {
    table: number;
    tableId: string;
    phoneNumber: string;
};

export const sendReservationConfirmationSMS = async ({
    table,
    tableId,
    phoneNumber = "+40753977077",
}: SendReservationConfirmationSMSType) => {
    try {
        // Send SMS using Twilio or other SMS service
        const twilioClient = twilio(
            process.env.TWILIO_AUTH_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        await twilioClient.messages.create({
            body: `Your reservation for table ${table} is confirmed. Reservation code: ${tableId}. This code is needed to confirm your reservation at the restaurant or if you want to cancel it. Thank you for choosing us`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
    } catch (error) {
        console.log("Error", error);
    }
};
