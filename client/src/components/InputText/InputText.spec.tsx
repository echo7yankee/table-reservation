import { render, screen } from "@testing-library/react";
import InputText from "./InputText";

const createCancelReservationForm = () => {
    return render(
        <InputText
            placeholder="This is a spec"
            onChange={() => jest.fn()}
            value=""
            name="inputSpec"
            className="inputClassname"
            dataTestId={"input-text"}
        />
    );
};

describe("InputText", () => {
    it("component can be imported", () => {
        expect(InputText).toBeDefined();
    });

    it("component is rendered", () => {
        createCancelReservationForm();
        expect(screen.getByTestId("input-text")).toBeInTheDocument();
    });
});
