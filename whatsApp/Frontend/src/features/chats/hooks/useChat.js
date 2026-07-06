import { searchUsers } from "../../shared/global.api"
import { useDispatch } from "react-redux"
import { setSearchUserResult, setActiveConversation, setConversations, appendConversation, appendMessage, setMessages } from "../state/chat.slice"
import { createSocketConnection, emitEvent, addListener } from "../../shared/services/chat.socket"
import { createConversation, getMyConversations, getMessages } from "../services/chats.api"




const useChat = () => {

    const dispatch = useDispatch()

    const handleSearchUser = async (query) => {
        try {
            const users = await searchUsers(query)
            dispatch(setSearchUserResult(users))
        } catch (error) {
            console.error("Error searching users:", error)
            dispatch(setSearchUserResult([]))
        }
    }
    const handleSetActiveConversation = (conversationId) => {
        dispatch(setActiveConversation(conversationId))
    }
    const handleSetConversations = (conversations) => {
        dispatch(setConversations(conversations))
    }
    const handleAppendConversation = (conversation) => {
        dispatch(appendConversation(conversation))
    }

    const handleSendChatMessage = (message, conversationId) => {
        emitEvent("sendMessage", message)
        dispatch(appendMessage({ conversationId, message }))
    }

    const handleCreateConversation = async (recipientId) => {

        try {
            const conversation = await createConversation(recipientId)
            dispatch(appendConversation(conversation))
            dispatch(setActiveConversation(conversation._id))
        } catch (error) {
            console.error("Error creating conversation:", error)
        }


    }

    const handleGetMyConversations = async () => {
        try {
            const conversations = await getMyConversations()
            console.log("conversation: ", conversations)
            dispatch(setConversations(conversations))
        } catch (error) {
            console.error("Error getting conversations:", error)
            dispatch(setConversations([]))
        }
    }

    const handleGetMessages = async () => {
        const messages = await getMessages()
        dispatch(setMessages(messages))
    }


    const setupSocket = () => {

        createSocketConnection()

        addListener("receiveMessage", (message) => {
            console.log(message)

            console.log({ conversationId: message.conversationId, message })

            dispatch(appendMessage({ conversationId: message.conversationId, message }))
        })

    }


    return {
        handleSearchUser,
        handleSetActiveConversation,
        handleSetConversations,
        handleAppendConversation,
        createSocketConnection,
        handleSendChatMessage,
        handleCreateConversation,
        handleGetMyConversations,
        setupSocket,
        handleGetMessages
    }

}

export default useChat