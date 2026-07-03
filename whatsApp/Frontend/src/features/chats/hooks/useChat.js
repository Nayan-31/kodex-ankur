import { searchUsers } from "../../shared/global.api"
import { useDispatch } from "react-redux"
import { setSearchUserResult, setActiveConversation, setConversations, appendConversation } from "../state/chat.slice"
import { createSocketConnection, emitEvent } from "../../shared/services/chat.socket"




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

    const handleSendChatMessage = (message) => {
        emitEvent("sendMessage", message)
    }


    return {
        handleSearchUser,
        handleSetActiveConversation,
        handleSetConversations,
        handleAppendConversation,
        createSocketConnection,
        handleSendChatMessage
    }

}

export default useChat