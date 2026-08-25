import express from "express";
import "./infrastructure/postgres/pool.js";
import globalErrorHandler from "./shared/middleware/globalErrorHandler.js";
import authRoute from "./modules/auth/auth.routes.js";
import roomsRouter from "./modules/rooms/rooms.routes.js";
import server from "./infrastructure/websocket/server.js";
import filesRouter from "./modules/files/files.routes.js";
import memberRouter from "./modules/member/member.routes.js";
import inviteRouter from "./modules/invite/invite.routes.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(authRoute);

app.use(roomsRouter);

app.use(filesRouter);

app.use(inviteRouter);

app.use(memberRouter);

app.use(globalErrorHandler);

export default app;
