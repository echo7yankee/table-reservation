import { useEffect } from "react";
import SocketIOService, {
    ONSocketDataUnion,
} from "../services/SocketIOService";
import { useDispatch, useSelector } from "react-redux";
import { getRservations } from "../reduxStore/actions/reservation";
import { addReservations } from "../reduxStore/slices/reservation";
import { RootState } from "../reduxStore/store";
import { ReservationType } from "../interfaces";

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { reservations } = useSelector(
        (state: RootState) => state.reservationsReducer
    );

    useEffect(() => {
        dispatch(getRservations());
    }, [dispatch]);

    useEffect(() => {
        const socket = SocketIOService.getInstance();
        socket.on("table-reservation-admin-user", (data: ONSocketDataUnion) => {
            dispatch(addReservations(data as ReservationType[]));
        });
        return () => {
            socket.off("table-reservation-admin-user");
        };
    }, [dispatch]);

    return (
        <div>
            {reservations?.map((reservation: ReservationType) => (
                <h1 key={reservation.id}>{reservation.table}</h1>
            ))}
        </div>
    );
};

export default AdminDashboard;
