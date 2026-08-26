interface File {
  id: string;
  roomId: string;
  fileName: string;
  content: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { File };
