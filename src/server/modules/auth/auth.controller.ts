import authService from "./auth.service.js";
import { type Request, type Response } from "express";
import type { AuthSession } from "./auth.types.js";

async function signUp(req: Request, res: Response) {
  const { email, password, display_name } = req.body;

  const newUser = await authService.signUp(email, password, display_name);

  return res.status(200).json(newUser);
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const newSession = await authService.login(email, password);

  res.cookie("session", newSession.token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json(newSession);
}

async function authMe(req: Request, res: Response) {
  const tokenHash = req.cookies.session;

  const session: AuthSession = await authService.authMe(tokenHash);

  return res.status(200).json(session);
}

export default { signUp, login, authMe };
