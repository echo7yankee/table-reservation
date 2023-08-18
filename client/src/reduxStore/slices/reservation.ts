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
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        date: "23/12/2021",
        table: "",
        tableId: nanoid(5).toUpperCase(),
    },
    isLoading: false,
};

const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        addReservations: (
            state: InitialStateInterface,
            action: { payload: ONSocketDataType[] }
        ) => {
            state.reservations = action.payload;
        },
        onChangeReservation: (
            state: InitialStateInterface,
            action: { payload: EMITSocketDataType }
        ) => {
            state.reservation = action.payload;
        },
        addReservation: (
            state: InitialStateInterface,
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
    extraReducers: (builder) => {
        builder
            .addCase(getRservations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRservations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reservations = action.payload;
            })
            .addCase(getRservations.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    addReservations,
    onChangeReservation,
    addReservation,
    clearReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
