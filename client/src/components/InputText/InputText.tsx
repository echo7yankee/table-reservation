import { ChangeEvent } from "react";

type InputTextPropsType = {
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    name: string;
    className?: string | "";
    dataTestId?: string | null;
};

const InputText = ({
    placeholder,
    onChange,
    value,
    name,
    className,
    dataTestId,
}: InputTextPropsType) => {
    const props: InputTextPropsType = {
        placeholder,
        onChange,
        value,
        name,
        ...(className && { className }),
        ...(dataTestId && { dataTestId }),
    };

    return <input type="text" {...props} />;
};

InputText.defaultProps = {
    className: "",
    dataTestId: null,
};

export default InputText;
