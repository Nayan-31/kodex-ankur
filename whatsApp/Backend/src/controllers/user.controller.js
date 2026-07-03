import * as userDao from '../dao/user.dao.js';



/**
 * search a user by the provided username.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - Throws an error if the search operation fails.
 */
export const searchUserByUsername = async (req, res) => {
    const { query } = req.query;

    try {
        const users = await userDao.searchUserByUsername(query);
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: {
                users
            }
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}