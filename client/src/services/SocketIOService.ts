import { io, Socket } from "socket.io-client";

export type EMITSocketDataType = {
    tableNumber: number;
};

export type ONSocketDataType = {
    id: string;
} & EMITSocketDataType;

export type SocketOnCallbackType = (data: ONSocketDataType) => void;

interface ISocketIOService {
    on(event: string, callback: SocketOnCallbackType): void;
    emit(event: string, data: EMITSocketDataType): void;
    disconnect(): void;
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
        this.socket.on(event, (data: ONSocketDataType) => {
            if (!data) {
                throw new Error("Data not received");
            }
            callback(data);
        });
    }

    emit(event: string, data: EMITSocketDataType) {
        this.socket.emit(event, data, (error: Error) => {
            if (error) {
                throw new Error(error.message);
            }
        });
    }

    disconnect() {
        this.socket.disconnect();
    }
}
