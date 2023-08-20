import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    table: {
        type: Number,
        required: true,
    },
    tableId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});

ReservationSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ReservationSchema.set("toJSON", {
    virtuals: true,
});

const ReservationModel = mongoose.model("Reservation", ReservationSchema);
export { ReservationModel };
