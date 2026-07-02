import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    delivered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const messageModel = mongoose.model("Message", messageSchema)

export default messageModel