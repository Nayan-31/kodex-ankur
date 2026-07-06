import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({

    name: "chat",
    initialState: {
        searchUserResult: [],
        conversations: [],
        activeConversation: null,
        messages: {},
    },

    /**
     * messages:{
     * id(conversation(rohan)):[message,message],
     * id(conversation(neha)):[message,message]
     * }
     */
    reducers: {
        setSearchUserResult: (state, action) => {
            state.searchUserResult = action.payload
        },
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload
        },
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        appendConversation: (state, action) => {
            state.conversations.push(action.payload)
        },
        appendMessage: (state, action) => {
            const { conversationId, message } = action.payload
            if (!state.messages[ conversationId ]) {
                state.messages[ conversationId ] = []
            }
            state.messages[ conversationId ]?.push(message)
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        }
    }
})

export const { setSearchUserResult, setActiveConversation, setConversations, appendConversation, appendMessage, setMessages } = chatSlice.actions
export default chatSlice.reducer