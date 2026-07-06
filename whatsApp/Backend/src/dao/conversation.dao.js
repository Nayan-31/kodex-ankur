import conversationModel from "../models/conversation.model.js"



/**
 * Creates a new conversation with the given participants.
 * @param {Array} participants - An array of participant IDs for the conversation.
 * @returns {Promise<Object>} - A promise that resolves to the created conversation object.
 */
export async function createConversation(participants = []) {
    const conversation = await conversationModel.create({ participants })
    return conversation
}


/**
 * Retrieves a conversation by its ID.
 * @param {string} conversationId - The ID of the conversation to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the conversation object if found, or null if not found.
 */
export async function getConversationById(conversationId) {
    const conversation = await conversationModel.findById(conversationId)
    return conversation
}



/**
 * Retrieves all conversations that include the specified user ID as a participant.
 * @param {string} userId - The ID of the user whose conversations to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of conversation objects.
 */
export async function getConversationsByUserId(userId) {
    const conversations = await conversationModel
        .find({ participants: { $in: [ userId ] } })
        .populate('participants', 'username email')
    return conversations
}


/**
 * Retrieves a conversation that includes all specified participants.
 * @param {Array} participants - An array of participant IDs to match in the conversation.
 * @returns {Promise<Object|null>} - A promise that resolves to the conversation object if found, or null if not found.
 */
export async function getConversationByParticipants(participants = [/* id(red),id(green) */ ]) {
    const conversation = await conversationModel.findOne({ participants: { $all: participants } })
    return conversation
}