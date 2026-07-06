import messageModel from "../models/messages.model.js"

/**
 * Creates a new message in the database.
 * @param {Object} messageData - The data for the new message.
 * @param {string} messageData.conversationId - The ID of the conversation to which the message belongs.
 * @param {string} messageData.senderId - The ID of the user sending the message.
 * @param {string} messageData.content - The content of the message.
 * @returns {Promise<Object>} - A promise that resolves to the created message object.
 */
export async function createMessage(messageData) {
    const message = await messageModel.create(messageData)
    return message
}


/**
 * Retrieves all messages for a specific conversation.
 * @param {string} conversationId - The ID of the conversation for which to retrieve messages.
 * @returns {Promise<Array>} - A promise that resolves to an array of message objects.
 */
export async function getMessagesByConversationId(conversationId) {
    const messages = await messageModel.find({ conversationId }).sort({ createdAt: 1 })
    return messages
}