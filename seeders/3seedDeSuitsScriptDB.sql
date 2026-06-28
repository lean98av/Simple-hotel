-- Seeder de Suits (Habitaciones)
-- 10 habitaciones para cada tipo de suitCategory

-- Habitaciones comunes - Estándar (suitCategoryId = 1)
INSERT INTO suits (id, number, status, deleted, suitCategoryId, createdAt, updatedAt)
VALUES
(DEFAULT, 'A-101', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-102', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-103', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-104', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-105', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-106', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-107', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-108', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-109', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'A-110', 'disponible', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Habitaciones comunes - Doble Estándar (suitCategoryId = 2)
INSERT INTO suits (id, number, status, deleted, suitCategoryId, createdAt, updatedAt)
VALUES
(DEFAULT, 'B-201', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-202', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-203', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-204', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-205', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-206', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-207', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-208', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-209', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'B-210', 'disponible', false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Habitaciones comunes - Triple Estándar (suitCategoryId = 3)
INSERT INTO suits (id, number, status, deleted, suitCategoryId, createdAt, updatedAt)
VALUES
(DEFAULT, 'C-301', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-302', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-303', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-304', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-305', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-306', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-307', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-308', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-309', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'C-310', 'disponible', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Habitaciones premium - Deluxe (suitCategoryId = 4)
INSERT INTO suits (id, number, status, deleted, suitCategoryId, createdAt, updatedAt)
VALUES
(DEFAULT, 'D-401', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-402', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-403', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-404', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-405', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-406', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-407', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-408', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-409', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'D-410', 'disponible', false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Habitaciones premium - Suite Executive (suitCategoryId = 5)
INSERT INTO suits (id, number, status, deleted, suitCategoryId, createdAt, updatedAt)
VALUES
(DEFAULT, 'E-501', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-502', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-503', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-504', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-505', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-506', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-507', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-508', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-509', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'E-510', 'disponible', false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Habitaciones premium - Presidential (suitCategoryId = 6)
INSERT INTO suits (id, number, status, deleted, suitCategoryId, createdAt, updatedAt)
VALUES
(DEFAULT, 'F-601', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-602', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-603', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-604', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-605', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-606', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-607', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-608', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-609', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT, 'F-610', 'disponible', false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
