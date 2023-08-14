import BuildResponse from "../buildResponse/buildResponse";
import { ReservationModel } from "../database/models/reservation";

export default class Reservation extends BuildResponse {
    getReservations = async (req: Request, res: any) => {
        try {
            const reservations = await ReservationModel.find();
            if (reservations.length) {
                this.buildSuccess({
                    res,
                    statusCode: 200,
                    data: reservations,
                });
            }
        } catch (error: any) {
            console.log("error", error);
            this.buildError({
                res,
                statusCode: 500,
                message: error.message,
            });
            throw new Error(error.message);
        }
    };
}
