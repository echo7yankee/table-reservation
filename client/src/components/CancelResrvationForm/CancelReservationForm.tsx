import { FormEvent, useState, ChangeEvent, useEffect } from "react";
import InputText from "../InputText/InputText";
import SocketIOService, {
    ONSocketConfirmationType,
    ONSocketDataUnion,
} from "../../services/SocketIOService";

const initialState = {
    tableId: "",
    phoneNumber: "",
    message: "",
    isError: false,
};

const CancelReservationForm = () => {
    const [cancelObj, setCancelObj] = useState(initialState);
    const { tableId, phoneNumber, message } = cancelObj;
    const socket = SocketIOService.getInstance();

    const handleCancellationOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tableId) {
            return;
        }

        socket.emit("cancel-reservation", {
            tableId,
            phoneNumber,
        });
    };

    useEffect(() => {
        socket.on("cancel-reservation", (data: ONSocketDataUnion) => {
            setCancelObj({
                ...cancelObj,
                message: (data as ONSocketConfirmationType).message,
                isError: (data as ONSocketConfirmationType).success,
            });
        });
    }, [socket, cancelObj]);

    const inputs = [
        {
            name: "tableId",
            placeholder: "Table Id",
        },
        {
            name: "phoneNumber",
            placeholder: "Phone Number",
        },
    ];

    return (
        <>
            <form
                onSubmit={handleCancellationOnSubmit}
                data-testid="form-cancel-reservation"
            >
                {inputs.map(({ name, placeholder }) => (
                    <InputText
                        key={name}
                        value={
                            cancelObj[name as keyof typeof cancelObj] as string
                        }
                        placeholder={placeholder}
                        name={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCancelObj({
                                ...cancelObj,
                                [e.target.name]: e.target.value,
                            })
                        }
                    />
                ))}
                <button data-testid="cancel-confirm" type="submit">
                    {"Confirm"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};

export default CancelReservationForm;
