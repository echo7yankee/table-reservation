import { createSlice } from "@reduxjs/toolkit";
import { getRservations } from "../actions/reservation";

interface InitialStateInterface {
    reservations: [];
    isLoading: boolean;
}

const initialState: InitialStateInterface = {
    reservations: [],
    isLoading: false,
};

const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        addReservation: (state: any, action: any) => {
            state.reservations = action.payload;
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

export const { addReservation } = reservationSlice.actions;

export default reservationSlice.reducer;
