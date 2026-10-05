import filesRepository from "../../../modules/files/files.repository.js";

export async function getAllFiles() {
  const files = filesRepository.getAllFiles();

  return files;
}
