import twilio from "twilio";

type SendReservationConfirmationSMSType = {
    phoneNumber: string;
    body: string;
};

export const sendReservationConfirmationSMS = async ({
    phoneNumber = "+40753977077",
    body = "",
}: SendReservationConfirmationSMSType) => {
    try {
        // Send SMS using Twilio or other SMS service
        const twilioClient = twilio(
            process.env.TWILIO_AUTH_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        await twilioClient.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
    } catch (error) {
        console.log("Error", error);
    }
};
