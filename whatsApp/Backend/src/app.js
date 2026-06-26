import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.routes.js';


const app = express();

// ––––––– middlewares ––––––––––––––––––––––––––
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// –––––––– use routes ––––––––––––––––––––––––––
app.use('/api', indexRouter);



export default app;