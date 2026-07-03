import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({

    name: "chat",
    initialState: {
        searchUserResult: [],
        conversations: [],
        activeConversation: null
    },
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
        }
    }
})

export const { setSearchUserResult, setActiveConversation, setConversations, appendConversation } = chatSlice.actions
export default chatSlice.reducer