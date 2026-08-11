CREATE TABLE rooms(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Unnamed room',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT room_user_id_fk
    FOREIGN KEY (user_id)
    REFERENCES users(id)
)