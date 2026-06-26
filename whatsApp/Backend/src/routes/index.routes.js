import { Router } from 'express';
import authRouter from './auth.routes.js';


const indexRouter = Router();


// ––––– use auth routes –––––
indexRouter.use('/auth', authRouter);

export default indexRouter;