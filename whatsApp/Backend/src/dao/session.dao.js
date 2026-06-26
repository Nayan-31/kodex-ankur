import sessionModel from '../models/session.model.js';

/**
 * Creates a new session for a user with the provided userId and refreshToken.
 * @param {Object} params - The parameters for creating a session.
 * @param {string} params.userId - The ID of the user for whom the session is being created.
 * @param {string} params.refreshToken - The refresh token associated with the session.
 * @returns {Promise<Object>} - The created session object.
 */
export const createSession = async ({ userId, refreshToken }) => {
    const session = await sessionModel.create({ userId, refreshToken });

    return session;
}


/**
 * Retrieves a session by the provided userId.
 * @param {string} userId - The ID of the user for whom to retrieve the session.
 * @returns {Promise<Object|null>} - The retrieved session object or null if not found.
 */
export const getSessionByUserId = async (userId) => {
    const session = await sessionModel.findOne({ userId });

    return session;
};
