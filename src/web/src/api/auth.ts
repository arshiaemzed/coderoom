import type { User } from "../auth/types";

export async function requsetLogin(
  email: string,
  password: string,
): Promise<User> {
  const response = await fetch("http://localhost:3001/auth/login", {
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

  const data: User = await response.json();

  if (!response.ok) {
    throw new Error("Login failed !");
  }

  return data;
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
