import { io } from "socket.io-client";
import { store } from "../../../app/app.store";


let socket = null

export const createSocketConnection = () => {

    socket = io('', {
        extraHeaders: {
            Authorization: `Bearer ${store.getState().auth.accessToken}`
        }
    })

}

export const emitEvent = (eventName, payload) => {

    if (!socket) {
        throw new Error("Socket is not initialized. Please create it first.")
    }

    socket.emit(eventName, payload)
}
