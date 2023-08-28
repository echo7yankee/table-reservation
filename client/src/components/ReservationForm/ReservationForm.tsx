import { ChangeEvent, useEffect, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../InputText/InputText";
import { RootState } from "../../reduxStore/store";
import { capitalizeText } from "../../utils/CapitalizeText";
import { onChangeReservation } from "../../reduxStore/slices/reservation";
import SocketIOService, {
    ONSocketConfirmationType,
    ONSocketDataUnion,
} from "../../services/SocketIOService";
import { addReservation, clearReservation } from "../../reduxStore/types";
import OTPForm from "../OTPForm/OTPForm";

const ReservationForm = () => {
    const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
    const [message, setMessage] = useState("");
    const inputs = ["firstName", "lastName", "phoneNumber", "email", "table"];

    const dispatch = useDispatch();

    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );

    useEffect(() => {
        const socket = SocketIOService.getInstance();
        socket.on(
            "table-reservation-client-user",
            (data: ONSocketDataUnion) => {
                if ((data as ONSocketConfirmationType).success) {
                    dispatch(clearReservation());
                    setShowOtpForm(false);
                }

                setMessage((data as ONSocketConfirmationType).message);
            }
        );

        return () => {
            socket.off("table-reservation-client-user");
        };
    }, [dispatch]);

    const handleOnReserveTableSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            reservation.table &&
            reservation.firstName &&
            reservation.lastName &&
            reservation.phoneNumber &&
            reservation.email
        ) {
            dispatch(addReservation(reservation));
            setShowOtpForm(true);
        }
    };

    return (
        <>
            <form
                onSubmit={handleOnReserveTableSubmit}
                data-testid="reservation-form"
            >
                {inputs.map((input) => (
                    <InputText
                        key={input}
                        placeholder={capitalizeText(input)}
                        value={reservation[input]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            dispatch(
                                onChangeReservation({
                                    ...reservation,
                                    [input]: e.target.value,
                                })
                            )
                        }
                        name={input}
                    />
                ))}
                <button type="submit">{"Reserve your table"}</button>
            </form>
            {showOtpForm && <OTPForm />}
            {message && <p>{message}</p>}
        </>
    );
};

export default ReservationForm;
