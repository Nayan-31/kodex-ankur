import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';



const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer)


io.on("connection", (socket) => {
    console.log("a user connected")

    console.log(socket.id)

    socket.on("tesla", (msg) => {

        socket.broadcast.emit("musk", {
            ...msg,
            timestamp: new Date()
        })
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected")
    })
})


httpServer.listen(3000, () => {
    console.log("listening on port 3000")
})