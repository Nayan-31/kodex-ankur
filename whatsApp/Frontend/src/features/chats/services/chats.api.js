import globalApi from "../../shared/global.api"



/**
 * create conversation with recipientId
 * @param {string} recipientId - recipientId
 * @returns {Promise<object>} - conversation object
 */
export const createConversation = async (recipientId) => {

    try {
        const response = await globalApi.post("/chats/conversation", { recipientId })
        return response.data.data
    } catch (err) {
        console.log(err)
        return null
    }
}


/**
 * Get all conversations of loggedInUser
 * @returns {Promise<Array>} - array of conversations
 */
export const getMyConversations = async () => {
    try {
        const response = await globalApi.get("/chats/conversations")

        return response.data.data.conversations
    } catch (err) {
        console.log(err)
        return null
    }
}


/**
 * Get all messages of all conversations of loggedInUser
 * 
 * @returns {Promise<Object>} 
 *          {
 *            messages: {},
 *          }
 */
export const getMessages = async () => {

    const response = await globalApi.get("/chats/messages")
    return response.data.data.messages

}



