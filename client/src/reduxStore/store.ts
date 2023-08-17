import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import ReservationReducer from "./slices/reservation";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer: {
        reservationsReducer: ReservationReducer,
    },
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
