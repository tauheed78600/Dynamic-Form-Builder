import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AuthRoute from './routes/AuthRoute.js';

config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(morgan('dev'));

app.use("/api/auth", AuthRoute);


export default app;
