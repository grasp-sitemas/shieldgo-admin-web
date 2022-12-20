import { io } from 'socket.io-client'

class SocketioService {
    socket
    constructor() {}

    setupSocketConnection() {
        this.socket = io(process.env.SHIELD_SOCKET_ENDPOINT)
    }
    disconnect() {
        if (this.socket) {
            console.log('🔥: A user disconnected')
            this.socket.disconnect()
        }
    }
}

export default new SocketioService()
