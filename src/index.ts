import express, { Express, NextFunction, Request, Response } from "express";
import publicRoutes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import * as MySQLConnector from "./utils/mysql.connector";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// create database pool
MySQLConnector.init();

// parse incoming request body and append data to `req.body`
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(publicRoutes);

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode || 500).json({
    response: "Error",
    error: {
      statusCode: error.statusCode || error.httpStatus || 500,
      message: error.message,
      httpStatus: error.httpStatus || error.statusCode || 500,
    },
  });
  next(error);
};
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`[local-server]: Server is running at https://localhost:${port}`);
});
