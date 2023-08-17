import { createSlice, nanoid } from "@reduxjs/toolkit";
import { getRservations } from "../actions/reservation";
import SocketIOService, {
    EMITSocketDataType,
    ONSocketDataType,
} from "../../services/SocketIOService";

interface InitialStateInterface {
    reservations: ONSocketDataType[] | null;
    reservation: EMITSocketDataType;
    isLoading: boolean;
}

const initialState: InitialStateInterface = {
    reservations: null,
    reservation: {
        tableNumber: 0,
        tableId: nanoid(5),
    },
    isLoading: false,
};

const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        addReservations: (state, action: { payload: ONSocketDataType[] }) => {
            state.reservations = action.payload;
        },
        addReservation: (
            state: any,
            action: { payload: EMITSocketDataType }
        ) => {
            state.reservation = action.payload;
            // This is for testing, to bypass the phone authentication
            // const socket = SocketIOService.getInstance();
            // socket.emit("table-reservation-client-user", action.payload);
        },
        clearReservation: (state) => {
            state.reservation = initialState.reservation;
        },
    },
    extraReducers: {
        [getRservations.pending]: (state) => {
            state.isLoading = true;
        },
        [getRservations.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.reservations = action.payload;
        },
        [getRservations.rejected]: (state) => {
            state.isLoading = false;
        },
    },
});

export const { addReservations, addReservation, clearReservation } =
    reservationSlice.actions;

export default reservationSlice.reducer;
