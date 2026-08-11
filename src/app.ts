import express from "express";
import "./infrastructure/postgres/pool.js";
import globalErrorHandler from "./shared/middleware/globalErrorHandler.js";
import authRoute from "./modules/auth/auth.routes.js";
import roomsRouter from "./modules/rooms/rooms.routes.js";

const app = express();

app.use(express.json());

app.use(authRoute);

app.use(roomsRouter);

app.use(globalErrorHandler);

export default app;
