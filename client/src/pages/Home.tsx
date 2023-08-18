import { useEffect, ChangeEvent } from "react";
import OTPForm from "../components/OTPForm/OTPForm";
import { useDispatch, useSelector } from "react-redux";
import { addReservation } from "../reduxStore/slices/reservation";
import { RootState } from "../reduxStore/store";
import { useState } from "react";
import SocketIOService, {
    ONSocketCancelDataType,
    ONSocketDataUnion,
} from "../services/SocketIOService";
import InputText from "../components/InputText/InputText";
import ReservationForm from "../components/ReservationForm/ReservationForm";

const initialCancelState = {
    isOpen: false,
    inputValue: "",
    isError: false,
    message: "",
};

const Home = () => {
    const [cancel, setIsCancel] = useState(initialCancelState);
    const dispatch = useDispatch();
    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );
    const socket = SocketIOService.getInstance();

    const handleReservation = () => {
        dispatch(addReservation(reservation));
    };

    const handleCancellationOnSubmit = (e: any) => {
        e.preventDefault();
        if (!cancel.inputValue) {
            return;
        }

        socket.emit("cancel-reservation", cancel.inputValue);
    };

    useEffect(() => {
        socket.on("cancel-reservation", (data: ONSocketDataUnion) => {
            setIsCancel({
                ...cancel,
                isOpen: true,
                message: (data as ONSocketCancelDataType).message,
                isError: (data as ONSocketCancelDataType).success,
            });
        });
    }, [socket, cancel]);

    const showOtpForm =
        reservation.table &&
        reservation.firstName &&
        reservation.lastName &&
        reservation.phoneNumber &&
        reservation.email;

    return (
        <>
            <div>
                <button onClick={handleReservation}>{"Reserve Now"}</button>
                <div>
                    <button
                        onClick={() => setIsCancel({ ...cancel, isOpen: true })}
                    >
                        {"Initialize Cancellation"}
                    </button>
                </div>
                <ReservationForm />
                {showOtpForm && <OTPForm />}
                {cancel.isOpen && (
                    <>
                        <form onSubmit={handleCancellationOnSubmit}>
                            <InputText
                                value={cancel.inputValue}
                                placeholder="Table Id"
                                name="TableId"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setIsCancel({
                                        ...cancel,
                                        inputValue: e.target.value,
                                    })
                                }
                            />
                            <button type="submit">{"Confirm"}</button>
                        </form>
                        {cancel.message && <p>{cancel.message}</p>}
                    </>
                )}
            </div>
            <div id="recaptcha-container"></div>
        </>
    );
};

export default Home;
