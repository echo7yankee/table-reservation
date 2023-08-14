import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_RESERVATIONS } from "../types";

export const getRservations: any = createAsyncThunk(
    GET_RESERVATIONS,
    async () => {
        try {
            const response = await axios.get("/reservations");

            if (!response.data) {
                throw new Error("Reservations not fetched");
            }

            const {
                data: { data },
            } = response;

            return data;
        } catch (error) {
            console.log("Error", error);
        }
    }
);
