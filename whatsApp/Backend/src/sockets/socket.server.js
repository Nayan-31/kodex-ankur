import { Server } from "socket.io"
import { verifyAccessToken } from "../utils/auth.utils.js"
import * as conversationDao from "../dao/conversation.dao.js"
import * as messageDao from "../dao/message.dao.js"


export function initializeSocketServer(httpServer) {
    const io = new Server(httpServer)

    io.use((socket, next) => {

        const token = socket.handshake.headers.authorization?.split(" ")[ 1 ]

        if (!token) {
            return next(new Error("Authentication error:no token provided"))
        }

        try {
            const decoded = verifyAccessToken(token)
            socket.userId = decoded.userId
            next()
        }
        catch (error) {
            return next(new Error("Authentication error:invalid token"))
        }
    })

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.userId)

        // –––––– make user join a room with their userId so we can send messages to them specifically
        socket.join(socket.userId)


        socket.on("sendMessage", async (data) => {

            if (typeof data === "string") {
                data = JSON.parse(data)
            }

            const isConversationExists = await conversationDao.getConversationByParticipants([ socket.userId, data[ "receiver" ] ])

            let conversationId = isConversationExists?._id
            if (!isConversationExists) {
                const conversation = await conversationDao.createConversation([ socket.userId, data[ "receiver" ] ])
                conversationId = conversation._id
            }

            await messageDao.createMessage({
                conversationId: isConversationExists?._id || conversationId,
                senderId: socket.userId,
                content: data[ "content" ]
            })

            const receiver = data[ "receiver" ]

            data.conversationId = conversationId
            data.senderId = socket.userId

            io.timeout(10000).to(receiver).emit("receiveMessage", data, (err, response) => {
                console.log("Message sent to receiver:", receiver, "Error:", err, "Response:", response)
            })
        })


        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.userId)
            socket.leave(socket.userId)
        })

    })


}