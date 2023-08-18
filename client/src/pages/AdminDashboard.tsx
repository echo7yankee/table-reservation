import { useEffect } from "react";
import SocketIOService, {
    ONSocketDataType,
    ONSocketDataUnion,
} from "../services/SocketIOService";
import { useDispatch, useSelector } from "react-redux";
import { getRservations } from "../reduxStore/actions/reservation";
import { addReservations } from "../reduxStore/slices/reservation";
import { RootState } from "../reduxStore/store";

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
            dispatch(addReservations(data as ONSocketDataType[]));
        });
        return () => {
            socket.off("table-reservation-admin-user");
            // socket.off("cancel-reservation");
        };
    }, [dispatch]);

    return (
        <div>
            {reservations?.map((reservation: ONSocketDataType) => (
                <h1 key={reservation.id}>{reservation.table}</h1>
            ))}
        </div>
    );
};

export default AdminDashboard;
