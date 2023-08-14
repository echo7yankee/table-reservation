import express from "express";
import Reservation from "../controllers/reservation";
const { getReservations } = new Reservation();
const Router = express.Router();

Router.get("/", getReservations);

export default Router;
