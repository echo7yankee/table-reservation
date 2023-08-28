import { useState, ChangeEvent, FormEvent } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { generateRecaptcha } from "../../utils/GenerateRecaptcha";
import { authentification } from "../../firebase/firebase-config";
import SocketIOService from "../../services/SocketIOService";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/store";
import InputText from "../InputText/InputText";

const initialOTPObjState = {
    confirmationCode: "",
    error: "",
    clickedOnce: false,
};

const OTPForm = () => {
    const [OTPObj, setOTPObj] = useState(initialOTPObjState);
    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );

    const { confirmationCode, error, clickedOnce } = OTPObj;

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
            } catch (error) {
                setOTPObj({
                    ...initialOTPObjState,
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
                clickedOnce: true,
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
            console.log("Error", error);
            setOTPObj({
                ...initialOTPObjState,
                error: "Something went wrong with the generation of the code! Please try again!",
            });
        }
    };

    return (
        <>
            <form onSubmit={handleOnSubmit} data-testid="otp-form">
                <div>
                    <InputText
                        placeholder="Confirmation code"
                        name="confirmationCode"
                        value={confirmationCode}
                        onChange={handleOnChange}
                    />
                    <button type="submit" data-testid="otp-form-submit-button">
                        {clickedOnce ? "Resend" : "Get code"}
                    </button>
                </div>
            </form>
            {error && <p data-testid="otp-form-error">{error}</p>}
        </>
    );
};

export default OTPForm;
