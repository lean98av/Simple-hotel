-- Seeder de SuitCategories (Categorías de Habitaciones)
-- 6 tipos: simple, doble, triple para Habitaciones comunes y premium

-- Habitaciones comunes
INSERT INTO `suit_categories` (id, name, description, signPrice, categoryId, showToClients, deleted, createdAt, updatedAt)
VALUES
(DEFAULT, 'Estándar', 'Habitación simple con cama individual y servicios básicos.', 15.00, 1, true, false, NOW(), NOW()),
(DEFAULT, 'Doble Estándar', 'Habitación doble con 2 camas individuales y servicios básicos.', 20.00, 1, true, false, NOW(), NOW()),
(DEFAULT, 'Triple Estándar', 'Habitación triple con 3 camas individuales y servicios básicos.', 25.00, 1, true, false, NOW(), NOW());

-- Habitaciones premium
INSERT INTO `suit_categories` (id, name, description, signPrice, categoryId, showToClients, deleted, createdAt, updatedAt)
VALUES
(DEFAULT, 'Deluxe', 'Habitación premium con cama king size y vista al mar.', 50.00, 2, true, false, NOW(), NOW()),
(DEFAULT, 'Suite Executive', 'Suite ejecutiva con 2 habitaciones y sala de estar.', 80.00, 2, true, false, NOW(), NOW()),
(DEFAULT, 'Presidential', 'Suite presidencial con spa, jacuzzi y servicio de mayordomo.', 150.00, 2, true, false, NOW(), NOW());
