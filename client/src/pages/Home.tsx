import { nanoid } from "nanoid";
import OTPForm from "../components/OTPForm/OTPForm";
import { useDispatch, useSelector } from "react-redux";
import { addReservation } from "../reduxStore/slices/reservation";
import { RootState } from "../reduxStore/store";
import { useState } from "react";
import SocketIOService from "../services/SocketIOService";

const initialCancelState = {
    isOpen: false,
    inputValue: "",
};

const Home = () => {
    const [cancel, setIsCancel] = useState(initialCancelState);
    const dispatch = useDispatch();
    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );

    const handleReservation = () => {
        dispatch(
            addReservation({
                tableNumber: Math.floor(Math.random() * 14124123),
                tableId: nanoid(5).toUpperCase(),
            })
        );
    };

    const handleCancellationOnSubmit = (e: any) => {
        e.preventDefault();
        if (!cancel.inputValue) {
            return;
        }

        const socket = SocketIOService.getInstance();
        socket.emit("cancel-reservation", cancel.inputValue);
    };

    return (
        <>
            <div>
                <button onClick={handleReservation}>{"Reserve Now"}</button>
                <button
                    onClick={() => setIsCancel({ ...cancel, isOpen: true })}
                >
                    {"Initialize Cancellation"}
                </button>
                {reservation.tableNumber ? <OTPForm /> : null}
                {cancel.isOpen && (
                    <form onSubmit={handleCancellationOnSubmit}>
                        <input
                            type="text"
                            onChange={(e) =>
                                setIsCancel({
                                    ...cancel,
                                    inputValue: e.target.value,
                                })
                            }
                        />
                        <button type="submit">{"Confirm"}</button>
                    </form>
                )}
            </div>
            <div id="recaptcha-container"></div>
        </>
    );
};

export default Home;
