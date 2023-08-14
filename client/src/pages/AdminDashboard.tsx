import { useEffect } from "react";
import SocketIOService, { ONSocketDataType } from "../services/SocketIOService";
import { useDispatch, useSelector } from "react-redux";
import { getRservations } from "../reduxStore/actions/reservation";
import { addReservation } from "../reduxStore/slices/reservation";

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { reservations } = useSelector(
        (state: any) => state.reservationsReducer
    );

    useEffect(() => {
        dispatch(getRservations());
    }, [dispatch]);

    useEffect(() => {
        const socket = SocketIOService.getInstance();
        socket.on("table-reservation-admin-user", (data: any) =>
            dispatch(addReservation(data))
        );
    }, [dispatch]);

    return (
        <div>
            {reservations?.map((reservation: ONSocketDataType) => (
                <h1 key={reservation.id}>{reservation.tableNumber}</h1>
            ))}
        </div>
    );
};

export default AdminDashboard;
