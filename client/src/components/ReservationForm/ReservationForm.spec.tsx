import { fireEvent, render, screen } from "@testing-library/react";
import SocketIOService from "../../services/SocketIOService";
import ReservationForm from "./ReservationForm";
import store from "../../reduxStore/store";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

describe("ReservationForm", () => {
    const mockStore = configureStore([]);
    const createReservationForm = (reduxStore: any = store) => {
        jest.spyOn(SocketIOService.getInstance(), "on");
        return render(
            <Provider store={reduxStore}>
                <ReservationForm />
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("component can be imported", () => {
        expect(ReservationForm).toBeDefined();
    });

    it("component is rendered", () => {
        createReservationForm();
        expect(screen.getByTestId("reservation-form")).toBeInTheDocument();
    });

    it.each([
        {
            initialState: {
                reservationsReducer: {
                    reservation: {
                        table: "someValue",
                        firstName: "John",
                        lastName: "Doe",
                        phoneNumber: "1234567890",
                        email: "john@example.com",
                    },
                },
            },
            showOtpForm: true,
        },
        {
            initialState: {
                reservationsReducer: {
                    reservation: {
                        table: "",
                        firstName: "",
                        lastName: "",
                        phoneNumber: "",
                        email: "",
                    },
                },
            },
            showOtpForm: false,
        },
    ])(
        "otp form is rendered when reservation is filled",
        ({ initialState, showOtpForm }) => {
            const store = mockStore(initialState);

            createReservationForm(store);

            const form = screen.getByTestId("reservation-form");
            fireEvent.submit(form);

            if (showOtpForm) {
                expect(screen.getByTestId("otp-form")).toBeInTheDocument();
            } else {
                expect(screen.queryByTestId("otp-form")).toBeNull();
            }
        }
    );
});
