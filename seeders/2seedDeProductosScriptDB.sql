INSERT INTO products (id, name, price, description, categoryId, showToClients, outStock, createdAt, updatedAt, deleted)
VALUES
-- Categoría 1 - TechShop cargadores (stock disponible)
(DEFAULT, 'Habitación 1', 26.99, 'Habitación para uno', 2, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

-- Categoría 2 - TechShop AirPods (stock disponible)
(DEFAULT, 'Habitación doble', 37.99, 'Habitación para dos personas', 3, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

-- Categoría 3 - TechShop AirPods (stock disponible)
(DEFAULT, 'Habitación triple', 37.99, 'Habitación para tres personas', 4, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

-- Categoría 4 - Catálogo Fundas iP (stock disponible)
(DEFAULT, 'Habitación cuatro', 27.99, 'Habitación para cuatro personas', 5, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

