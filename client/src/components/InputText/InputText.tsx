import { ChangeEvent } from "react";

type InputTextPropsType = {
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string | number | undefined;
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
        ...(value && { value }),
        ...(className && { className }),
        ...(dataTestId && { "data-testid": dataTestId }),
    };

    return <input type="text" {...props} />;
};

InputText.defaultProps = {
    className: "",
    dataTestId: "input-text",
};

export default InputText;
