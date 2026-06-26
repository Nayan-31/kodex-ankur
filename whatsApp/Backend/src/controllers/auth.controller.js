import * as userDao from '../dao/user.dao.js';
import * as sessionDao from '../dao/session.dao.js';
import * as authUtils from '../utils/auth.utils.js';


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const isUserExists = await userDao.getUserByEmailOrUsername({ email, username });

    if (isUserExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await userDao.createUser({ username, email, password });

    const accessToken = authUtils.generateAccessToken(user._id);
    const refreshToken = authUtils.generateRefreshToken(user._id);

    await sessionDao.createSession({ userId: user._id, refreshToken });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
        message: 'User registered successfully',
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken
        }
    })
}