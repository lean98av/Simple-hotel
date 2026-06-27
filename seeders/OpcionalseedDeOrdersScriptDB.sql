INSERT INTO orders (id, products, total, status, createdAt, updatedAt, address, clientName, clientNotes, clientPhone)
VALUES
(DEFAULT, '1,2,3', 149.99, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 1', 'Cliente 1', 'Notas 1', '+34 600 000 001'),
(DEFAULT, '1,2,3', 89.99, 'inProgress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 2', 'Cliente 2', 'Notas 2', '+34 600 000 002'),
(DEFAULT, '1,2,3', 239.97, 'inProgress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 3', 'Cliente 3', 'Notas 3', '+34 600 000 003'),
(DEFAULT, '1,2,3', 459.94, 'payed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 4', 'Cliente 4', 'Notas 4', '+34 600 000 004'),
(DEFAULT, '1,2,3', 99.99, 'cancelled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 5', 'Cliente 5', 'Notas 5', '+34 600 000 005'),
(DEFAULT, '1,2,3', 589.93, 'inProgress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 6', 'Cliente 6', 'Notas 6', '+34 600 000 006'),
(DEFAULT, '1,2,3', 179.98, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 7', 'Cliente 7', 'Notas 7', '+34 600 000 007'),
(DEFAULT, '1,2,3', 119.99, 'payed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 8', 'Cliente 8', 'Notas 8', '+34 600 000 008'),
(DEFAULT, '1,2,3', 319.97, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 9', 'Cliente 9', 'Notas 9', '+34 600 000 009'),
(DEFAULT, '1,2,3', 559.94, 'inProgress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Dirección 10', 'Cliente 10', 'Notas 10', '+34 600 000 010');
