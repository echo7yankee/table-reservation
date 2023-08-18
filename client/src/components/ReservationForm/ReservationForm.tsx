import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../InputText/InputText";
import { RootState } from "../../reduxStore/store";
import { capitalizeText } from "../../utils/CapitalizeText";
import { onChangeReservation } from "../../reduxStore/slices/reservation";

const ReservationForm = () => {
    const inputs = ["firstName", "lastName", "phoneNumber", "email", "table"];

    const dispatch = useDispatch();

    const { reservation } = useSelector(
        (state: RootState) => state.reservationsReducer
    );

    return (
        <form>
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
        </form>
    );
};

export default ReservationForm;
