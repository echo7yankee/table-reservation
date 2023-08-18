import { createAction } from "@reduxjs/toolkit";
import {
    EMITSocketDataType,
    ONSocketDataType,
} from "../services/SocketIOService";

export const GET_RESERVATIONS = "GET_RESERVATIONS";
export const addReservations = createAction<ONSocketDataType[]>(
    "reservation/addReservations"
);
export const onChangeReservation = createAction<EMITSocketDataType>(
    "reservation/onChangeReservation"
);
export const addReservation = createAction<EMITSocketDataType>(
    "reservation/addReservation"
);
export const clearReservation = createAction("reservation/clearReservation");
