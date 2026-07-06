import * as conversationDao from '../dao/conversation.dao.js';
import * as userDao from '../dao/user.dao.js';
import * as messageDao from '../dao/message.dao.js';


/**
 * @desc Create a new conversation between two users
 * @route POST /api/chats/conversation
 * @access Private
 */
export const createConversation = async (req, res) => {

    const user = req.userId;
    const { recipientId } = req.body;

    if (!recipientId) {
        return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (user.toString() === recipientId.toString()) {
        return res.status(400).json({ message: 'You cannot create a conversation with yourself' });
    }

    const receiver = await userDao.getUserById(recipientId);

    if (!receiver) {
        return res.status(404).json({ message: 'Recipient user not found' });
    }

    const existingConversation = await conversationDao.getConversationByParticipants([ user, recipientId ]);

    if (existingConversation) {
        return res.status(400).json({
            message: 'Conversation already exists',
            data: {
                conversation: existingConversation,
            }
        });
    }

    const conversation = await conversationDao.createConversation([ user, recipientId ]);

    res.status(201).json({
        message: 'Conversation created successfully',
        data: {
            conversation
        }
    });

}



/**
 * @desc Get all conversations for the authenticated user
 * @route GET /api/chats/conversation
 * @access Private
 */
export const getConversations = async (req, res) => {

    const userId = req.userId;

    const conversations = (await conversationDao.getConversationsByUserId(userId)).map(conversation => {
        const recipient = conversation.participants.find(participant => participant._id.toString() !== userId.toString());
        return {
            _id: conversation._id,
            participants: conversation.participants,
            recipientId: recipient._id,
            username: recipient.username,
            email: recipient.email,
        }
    })

    res.status(200).json({
        message: 'Conversations retrieved successfully',
        data: {
            conversations
        }
    });
}

export const getMessages = async (req, res) => {

    const userId = req.userId;

    const conversations = await conversationDao.getConversationsByUserId(userId);

    const conversationMessages = await Promise.all(conversations.map(async (conversation) => {
        const conversationMessages = await messageDao.getMessagesByConversationId(conversation._id);
        return {
            conversationId: conversation._id,
            messages: conversationMessages
        }
    }));

    /**
     * conversationMessages = [
     * {
     *      conversationId: "conversationId1",
     *     messages: [ { message1 }, { message2 } ]
     * },
     * {
     *      conversationId: "conversationId2",
     *    messages: [ { message1 }, { message2 } ]
     * }
     * ]
     * 
     * messages = {
     *     conversationId1: [ { message1 }, { message2 } ],
     *      conversationId2: [ { message1 }, { message2 } ]
     * }
     * 
     */

    const messages = conversationMessages.reduce((acc, curr) => {
        acc[ curr.conversationId ] = curr.messages;
        return acc;
    }, {})
    res.status(200).json({
        message: 'Messages retrieved successfully',
        data: {
            messages
        }
    })
}