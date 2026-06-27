no me gusta como se arma el enum de status, en la vista adminorders se repite mucho y en todos lados hay que escribir lo mismo

en category.ts la interfaz tiene nulleable id, createdAt updatedAt,  esta asi porque daba error en el create de que faltaban esos properties, en el create de products no son nulleables y no daba error, asi que hay que revisar el impacto

falta un mecanismo de envio de mails al completar una orden o una reserva

agregar pasarela de pagos de mercadopago

al ordenar por precio los precios se redondean, eso se debe quitar