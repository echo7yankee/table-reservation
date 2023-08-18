import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import reservationsReducer from "./slices/reservation";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer: {
        reservationsReducer: reservationsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
