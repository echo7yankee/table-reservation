export type ReservationType = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    date: string;
    table: string;
    tableId: string;
    id?: string;
    [key: string]: number | string | undefined;
};

export type CancelReservationType = {
    tableId: string;
    phoneNumber: string;
};
