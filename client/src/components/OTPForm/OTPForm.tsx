import { useState, ChangeEvent, FormEvent } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { generateRecaptcha } from "../../utils/GenerateRecaptcha";
import { authentification } from "../../firebase/firebase-config";
import SocketIOService from "../../services/SocketIOService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import { clearReservation } from "../../reduxStore/slices/reservation";
import InputText from "../InputText/InputText";

const initialOTPObjState = {
    confirmationCode: "",
    error: "",
};

const OTPForm = () => {
    const [OTPObj, setOTPObj] = useState(initialOTPObjState);
    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );
    const dispatch = useDispatch();

    const { confirmationCode, error } = OTPObj;

    const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setOTPObj({
            ...OTPObj,
            confirmationCode: e.target.value,
        });

        const confirmationCodeValue: string = e.target.value;

        if (confirmationCodeValue.length === 6) {
            const confirmationResult = window.confirmationResult;
            try {
                await confirmationResult.confirm(confirmationCodeValue);

                const socket = SocketIOService.getInstance();
                socket.emit("table-reservation-client-user", reservation);

                setOTPObj(initialOTPObjState);
                dispatch(clearReservation());
            } catch (error) {
                setOTPObj({
                    ...OTPObj,
                    confirmationCode: "",
                    error: "Confirmation code incorrect or expired! Please try again!",
                });
            }
        }
    };

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setOTPObj({
                ...OTPObj,
                error: "",
            });

            generateRecaptcha("recaptcha-container");

            const confirmationResult = await signInWithPhoneNumber(
                authentification,
                reservation.phoneNumber,
                window.recaptchaVerifier
            );
            window.confirmationResult = confirmationResult;
        } catch (error) {
            console.log("ERROR", error);
            throw new Error("Something went wrong with the reservation");
        }
    };

    return (
        <>
            <form onSubmit={handleOnSubmit}>
                <div>
                    <InputText
                        placeholder="Confirmation code"
                        name="confirmationCode"
                        value={confirmationCode}
                        onChange={handleOnChange}
                    />
                    <button type="submit">
                        {window.recaptchaVerifier ? "Resend" : "Get code"}
                    </button>
                </div>
            </form>
            {error && <p>{error}</p>}
        </>
    );
};

export default OTPForm;
