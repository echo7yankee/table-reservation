import { useEffect, useState } from "react";
import SocketIOService from "../services/SocketIOService";

const Home = () => {
    const [test, setTest] = useState(0);
    useEffect(() => {
        const socket = SocketIOService.getInstance();
        socket.emit("table-reservation-client-user", {
            tableNumber: Math.random() * 100,
        });
    }, [test]);

    return (
        <div>
            <button onClick={() => setTest(Math.floor(Math.random() * 5))}>
                Click me!
            </button>
        </div>
    );
};

export default Home;
