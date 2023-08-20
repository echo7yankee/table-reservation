import { render, screen, fireEvent } from "@testing-library/react";
import CancelReservationForm from "./CancelReservationForm";
import SocketIOService from "../../services/SocketIOService";

const createCancelReservationForm = () => {
    jest.spyOn(SocketIOService.getInstance(), "emit");
    return render(<CancelReservationForm />);
};

describe("CancelReservationForm", () => {
    it("component can be imported", () => {
        expect(CancelReservationForm).toBeDefined();
    });

    it("component is rendered", () => {
        createCancelReservationForm();
        expect(
            screen.getByTestId("form-cancel-reservation")
        ).toBeInTheDocument();
    });

    it("submits the form and emits the cancel-reservation event", () => {
        createCancelReservationForm();

        const tableIdInput = screen.getByPlaceholderText("Table Id");
        const submitButton = screen.getByTestId("cancel-confirm");

        const tableId = "123";

        fireEvent.change(tableIdInput, { target: { value: tableId } });

        fireEvent.click(submitButton);

        expect(SocketIOService.getInstance().emit).toHaveBeenCalledWith(
            "cancel-reservation",
            tableId
        );
    });

    it("doesn't call emit if value is empty", () => {
        createCancelReservationForm();

        const tableIdInput = screen.getByPlaceholderText("Table Id");
        const submitButton = screen.getByTestId("cancel-confirm");

        const tableId = "";

        fireEvent.change(tableIdInput, { target: { value: tableId } });

        fireEvent.click(submitButton);

        expect(SocketIOService.getInstance().emit).not.toHaveBeenCalled();
    });
});
