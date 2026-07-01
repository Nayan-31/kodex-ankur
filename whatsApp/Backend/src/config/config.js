import { config } from 'dotenv';
config();


if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}

if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined in the environment variables');
}

if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_REFRESH_TOKEN_SECRET is not defined in the environment variables');
}

if (!process.env.REDIS_URI) {
    throw new Error('REDIS_URI is not defined in the environment variables');
}

const _config = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:9000/',
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    REDIS_URI: process.env.REDIS_URI
}

export default Object.freeze(_config);