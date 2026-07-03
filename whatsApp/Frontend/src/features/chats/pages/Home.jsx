import { useState, useEffect, useRef } from 'react'
import useAuth from '../../auth/hooks/useAuth'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat'

// SVG Icons
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

const ChatPlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

// Helper to generate consistent, beautiful colors for avatars
const getAvatarColor = (name = "") => {
    const colors = [
        'bg-indigo-500 text-white',
        'bg-teal-500 text-white',
        'bg-amber-500 text-white',
        'bg-rose-500 text-white',
        'bg-emerald-500 text-white',
        'bg-violet-500 text-white',
        'bg-sky-500 text-white',
    ]
    let sum = 0
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i)
    }
    return colors[ sum % colors.length ]
}

const Home = () => {
    const currentUser = useSelector((state) => state.auth.user)
    const { logout } = useAuth()
    const searchUserResult = useSelector((state) => state.chat.searchUserResult)
    const activeConversation = useSelector((state) => state.chat.activeConversation)
    const user = useSelector((state) => state.auth.user)

    const {
        handleSearchUser,
        handleAppendConversation,
        handleSetActiveConversation,
        handleSetConversations,
        createSocketConnection,
        handleSendChatMessage } = useChat()

    // Mock initial conversations (seed data)
    const conversations = useSelector((state) => state.chat.conversations)

    // Mock initial message history
    const [ messages, setMessages ] = useState({
        sarah_jenkins: [
            { id: 1, sender: 'Sarah Jenkins', content: 'Hey! Did you check out the new design constraints?', timestamp: '10:24 AM' },
            { id: 2, sender: 'me', content: 'Yes! The client requested solid colors and plenty of breathing space.', timestamp: '10:25 AM' },
            { id: 3, sender: 'Sarah Jenkins', content: 'Are we still meeting at 3?', timestamp: '10:26 AM' }
        ],
        david_miller: [
            { id: 1, sender: 'David Miller', content: 'Hi there, let me know if you need the updated details.', timestamp: '9:10 AM' },
            { id: 2, sender: 'me', content: 'Sure, please mail them to me.', timestamp: '9:12 AM' },
            { id: 3, sender: 'David Miller', content: 'I sent you the project report.', timestamp: '9:15 AM' }
        ],
        alex_rivera: [
            { id: 1, sender: 'me', content: 'Hey Alex, how is the backend server doing?', timestamp: 'Yesterday' },
            { id: 2, sender: 'alex_rivera', content: 'Working fine. Sockets are setup too.', timestamp: 'Yesterday' },
            { id: 3, sender: 'me', content: 'Perfect.', timestamp: 'Yesterday' },
            { id: 4, sender: 'Alex Rivera', content: 'Thanks, talk to you later!', timestamp: 'Yesterday' }
        ],
        emily_chen: [
            { id: 1, sender: 'emily_chen', content: 'Just saw the staging build.', timestamp: 'Yesterday' },
            { id: 2, sender: 'Emily Chen', content: 'Awesome layout! Looks super clean.', timestamp: 'Yesterday' }
        ],
        marcus_aurelius: [
            { id: 1, sender: 'Marcus Aurelius', content: 'Waste no more time arguing about what a good man should be. Be one.', timestamp: '2 days ago' }
        ]
    })

    const [ activeChatId, setActiveChatId ] = useState(null)
    const [ searchQuery, setSearchQuery ] = useState('')

    const [ inputValue, setInputValue ] = useState('')
    const [ isTyping, setIsTyping ] = useState(false)
    const [ isSearching, setIsSearching ] = useState(false)

    const messagesEndRef = useRef(null)
    const activeChat = conversations.find(c => c.id === activeChatId)

    useEffect(() => {
        createSocketConnection()
    }, [])

    // Scroll to the bottom when the active chat or messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [ activeChatId, messages ])

    // Query backend when search query updates
    useEffect(() => {
        if (!searchQuery.trim()) {
            return
        }

        const delayDebounce = setTimeout(async () => {
            setIsSearching(true)
            try {
                // Filter out the current user themselves
                handleSearchUser(searchQuery)
            } catch (error) {
                console.error('Error searching users on backend:', error)
            } finally {
                setIsSearching(false)
            }
        }, 350) // Debounce delay

        return () => clearTimeout(delayDebounce)
    }, [ searchQuery, currentUser ])

    // Handle sending a message
    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!inputValue.trim() || !activeChatId) return

        const newMessage = {
            id: Date.now(),
            sender: user._id,
            receiver: activeConversation._id,
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        // Append message
        setMessages(prev => ({
            ...prev,
            [ activeChatId ]: [ ...(prev[ activeChatId ] || []), newMessage ]
        }))

        // Update conversation list item last message
        // handleSetConversations(prev => {
        //     return prev.map(c => {
        //         if (c.id === activeChatId) {
        //             return {
        //                 ...c,
        //                 lastMessage: inputValue,
        //                 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        //                 unread: false
        //             }
        //         }
        //         return c
        //     })
        // })

        setInputValue('')

        handleSendMessage(newMessage)




    }

    // Select or initialize a new conversation with a search result
    const handleSelectSearchResult = (user) => {
        const conversationId = user.id || user._id || user.username.toLowerCase().replace(/\s+/g, '_')

        // Check if conversation already exists in active conversations list
        const exists = conversations.some(c => c.id === conversationId)

        if (!exists) {
            // Add new conversation
            const newConv = {
                id: conversationId,
                username: user.username,
                email: user.email,
                lastMessage: 'Tap to start talking!',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: false
            }
            handleAppendConversation(newConv)
        }

        handleSetActiveConversation(conversationId)
        setSearchQuery('')
    }

    // Filter conversations list on search query or fallback to all active conversations
    const filteredConversations = conversations.filter(c =>
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className="h-screen w-screen bg-slate-50 flex overflow-hidden font-sans antialiased text-slate-800">
            {/* LEFT SIDE: Conversations & User tiles */}
            <section className="w-full md:w-[380px] h-full bg-white border-r border-slate-100 flex flex-col shrink-0">
                {/* Current User Profile Info & Actions */}
                <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColor(currentUser?.username || 'Guest')}`}>
                            {(currentUser?.username || 'Guest').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900 leading-tight">
                                {currentUser?.username || 'Guest User'}
                            </h2>
                            <p className="text-xs text-emerald-500 font-medium">Online</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        title="Logout"
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    >
                        <LogoutIcon />
                    </button>
                </header>

                {/* Search Bar */}
                <div className="px-6 py-3 border-b border-slate-50">
                    <div className="relative flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-slate-200 transition-all">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value
                                setSearchQuery(val)
                            }}
                            className="w-full bg-transparent border-0 text-sm ml-2.5 outline-none placeholder-slate-400 text-slate-800"
                        />
                    </div>
                </div>

                {/* User Tiles / Conversations List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {/* Render Backend Search Results if searching */}
                    {searchQuery.trim() !== '' && (
                        <div>
                            <div className="px-6 py-2 bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                {isSearching ? 'Searching database...' : 'Database Users'}
                            </div>
                            {searchUserResult.length === 0 && !isSearching && (
                                <div className="px-6 py-4 text-xs text-slate-400 italic">No global users match "{searchQuery}"</div>
                            )}
                            {searchUserResult.map(user => (
                                <button
                                    key={user._id || user.id}
                                    onClick={() => handleSelectSearchResult(user)}
                                    className="w-full px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 text-left transition-all cursor-pointer"
                                >
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(user.username)}`}>
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-900 truncate text-sm">{user.username}</h4>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">New Chat</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Active Conversations */}
                    <div>
                        {searchQuery.trim() !== '' && (
                            <div className="px-6 py-2 bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                Conversations
                            </div>
                        )}
                        {filteredConversations.length === 0 ? (
                            <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                No conversations found.
                            </div>
                        ) : (
                            filteredConversations.map(conv => {
                                const isActive = conv.id === activeChatId
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => {
                                            setActiveChatId(conv.id)
                                        }}
                                        className={`w-full px-6 py-4 flex items-center gap-3.5 text-left border-l-4 transition-all cursor-pointer ${isActive
                                            ? 'bg-slate-50 border-slate-900'
                                            : 'bg-white border-transparent hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${getAvatarColor(conv.username)}`}>
                                            {conv.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-900 truncate text-sm">{conv.username}</h4>
                                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{conv.timestamp}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <p className={`text-xs truncate ${conv.unread ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                                                    {conv.lastMessage}
                                                </p>
                                                {conv.unread && (
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 ml-2" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* RIGHT SIDE: Chat Messages & Input */}
            <section className="flex-1 h-full flex flex-col bg-slate-50">
                {activeChat ? (
                    <>
                        {/* Active Chat Header */}
                        <header className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(activeChat.username)}`}>
                                    {activeChat.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 leading-tight">{activeChat.username}</h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {isTyping ? (
                                            <span className="text-emerald-500 font-semibold animate-pulse">typing...</span>
                                        ) : (
                                            'online'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </header>

                        {/* Message Log */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            {(messages[ activeChatId ] || []).length === 0 ? (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                                    No messages yet. Say hello!
                                </div>
                            ) : (
                                (messages[ activeChatId ] || []).map((msg) => {
                                    const isMe = msg.sender === 'me'
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${isMe
                                                ? 'bg-slate-900 text-white rounded-tr-none'
                                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                                                }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                <div className="text-[10px] text-right mt-1.5 opacity-60 font-medium leading-none">
                                                    {msg.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-4 bg-white border-t border-slate-100 flex items-center gap-4"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 py-3 px-5 bg-slate-50 border-0 rounded-2xl focus:ring-1 focus:ring-slate-200 transition-all text-sm outline-none placeholder-slate-400 text-slate-800"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className={`rounded-xl p-3 flex items-center justify-center transition-all shadow-sm ${inputValue.trim()
                                    ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </>
                ) : (
                    /* Welcome Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                            <ChatPlaceholderIcon />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg mb-1">Kodex Chat</h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Select a conversation from the sidebar or search for users to start messaging.
                        </p>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Home