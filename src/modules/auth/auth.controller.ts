import authService from "./auth.service.js";
import { type Request, type Response } from "express";

async function signUp(req: Request, res: Response) {
  const { email, password } = req.body;

  const newUser = await authService.signUp(email, password);

  return res.status(200).json(newUser);
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const newSession = await authService.login(email, password);

  return res.status(200).json(newSession);
}

export default { signUp, login };
