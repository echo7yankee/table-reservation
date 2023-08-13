import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
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
