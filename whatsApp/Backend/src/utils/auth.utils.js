import jwt from 'jsonwebtoken';
import config from '../config/config.js';


/**
 * Generates a JWT access token for the given userId.
 * @param {string} userId - The ID of the user for whom to generate the access token.
 * @returns {string} - The generated JWT access token.
 */
export const generateAccessToken = (userId) => {
    const accessToken = jwt.sign({ userId }, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return accessToken;
}

/**
 * Generates a JWT refresh token for the given userId.
 * @param {string} userId - The ID of the user for whom to generate the refresh token.
 * @returns {string} - The generated JWT refresh token.
 */
export const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return refreshToken;
}
