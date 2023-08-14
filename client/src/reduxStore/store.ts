import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import ReservationReducer from "./slices/reservation";

const store = configureStore({
    reducer: {
        reservationsReducer: ReservationReducer,
    },
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
