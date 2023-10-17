INSERT INTO "User" (username, email, password)
VALUES
    ('user1', 'user1@example.com', 'password1'),
    ('user2', 'user2@example.com', 'password2'),
    ('user3', 'user3@example.com', 'password3');

INSERT INTO Checklist (name, user_id)
VALUES
    ('Shopping List', 1), -- Checklist milik User 1
    ('To-Do List', 2),    -- Checklist milik User 2
    ('Grocery List', 1);  -- Checklist milik User 1
