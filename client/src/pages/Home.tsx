import { useEffect, useState } from "react";
import SocketIOService from "../services/SocketIOService";

const initialState = {
    tableNumber: 0,
};

const Home = () => {
    const [reservation, setReservation] = useState(initialState);
    useEffect(() => {
        const socket = SocketIOService.getInstance();
        if (!reservation.tableNumber) {
            console.log("no table number");
            return;
        }
        socket.emit("table-reservation-client-user", reservation);
    }, [reservation]);

    const handleReservation = () => {
        setReservation({
            tableNumber: Math.floor(Math.random() * 14124123),
        });
    };

    return (
        <div>
            <button onClick={handleReservation}>Click me!</button>
        </div>
    );
};

export default Home;
