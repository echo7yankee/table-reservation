import { useState } from "react";
import ReservationForm from "../components/ReservationForm/ReservationForm";
import CancelReservationForm from "../components/CancelResrvationForm/CancelReservationForm";

const Home = () => {
    const [reserveType, setReserveType] = useState<string>("");

    const handlePreReservation = (type: string) => {
        setReserveType(
            type === "reserveTable" ? "reserveTable" : "cancelTable"
        );
    };

    return (
        <>
            <div>
                <button onClick={() => handlePreReservation("reserveTable")}>
                    {"Reserve Now"}
                </button>
                <button onClick={() => handlePreReservation("cancelTable")}>
                    {"Initialize Cancellation"}
                </button>
                {reserveType === "reserveTable" && <ReservationForm />}
                {reserveType === "cancelTable" && <CancelReservationForm />}
            </div>
            <div id="recaptcha-container"></div>
        </>
    );
};

export default Home;
