import { apiHandler } from "../apiHandler";

export async function fetchRooms() {
  const response = await fetch(`http://localhost:3001/rooms`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await apiHandler(response);

  return data;
}

export async function searchRooms(searchStr: string) {
  const response = await fetch(
    `http://localhost:3001/rooms?search=${searchStr}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await apiHandler(response);

  return data;
}
