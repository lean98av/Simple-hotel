-- Insertar usuario: escotech / escotech123!
INSERT INTO users (username, password, createdAt, updatedAt)
VALUES ('escotech', 'escotech123!', NOW(), NOW())
ON DUPLICATE KEY UPDATE password = 'escotech123!';
