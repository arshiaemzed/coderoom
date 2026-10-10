export async function fetchRooms() {
  const response = await fetch(`http://localhost:3001/rooms`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the rooms.");
  }

  const data = await response.json();

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

  if (!response.ok) {
    throw new Error("Failed to fetch the rooms.");
  }

  const data = await response.json();

  return data;
}
