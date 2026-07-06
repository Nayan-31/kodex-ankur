import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import chatRouter from './chat.routes.js';

const indexRouter = Router();


// ––––– use auth routes –––––
indexRouter.use('/auth', authRouter);


// ––––– use user routes –––––
indexRouter.use('/users', userRouter);


// ––––– use chat routes –––––
indexRouter.use('/chats', chatRouter);




export default indexRouter;