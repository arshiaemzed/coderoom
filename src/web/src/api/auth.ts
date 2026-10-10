import { apiHandler } from "../apiHandler";
import type { User } from "../auth/types";

export async function requsetLogin(
  email: string,
  password: string,
): Promise<User> {
  const response: Response = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data: User = await apiHandler(response);

  return data;
}

export async function requestLogout() {
  const response: Response = await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response);
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch(`http://localhost:3001/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }
  const data: User = await response.json();

  return data;
}
