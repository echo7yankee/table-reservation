import { createAction } from "@reduxjs/toolkit";
import { ReservationType } from "../interfaces";

export const GET_RESERVATIONS = "GET_RESERVATIONS";
export const addReservations = createAction<ReservationType[]>(
    "reservation/addReservations"
);
export const onChangeReservation = createAction<ReservationType>(
    "reservation/onChangeReservation"
);
export const addReservation = createAction<ReservationType>(
    "reservation/addReservation"
);
export const clearReservation = createAction("reservation/clearReservation");
