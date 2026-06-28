-- Seeder de Categorías
-- Solo 2 categorías: "Habitaciones comunes" y "Habitaciones premium"
INSERT INTO categories (id, name, description, createdAt, updatedAt)
VALUES
(DEFAULT, 'Habitaciones comunes', 'Opciones básicas y económicas para estadías cortas y económicas.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'Habitaciones premium', 'Habitaciones de lujo con servicios exclusivos y confort superior.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
