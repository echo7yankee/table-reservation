import { FormEvent, useState, ChangeEvent, useEffect } from "react";
import InputText from "../InputText/InputText";
import SocketIOService, {
    ONSocketCancelDataType,
    ONSocketDataUnion,
} from "../../services/SocketIOService";

const initialState = {
    value: "",
    message: "",
    isError: false,
};

const CancelReservationForm = () => {
    const [cancelObj, setCancelObj] = useState(initialState);
    const { value, message } = cancelObj;
    const socket = SocketIOService.getInstance();

    const handleCancellationOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value) {
            return;
        }

        socket.emit("cancel-reservation", value);
    };

    useEffect(() => {
        socket.on("cancel-reservation", (data: ONSocketDataUnion) => {
            setCancelObj({
                ...cancelObj,
                message: (data as ONSocketCancelDataType).message,
                isError: (data as ONSocketCancelDataType).success,
            });
        });
    }, [socket, cancelObj]);

    return (
        <>
            <form onSubmit={handleCancellationOnSubmit}>
                <InputText
                    value={value}
                    placeholder="Table Id"
                    name="TableId"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCancelObj({
                            ...cancelObj,
                            value: e.target.value,
                        })
                    }
                />
                <button type="submit">{"Confirm"}</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};

export default CancelReservationForm;