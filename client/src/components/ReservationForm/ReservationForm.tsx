import { ChangeEvent, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../InputText/InputText";
import { RootState } from "../../reduxStore/store";
import { capitalizeText } from "../../utils/CapitalizeText";
import { onChangeReservation } from "../../reduxStore/slices/reservation";
import SocketIOService, {
    ONSocketDataUnion,
} from "../../services/SocketIOService";
import { addReservation } from "../../reduxStore/types";
import OTPForm from "../OTPForm/OTPForm";

const ReservationForm = () => {
    const inputs = ["firstName", "lastName", "phoneNumber", "email", "table"];

    const dispatch = useDispatch();

    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );

    const socket = SocketIOService.getInstance();

    useEffect(() => {
        socket.on(
            "table-reservation-client-user",
            (data: ONSocketDataUnion) => {
                console.log("HMM", data);
            }
        );
    }, [socket]);

    const handleOnReserveTableSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(addReservation(reservation));
    };

    const showOtpForm =
        reservation.table &&
        reservation.firstName &&
        reservation.lastName &&
        reservation.phoneNumber &&
        reservation.email;

    return (
        <>
            <form onSubmit={handleOnReserveTableSubmit}>
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
        </>
    );
};

export default ReservationForm;
