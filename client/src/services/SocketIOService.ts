import { io, Socket } from "socket.io-client";

export type SocketDataType = {
    tableNumber: number;
};

export type SocketOnCallbackType = (data: SocketDataType) => void;

interface ISocketIOService {
    on(event: string, callback: SocketOnCallbackType): void;
    emit(event: string, data: SocketDataType): void;
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
        this.socket.on(event, (data: SocketDataType) => {
            callback(data);
        });
    }

    emit(event: string, data: SocketDataType) {
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
