import { io, Socket } from "socket.io-client";

export type EMITSocketDataType = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    date: string;
    table: string;
    tableId: string;
    [key: string]: number | string;
};

export type ONSocketDataType = {
    id?: string;
} & EMITSocketDataType;

export type ONSocketCancelDataType = {
    success: boolean;
    message: string;
};

export type ONSocketDataUnion = ONSocketDataType[] | ONSocketCancelDataType;

export type SocketOnCallbackType = (data: ONSocketDataUnion) => void;

interface ISocketIOService {
    on(event: string, callback: SocketOnCallbackType): void;
    emit(event: string, data: EMITSocketDataType | string): void;
    off(event: string): void;
}

export default class SocketIOService implements ISocketIOService {
    socket: Socket;
    public static instance: ISocketIOService;
    constructor() {
        this.socket = io("http://localhost:8000/");
    }

    public static getInstance() {
        if (!SocketIOService.instance) {
            SocketIOService.instance = new SocketIOService();
        }
        return SocketIOService.instance;
    }

    on(event: string, callback: SocketOnCallbackType) {
        this.socket.on(event, (data: ONSocketDataUnion) => {
            if (!data) {
                throw new Error("Data not received");
            }
            callback(data);
        });
    }

    emit(event: string, data: EMITSocketDataType | string) {
        this.socket.emit(event, data, (error: Error) => {
            if (error) {
                throw new Error(error.message);
            }
        });
    }

    off(event: string) {
        this.socket.off(event);
    }
}
