import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (name, fallback) => {
    const value = process.env[ name ] ?? fallback;

    if (!value) {
        throw new Error(`${name} is required`);
    }

    return value;
};

export const env = {
    port: Number(process.env.PORT || 3000),
    mongodbUri: requiredEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/razorpay_local'),
    jwtSecret: requiredEnv('JWT_SECRET')
};