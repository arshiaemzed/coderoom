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
