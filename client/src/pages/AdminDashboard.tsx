import { useEffect, useState } from "react";
import SocketIOService, { SocketDataType } from "../services/SocketIOService";

const AdminDashboard = () => {
    const [reservations, setReservations] = useState<any>([]);

    useEffect(() => {
        const socket = SocketIOService.getInstance();
        socket.on("table-reservation-admin-user", (data: SocketDataType) =>
            setReservations(data)
        );
    }, []);

    console.log("HMM", reservations);

    return (
        <div>
            {reservations?.map((reservation: SocketDataType) => (
                <h1 key={reservation.tableNumber}>{reservation.tableNumber}</h1>
            ))}
        </div>
    );
};

export default AdminDashboard;
