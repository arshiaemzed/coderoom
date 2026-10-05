import roomsRepository from "../../../modules/rooms/rooms.repository.js";

export async function getAllRooms() {
  const rooms = roomsRepository.getAllRooms();

  return rooms;
}
