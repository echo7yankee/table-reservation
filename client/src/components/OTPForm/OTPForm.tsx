import { useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { generateRecaptcha } from "../../utils/GenerateRecaptcha";
import { authentification } from "../../firebase/firebase-config";
import SocketIOService from "../../services/SocketIOService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import { clearReservation } from "../../reduxStore/slices/reservation";

const initialOTPObjState = {
    phoneNumber: "",
    confirmationCode: "",
    error: "",
};

const OTPForm = () => {
    const [OTPObj, setOTPObj] = useState(initialOTPObjState);
    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );
    const dispatch = useDispatch();

    const { phoneNumber, confirmationCode, error } = OTPObj;

    const handleOnChange = async (e: any) => {
        setOTPObj({
            ...OTPObj,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === "confirmationCode") {
            const confirmationCodeValue = e.target.value;

            if (confirmationCodeValue.length === 6) {
                const confirmationResult = (window as any).confirmationResult;
                try {
                    await confirmationResult.confirm(confirmationCodeValue);

                    // Temporary solution
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
        }
    };

    const handleOnSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setOTPObj({
                ...OTPObj,
                error: "",
            });
            generateRecaptcha("recaptcha-container");
            let appVerifier = (window as any).recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(
                authentification,
                phoneNumber,
                appVerifier
            );
            (window as any).confirmationResult = confirmationResult;
        } catch (error) {
            console.log("ERROR", error);
            throw new Error("Something went wrong with the reservation");
        }
    };

    return (
        <>
            <form onSubmit={handleOnSubmit}>
                <input
                    type="text"
                    placeholder="Phone number"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleOnChange}
                />
                {phoneNumber.length >= 12 && (
                    <div>
                        <input
                            type="text"
                            placeholder="OTP Code"
                            name="confirmationCode"
                            value={confirmationCode}
                            onChange={handleOnChange}
                        />
                        <button type="submit">
                            {"Request confirmation code"}
                        </button>
                    </div>
                )}
            </form>
            {error && <p>{error}</p>}
        </>
    );
};

export default OTPForm;
