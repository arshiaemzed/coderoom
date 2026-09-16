CREATE TABLE room_files(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    file_name VARCHAR(100) NOT NULL, 
    content TEXT NOT NULL,
    uploaded_by UUID NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT room_files_room_id_fk
    FOREIGN KEY (room_id)
    REFERENCES rooms(id),


    CONSTRAINT room_files_uploaded_by_fk
    FOREIGN KEY (uploaded_by)
    REFERENCES users(id)
)