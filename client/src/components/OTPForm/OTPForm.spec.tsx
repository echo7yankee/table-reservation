import {
    fireEvent,
    render,
    screen,
    act,
    waitFor,
} from "@testing-library/react";
import SocketIOService from "../../services/SocketIOService";
import OTPForm from "./OTPForm";
import store from "../../reduxStore/store";
import { Provider } from "react-redux";

describe("OTPForm", () => {
    jest.mock("firebase/auth");
    const createOTPForm = (reduxStore: any = store) => {
        jest.spyOn(SocketIOService.getInstance(), "emit");
        return render(
            <Provider store={reduxStore}>
                <OTPForm />
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("component can be imported", () => {
        expect(OTPForm).toBeDefined();
    });

    it("component is rendered", () => {
        createOTPForm();
        expect(screen.getByTestId("otp-form")).toBeInTheDocument();
    });

    it("should handle onSubmit", async () => {
        act(() => {
            createOTPForm();
        });

        const form = screen.getByTestId("otp-form");
        const formButton = screen.getByTestId("otp-form-submit-button");

        window.confirmationResult = jest.fn().mockReturnValue({});

        expect(formButton).toHaveTextContent("Get code");

        fireEvent.submit(form);

        expect(formButton).toHaveTextContent("Resend");
        waitFor(() => {
            expect(screen.getByTestId("otp-form-error")).toBeInTheDocument();
            expect(screen.getByTestId("otp-form-error")).toHaveTextContent(
                "Something went wrong with the generation of the code! Please try again!"
            );
        });
    });
});
