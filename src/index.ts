import express, { Express, Request, Response } from 'express';
import publicRoutes from './routes';
import dotenv from 'dotenv';
import * as MySQLConnector from './utils/mysql.connector';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// create database pool
// MySQLConnector.init();

// parse incoming request body and append data to `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(publicRoutes)

app.listen(port, () => {
  console.log(`[local-server]: Server is running at https://localhost:${port}`);
});