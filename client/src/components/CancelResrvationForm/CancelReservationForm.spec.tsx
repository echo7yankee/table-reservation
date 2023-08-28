import { render, screen, fireEvent } from "@testing-library/react";
import CancelReservationForm from "./CancelReservationForm";
import SocketIOService from "../../services/SocketIOService";

describe("CancelReservationForm", () => {
    const createCancelReservationForm = () => {
        jest.spyOn(SocketIOService.getInstance(), "emit");
        return render(<CancelReservationForm />);
    };

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
        const phoneIdInput = screen.getByPlaceholderText("Phone Number");
        const submitButton = screen.getByTestId("cancel-confirm");

        fireEvent.change(tableIdInput, {
            target: { value: "123", phoneNumber: "+40753977077" },
        });

        fireEvent.change(phoneIdInput, {
            target: { value: "+40753977077" },
        });

        fireEvent.click(submitButton);

        expect(SocketIOService.getInstance().emit).toHaveBeenCalledWith(
            "cancel-reservation",
            { phoneNumber: "+40753977077", tableId: "123" }
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
